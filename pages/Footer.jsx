import React from "react";
import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

const Footer = () => {
  // const addressLines = ["Ck Tower,Kannur Rd, West Nadakkave,"];
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-0 pb-8 sm:pb-12 md:pb-16">
        {/* Mobile and Tablet Layout */}
        <div className="block lg:hidden">
          {/* Brand */}
          <div className="text-center mb-8 sm:mb-10">
            <img src="/LogoFull.png" alt="Dome7AI Logo" className="mx-auto" />
          </div>

          {/* Menu & Social in Two Columns on Mobile/Tablet */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-10">
            {/* Menu */}
            <div className="text-center">
              <h4 className="text-xs tracking-widest mb-4 text-gray-400">
                MENU
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    ABOUT US
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    SERVICES
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    CONTACT US
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="text-center">
              <h4 className="text-xs tracking-widest mb-4 text-gray-400">
                FOLLOW US
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.instagram.com/dome_seven_ai?igsh=MTU1NjBrZjJ0MHl0Mg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    INSTAGRAM
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/people/Dome-Seven-Ai/61584208812699/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    FACEBOOK
                  </a>
                </li>

                <li>
                  <a
                    href="http://www.linkedin.com/in/dome-seven-ai-91362039b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    LINKEDIN
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Full Width */}
          <div className="text-center">
            <h4 className="text-xs tracking-widest mb-4 text-gray-400">
              CONTACT
            </h4>
            <div className="space-y-2 text-sm">
              {/* India , UAE , Saudi Arabia */}
              <p className="font-bold">India, UAE, Saudi Arabia</p>
              <p className="mt-4">
                <a
                  href="mailto:HELLO@SOLHAUS.STUDIO"
                  className="hover:opacity-70 transition-opacity"
                >
                  dome7ai@gmail.com
                </a>
              </p>
              {/* <p className="mt-2">
                <a
                  href="tel:+351912345678"
                  className="hover:opacity-70 transition-opacity"
                >
                  +91 8086762014
                </a>
              </p> */}
            </div>
          </div>
        </div>

        {/* Desktop Layout - 3 Equal Columns */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-12 xl:gap-16">
          {/* Brand */}
          <div>
            <img
              src="/LogoFull.png"
              alt="Dome7AI Logo"
              className="w-32 h-auto"
            />
          </div>

          {/* Menu & Social Combined */}
          <div className="flex gap-16">
            {/* Menu */}
            <div className="flex-1">
              <h4 className="text-xs tracking-widest mb-4 text-gray-400">
                MENU
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    ABOUT US
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    SERVICES
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            {/* https://www.instagram.com/dome_seven_ai?igsh=MTU1NjBrZjJ0MHl0Mg== */}
            {/* https://www.facebook.com/share/p/19zb8gPjjT/ */}
            {/* http://www.linkedin.com/in/dome-seven-ai-91362039b */}
            <div className="flex-1">
              <h4 className="text-xs tracking-widest mb-4 text-gray-400">
                FOLLOW US
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.instagram.com/dome_seven_ai?igsh=MTU1NjBrZjJ0MHl0Mg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    INSTAGRAM
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/people/Dome-Seven-Ai/61584208812699/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    Facebook
                  </a>
                </li>

                <li>
                  <a
                    href="http://www.linkedin.com/in/dome-seven-ai-91362039b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    LINKEDIN
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest mb-4 text-gray-400">
              CONTACT
            </h4>
            {/*  West Nadakkave, Vandipetta, Vellayil, Kozhikode, Kerala 673011
             */}
            <div className="space-y-2 text-sm">
              {/* India , UAE , Saudi Arabia in a highlighted way*/}
              <p className="font-bold">India, UAE, Saudi Arabia</p>
              <p className="mt-4">
                <a
                  href="mailto:HELLO@SOLHAUS.STUDIO"
                  className="hover:opacity-70 transition-opacity"
                >
                  Dome7ai@gmail.com
                </a>
              </p>
              {/* <p className="mt-2">
                <a
                  href="tel:+351912345678"
                  className="hover:opacity-70 transition-opacity"
                >
                  +91 8086762014
                </a>
              </p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Text Marquee */}
      {/* Bottom Footer Section */}
      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2025 Dome7AI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                to="/terms-and-conditions"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link to="/cookie-policy" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
