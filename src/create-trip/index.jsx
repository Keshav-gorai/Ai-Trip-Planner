import React, { useEffect, useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete";
import {
  AI_PROMPT,
  SelectBudgetOption,
  SelectTravelsList,
} from "../constants/options";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { chatSession } from "../service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../service/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function CreateTrip() {
  const navigate = useNavigate();
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome ${user.displayName}`);
      setOpenDialog(false);
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (formData?.noOfDays > 10 && !formData?.location) ||
      !formData?.budget ||
      !formData?.traveller
    ) {
      toast("Please fill all the details");
      console.log("Please Enter less than 10 days");
      return;
    }

    setLoading(true);
    try {
      const FINAL_PROMPT = AI_PROMPT.replace("Location", formData?.Location)
        .replace("totalDays", formData?.noOfDays)
        .replace("traveller", formData?.traveller)
        .replace("budget", formData?.budget)
        .replace("totalDays", formData?.noOfDays);

      console.log(FINAL_PROMPT);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("--", result?.response?.text());
      await SaveAiTrip(result?.response?.text());
      toast.success("Trip successfully generated!");
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate the trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      // Retrieve the user data from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Log the user data to check if it's being retrieved properly
      console.log("User from localStorage:", user);
  
      // Check if the user object exists and contains email
      if (!user || !user.email) {
        toast.error("User is not logged in or email is missing. Please sign in.");
        return;
      }
  
      // Generate a new document ID
      const docID = Date.now().toString();
  
      // Ensure TripData contains valid itinerary and parse it
      const parsedTripData = JSON.parse(TripData);
      const itineraryArray = Object.entries(parsedTripData.itinerary || {}).map(
        ([day, plan]) => ({
          day,
          plan: Array.isArray(plan) ? plan : [plan],
        })
      );
  
      // Save the trip data to Firestore
      await setDoc(doc(db, "AITrips", docID), {
        Id: docID,
        userSelection: formData,
        tripData: {
          ...parsedTripData,
          itinerary: itineraryArray,
        },
        userEmail: user.email, // Ensure user email is included
      });
  
      // Navigate to the view page after saving
      navigate("/view-trip/" + docID);
  
    } catch (error) {
      console.error("Error saving trip to Firestore:", error);
      toast.error("Failed to save the trip. Please try again.");
    }
  };
  
  

  return (
    <div className="sm:px-8 md:px-12 lg:px-20 xl:px-28 px-5 mt-10">
      <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center">
        Tell me about your travel preferences 🏕️🌴
      </h2>
      <p className="mt-5 text-green-700 text-base sm:text-lg md:text-xl text-center">
        Just provide some basic information, and this trip planner app will
        generate a customized itinerary based on your preferences.
      </p>
      <div>
        <div className="mx-4 sm:mx-8 lg:mx-14 mt-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Give a choice of your Destination!!
          </h2>
          <LocationAutocomplete
            onSelect={(v) => {
              setPlace(v);
              handleInputChange("Location", v);
            }}
          />
        </div>
      </div>
      <div className="mx-4 sm:mx-8 lg:mx-14 mt-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          Mention the number of days you are planning for the trip!!
        </h2>
        <input
          type="number"
          placeholder="Example: 3"
          className="w-full p-2 mt-2 rounded-md border-2 border-gray-300 focus:ring focus:ring-green-500"
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
      </div>
      <div className="mx-4 sm:mx-8 lg:mx-14 mt-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900">
          Please mention your budget!! <br />
          The budget is exclusively allocated for activities and dining purposes.
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-4 sm:mx-8 lg:mx-14 mt-5 gap-5">
        {SelectBudgetOption.map((item, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
              formData?.budget === item.title && "shadow-lg border-black"
            }`}
            onClick={() => handleInputChange("budget", item.title)}
          >
            <h2 className="text-3xl md:text-4xl">{item.icon}</h2>
            <h2 className="font-semibold text-md md:text-lg">{item.title}</h2>
            <h2 className="text-sm md:text-md text-gray-600">{item.desc}</h2>
          </div>
        ))}
      </div>
      <div className="mx-4 sm:mx-8 lg:mx-14 mt-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900">
          Who are you traveling with?
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-4 sm:mx-8 lg:mx-14 mt-5 gap-5">
        {SelectTravelsList.map((item, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
              formData?.traveller === item.People && "shadow-lg border-black"
            }`}
            onClick={() => handleInputChange("traveller", item.People)}
          >
            <h2 className="text-3xl md:text-4xl">{item.icon}</h2>
            <h2 className="font-semibold text-md md:text-lg">{item.title}</h2>
            <h2 className="text-sm md:text-md text-gray-600">{item.desc}</h2>
          </div>
        ))}
      </div>
      <div className="my-10 justify-end flex">
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? (
            <AiOutlineLoading3Quarters className="w-7 h-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" />
              <h2 className="font-bold text-lg mt-7">Sign in with Google</h2>
              <p>Sign in to the app with Google Authentication</p>
              <Button
                disabled={loading}
                className="w-full mt-5 flex gap-2"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="h-8 w-9" />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
