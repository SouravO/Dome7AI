import React from "react";
import Landing from "../pages/Landing";
import AboutUs from "../pages/AboutUs";
import WhatWeDo from "../pages/WhatWeDo";
import WhatWeOffer from "../pages/WhatWeOffer";
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
  { label: "What We Offer", ariaLabel: "What we offer", link: "#whatweoffer" },
  { label: "Services", ariaLabel: "View our services", link: "#services" },
  { label: "Plans", ariaLabel: "View our plans", link: "#plans" },
  { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
  { label: "Login", ariaLabel: "Login to your account", link: "#login" },
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

const App = () => {
  return (
    <div style={{ background: "#000000", scrollBehavior: "smooth" }}>
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
      <div id="whatweoffer">
        <WhatWeOffer />
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
