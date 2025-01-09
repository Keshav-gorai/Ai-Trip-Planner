import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Button } from "../ui/button";
import { googleLogout } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import firebaseConfig from "../../service/firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Initialize Firestore
const firestore = getFirestore(app);

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Use useEffect to check if a user is already signed in
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser); // Set user from localStorage if available
    }

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser); // Set the user if they are signed in
        localStorage.setItem("user", JSON.stringify(authUser)); // Save user info to localStorage
      } else {
        setUser(null); // Clear user if they are signed out
        localStorage.removeItem("user"); // Remove user info from localStorage
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      console.log("Signed in user:", user);
      setOpenDialog(false); // Close the dialog after successful sign-in

      localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
      navigate("/my-trips"); // Navigate to "my-trips"
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated.");
      }

      const userDocRef = doc(firestore, "AITrips", auth.currentUser.uid);

      // Attempt to delete the user's document
      await deleteDoc(userDocRef);
      console.log("Document deleted successfully:", userDocRef.path);

      // Sign out from Firebase Auth
      await signOut(auth);

      // Clear local data
      localStorage.clear();
      setUser(null);
      console.log("User logged out successfully.");
    } catch (error) {
      if (error.code === "permission-denied") {
        console.error("Permission denied: Check Firestore rules or document ownership.");
      } else {
        console.error("Error during logout:", error.message);
      }
    }
  };

  return (
    <div className="shadow-sm flex justify-between items-center py-3 px-3">
      <img src="/logo.svg" />
      <div>
        {user ? (
          <div className="flex items-center gap-5">
            <a href="/create-trip">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/my-trips")}
              >
                + Add more Trips
              </Button>
            </a>
            <a href="/my-trips">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/my-trips")}
              >
                My-Trip
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.photoURL}
                  className="h-[35px] w-[35px] rounded-full items-center border-b-slate-800"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer"
                  onClick={async () => {
                    try {
                      await handleSignOut();
                    } catch (error) {
                      console.error("Error removing user data during logout:", error);
                    }
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign-in</Button>
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>Sign in</VisuallyHidden>
            </DialogTitle>
            <DialogDescription>
              <img src="/logo.svg" />
              <h2 className="font-bold text-lg mt-7">Sign in with Google</h2>
              <p>Sign in to the app with Google Authentication</p>
              <Button
                disabled={loading}
                className="w-full mt-5 flex gap-2"
                onClick={signInWithGoogle}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="h-8 w-9 animate-spin" />
                ) : (
                  <>
                    <FcGoogle className="h-8 w-9" />
                    Sign in with Google
                  </>
                )}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
