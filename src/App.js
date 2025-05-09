import React, { Suspense, useEffect, useState } from "react";

// ** Router Import
import Router from "./router/Router";

// ** SweetAlert2
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const App = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  useEffect(() => {
    const checkGeolocation = async () => {
      if (!navigator.geolocation) {
        showLocationAlert();
        return;
      }

      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "denied") {
          showLocationAlert();
          return;
        }

        navigator.geolocation.getCurrentPosition(
          () => {
            // Location granted
          },
          () => {
            showLocationAlert();
          }
        );
      } catch (error) {
        console.log({appErrorLocation:error})
        showLocationAlert();
      }
    };

    const showLocationAlert = () => {
      MySwal.fire({
        icon: "warning",
        title: "Enable Location",
        text: "Please turn on your browser’s location to use this site",
        // imageUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Example location icon
        // imageWidth: 100,
        // imageHeight: 100,
        imageAlt: "Location Icon",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    };

    checkGeolocation();
  }, []);
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
