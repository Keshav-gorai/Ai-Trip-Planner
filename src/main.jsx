import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import App from "./App.jsx";
import CreateTrip from "./create-trip/index.jsx";
import ViewTrip from "./view-trip/[tripId]/index.jsx";
import MyTrip from "./my-trips/index.jsx";
import Header from "./components/custom/Header.jsx";
import { Toaster } from "sonner";

// Define the Layout component
const Layout = () => {
  return (
    <div>
      <Header /> {/* Header stays at the top */}
      <main>
        <Outlet /> {/* Render the current route's content */}
      </main>
    </div>
  );
};

// Define the router with Layout as the root
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout as the root element
    children: [
      { path: "/", element: <App /> }, // Render App at "/"
      { path: "/create-trip", element: <CreateTrip /> }, // Render CreateTrip at "/create-trip"
      { path: "/view-trip/:tripId", element: <ViewTrip /> }, // Render ViewTrip at "/view-trip/:tripId"
      { path: "/my-trips", element: <MyTrip /> }, // Render MyTrip at "/my-trips"
    ],
  },
]);

// Render the app
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
