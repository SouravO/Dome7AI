import React from "react";
import Landing from "../pages/Landing";
import AboutUs from "../pages/AboutUs";
import WhatWeDo from "../pages/WhatWeDo";
import ContactUs from "../pages/ContactUs";
import Footer from "../pages/Footer";
import Contact from "../pages/Contact";
import Services from "../pages/Services";
import Model from "../pages/Model";
import ScrollVelocity from "./components/ui/components/ScrollVelocity";
import StaggeredMenu from "./components/ui/components/StaggeredMenu";

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "#home" },
  { label: "About", ariaLabel: "Learn about us", link: "#about" },
  { label: "What We Do", ariaLabel: "What we do", link: "#whatwedo" },
  { label: "Services", ariaLabel: "View our services", link: "#services" },
  { label: "3D Model", ariaLabel: "View 3D model", link: "#model" },
  { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "Instagram", link: "https://instagram.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

const App = () => {
  return (
    <div style={{ background: "#000000", scrollBehavior: "smooth" }}>
      {/* Navigation Menu */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={true}
        colors={["#1a1a1a", "#2a2a2a"]}
        logoUrl="/logo.svg"
        accentColor="#ffffff"
        isFixed={true}
        onMenuOpen={() => console.log("Menu opened")}
        onMenuClose={() => console.log("Menu closed")}
      />

      {/* Page Content */}
      <div id="home">
        <Landing />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="whatwedo">
        <WhatWeDo />
      </div>
      <div id="services">
        <Services />
      </div>

      {/* <ContactUs /> */}
      <ScrollVelocity
        texts={["Interior Design Training,", "Enroll Today,"]}
        velocity={100}
        className="custom-scroll-text"
      />
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default App;
