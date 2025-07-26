import React, { useEffect } from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import CosmicScene from "../components/CosmicScene";

function HomePage() {
  useEffect(() => {
    document.body.classList.add("cosmic-body-active");

    return () => {
      document.body.classList.remove("cosmic-body-active");
    };
  }, []);

  return (
    <div className="relative flex">
      <div className="absolute top-0 left-0 z-[5000] w-screen h-full  flex flex-col bg-black/10">
        <Header />
        <Body />
      </div>
      <div className="cosmic-container">
        <CosmicScene />
      </div>
    </div>
  );
}

export default HomePage;
