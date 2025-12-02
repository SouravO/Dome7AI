import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Landing from "../pages/Landing";
import AboutUs from "../pages/AboutUs";
import WhatWeDo from "../pages/WhatWeDo";
import WhatWeOffer from "../pages/WhatWeOffer";
import ContactUs from "../pages/ContactUs";
import Footer from "../pages/Footer";
import Contact from "../pages/Contact";
import Services from "../pages/Services";
import Model from "../pages/Model";
import Gallery from "../pages/Gallery";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ScrollVelocity from "./components/ui/components/ScrollVelocity";
import StaggeredMenu from "./components/ui/components/StaggeredMenu";

const HomePage = () => {
  return (
    <>
      <div id="home">
        <Landing />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="whatwedo">
        <WhatWeDo />
      </div>
      <div id="whatweoffer">
        <WhatWeOffer />
      </div>
      <div id="services">
        <Services />
      </div>
      {/* <div id="gallery">
        <Gallery />
      </div> */}
      <ScrollVelocity
        texts={["Interior Design Training,", "Enroll Today,"]}
        velocity={100}
        className="custom-scroll-text"
      />
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "#home" },
    { label: "About", ariaLabel: "Learn about us", link: "#about" },
    { label: "What We Do", ariaLabel: "What we do", link: "#whatwedo" },
    {
      label: "What We Offer",
      ariaLabel: "What we offer",
      link: "#whatweoffer",
    },
    { label: "Services", ariaLabel: "View our services", link: "#services" },
    {
      label: "Gallery",
      ariaLabel: "View our gallery",
      link: "/gallery",
      isRoute: true,
    },
    { label: "Plans", ariaLabel: "View our plans", link: "#plans" },
    { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
    {
      label: "Login",
      ariaLabel: "Login to your account",
      link: "/login",
      isRoute: true,
    },
  ];
  const galleryMenuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/#about", isRoute: true },
  ];

  const socialItems = [
    {
      label: "LinkedIn",
      link: "http://www.linkedin.com/in/dome-seven-ai-91362039b",
    },
    {
      label: "Instagram",
      link: "https://www.instagram.com/dome_seven_ai?igsh=MTU1NjBrZjJ0MHl0Mg==",
    },
    {
      label: "Facebook",
      link: "https://www.facebook.com/people/Dome-Seven-Ai/61584208812699/",
    },
  ];

  return (
    <div style={{ background: "#000000", scrollBehavior: "smooth" }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/gallery"
          element={
            <>
              <StaggeredMenu
                position="right"
                items={galleryMenuItems}
                socialItems={socialItems}
                displaySocials={true}
                displayItemNumbering={false}
                menuButtonColor="#fff"
                openMenuButtonColor="#000"
                changeMenuColorOnOpen={true}
                colors={["#1a1a1a", "#2a2a2a"]}
                logoUrl="/logo.png"
                accentColor="#ffffff"
                isFixed={true}
                onMenuOpen={() => console.log("Menu opened")}
                onMenuClose={() => console.log("Menu closed")}
              />
              <Gallery />
            </>
          }
        />
        <Route
          path="/*"
          element={
            <>
              {/* Navigation Menu */}
              <StaggeredMenu
                position="right"
                items={menuItems}
                socialItems={socialItems}
                displaySocials={true}
                displayItemNumbering={false}
                menuButtonColor="#fff"
                openMenuButtonColor="#000"
                changeMenuColorOnOpen={true}
                colors={["#1a1a1a", "#2a2a2a"]}
                logoUrl="/logo.png"
                accentColor="#ffffff"
                isFixed={true}
                onMenuOpen={() => console.log("Menu opened")}
                onMenuClose={() => console.log("Menu closed")}
              />
              <HomePage />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
