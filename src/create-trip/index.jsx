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

  // SAMPLE CODE FOR AUTHORIZATION
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome ${user.displayName}`);
      setOpenDialog(false); // Close the dialog after successful login
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };
  // SAMPLE CODE FOR THE DETAILS OF THE TRIP
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

  // SAMPLE CODE FOR SAVING THE DATA IN THE DATABASE
  const SaveAiTrip = async (TripData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docID = Date.now().toString();
      const itineraryArray = Object.entries(JSON.parse(TripData).itinerary).map(([day, plan]) => ({
        day,
        plan: Array.isArray(plan) ? plan : [plan],
       
      }));
      await setDoc(doc(db, "AITrips", docID), {
        Id: docID,
        userSelection: formData,
        tripData: {
          ...JSON.parse(TripData),
          itinerary: itineraryArray// Ensure itinerary is stored as an array
        },
        userEmail: user?.email,
      });
      navigate("/view-trip/" + docID);
    } catch (error) {
      console.error("Error saving trip to Firestore:", error);
      toast.error("Failed to save the trip. Please try again.");
    }
  };

  // CODE FOR DESIGNING THE INTERFACE

  return (
    <div className="sm:px-8 md:px-32 lg:px-52 xl:px-28 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell me about your travel preferences 🏕️🌴
      </h2>
      <p className="mt-5 text-green-700 text-xl">
        Just provide some basic information, and this trip planner app will
        generate a customized itinerary based on your preferences
      </p>
      <div>
        <div className="mx-14 mt-14">
          <h2 className="text-xl font-bold">
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
      <div className="mx-14 mt-5">
        <h2 className="text-xl font-bold">
          Mention the number of days, you are planning for the trip!!
        </h2>
        <input
          type="number"
          placeholder="Example:- 3"
          className=" w-full p-2 mt-2 rounded-md border-2 border-slate-500"
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
      </div>
      <div className="mx-14 mt-16">
        <h2 className="text-xl font-bold text-green-900">
          Please mention your budget!! <br />
          The budget is exclusively allocated for activities and dining
          purposes.
        </h2>
      </div>
      <div className="grid grid-cols-3 mx-14 mt-5 gap-5">
        {SelectBudgetOption.map((item, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
                ${formData?.budget == item.title && "shadow-lg border-black"}
                `}
            onClick={() => handleInputChange("budget", item.title)}
          >
            <h2 className="text-4xl">{item.icon}</h2>
            <h2 className="font-semibold text-lg">{item.title}</h2>
            <h2 className="text-md text-gray-600">{item.desc}</h2>
          </div>
        ))}
      </div>
      <div className="mx-14 mt-8">
        <h2 className="text-xl font-bold text-green-900">
          Who do you travelling with on your next adventurous Destination!!
        </h2>
      </div>
      <div className="grid grid-cols-4 mx-14 mt-5 gap-5">
        {SelectTravelsList.map((item, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
                ${
                  formData?.traveller == item.People && "shadow-lg border-black"
                }
                `}
            onClick={() => handleInputChange("traveller", item.People)}
          >
            <h2 className="text-4xl">{item.icon}</h2>
            <h2 className="font-semibold text-lg">{item.title}</h2>
            <h2 className="text-md text-gray-600">{item.desc}</h2>
          </div>
        ))}
      </div>
      <div className="my-10 justify-end flex mx-14">
        <Button diabled={loading} onClick={OnGenerateTrip}>
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
              <img src="/logo.svg" />
              <h2 className="font-bold text-lg mt-7 ">Sign in with Google</h2>
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
