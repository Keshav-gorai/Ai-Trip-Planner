import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
initializeApp(firebaseConfig);

const GoogleAuth = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Function to handle Google Sign-In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      console.log("Signed in user:", user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Google Authentication</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt={user.displayName} style={{ borderRadius: "50%" }} />
          <p>Email: {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
};

export default GoogleAuth;

