import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const addressLines = ["Ck Tower,Kannur Rd, West Nadakkave,"];
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
                    href="#portfolio"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    PORTFOLIO
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
                    href="#journal"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    JOURNAL
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
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    INSTAGRAM
                  </a>
                </li>
                <li>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    PINTEREST
                  </a>
                </li>
                <li>
                  <a
                    href="https://behance.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    BEHANCE
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
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
              <p>CK Tower,Kannur Rd, West Nadakkave,</p>
              <p>Vandipetta, Vellayil, Kozhikode, Kerala</p>
              <p>673011</p>
              <p className="mt-4">
                <a
                  href="mailto:HELLO@SOLHAUS.STUDIO"
                  className="hover:opacity-70 transition-opacity"
                >
                  dome7ai@gmail.com
                </a>
              </p>
              <p className="mt-2">
                <a
                  href="tel:+351912345678"
                  className="hover:opacity-70 transition-opacity"
                >
                  +351 912 345 678
                </a>
              </p>
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
              <p> CK Tower,Kannur Rd, West Nadakkave,</p>
              <p>Vandipetta, Vellayil, Kozhikode, Kerala</p>
              <p> 673011</p>
              <p className="mt-4">
                <a
                  href="mailto:HELLO@SOLHAUS.STUDIO"
                  className="hover:opacity-70 transition-opacity"
                >
                  Dome7ai@gmail.com
                </a>
              </p>
              <p className="mt-2">
                <a
                  href="tel:+351912345678"
                  className="hover:opacity-70 transition-opacity"
                >
                  +351 912 345 678
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Text Marquee */}
      <div className="bg-gray-900 py-4 sm:py-6 overflow-hidden relative">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -1000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 15,
              ease: "linear",
            },
          }}
        >
          {/* Repeat the text multiple times for seamless loop */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center">
              <span
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mx-4 sm:mx-6 md:mx-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                GET IN TOUCH
              </span>
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mx-4 sm:mx-6 md:mx-8">
                +
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
