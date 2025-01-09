import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../service/firebaseConfig";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import Info from "../components/Info";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No Such Data");
      toast("No Trip Found");
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-45 xl:px-56">
      {/*Information Section*/}

      <Info trip={trip} />

      {/*Recomended Hotels*/}

      <Hotels trip={trip}/>

      {/*Iternary*/}

      <PlacesToVisit trip = {trip}/>

      {/* Footer Section */}

      <Footer trip={trip}/>
      
    </div>
  );
}

export default ViewTrip;
