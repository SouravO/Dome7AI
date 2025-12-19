import React, { useEffect } from "react";
import { motion } from "framer-motion";

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-8 text-gray-300"
          variants={containerVariants}
        >
          {/* Section 1 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              1. What Are Cookies?
            </h2>
            <p className="leading-relaxed">
              Cookies are small text files that are stored on your device
              (computer, tablet, or mobile phone) when you visit our website.
              They help us remember information about your visit, such as your
              preferred language and other settings. Cookies are widely used in
              order to make websites work, or work more efficiently, as well as
              to provide information to the owners of the site.
            </p>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Types of Cookies We Use
            </h2>
            <p className="leading-relaxed mb-4">
              We use the following types of cookies on our website:
            </p>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Essential Cookies
                </h3>
                <p>
                  These cookies are necessary for the website to function
                  properly. They help with basic functions like page navigation
                  and access to secure areas of the website. The website cannot
                  function properly without these cookies.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Analytical/Performance Cookies
                </h3>
                <p>
                  These cookies allow us to recognize and count the number of
                  visitors and to see how visitors move around the website when
                  using it. This helps us improve how our website works, for
                  example, by ensuring that users are finding what they are
                  looking for easily.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Functionality Cookies
                </h3>
                <p>
                  These cookies are used to recognize you when you return to our
                  website. This enables us to personalize our content for you,
                  greet you by name and remember your preferences (for example,
                  your choice of language or region).
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Targeting/Advertising Cookies
                </h3>
                <p>
                  These cookies record your visit to our website, the pages you
                  have visited and the links you have followed. We will use this
                  information to make our website and the advertising displayed
                  on it more relevant to your interests.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Third-Party Cookies
            </h2>
            <p className="leading-relaxed">
              We may allow selected third parties to place cookies through our
              website. These third parties may include analytics providers and
              advertising networks. These third parties use cookies for their own
              purposes, such as to understand your internet usage. You may wish
              to visit the websites of these third parties to review their
              privacy and cookie policies. We do not have access to or control
              over these third-party cookies, and this policy does not cover
              their use.
            </p>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Your Cookie Preferences
            </h2>
            <p className="leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies,
              with the exception of essential cookies which are necessary for
              the operation of the website. You can control and manage cookies
              through your web browser. Most web browsers will tell you how to
              prevent your browser from accepting new cookies, how to have your
              browser notify you when you receive a new cookie, or how to disable
              cookies altogether.
            </p>
            <p className="leading-relaxed">
              If you refuse cookies, you may still use our website, but your
              access to some functionality and features may be restricted.
            </p>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              5. How to Manage Cookies
            </h2>
            <p className="leading-relaxed mb-4">
              The method for managing cookies depends on your web browser. Here
              are instructions for some common browsers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Chrome:</strong> Settings → Privacy and security →
                Cookies and other site data
              </li>
              <li>
                <strong>Firefox:</strong> Preferences → Privacy & Security →
                Cookies and Site Data
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website
                Data
              </li>
              <li>
                <strong>Edge:</strong> Settings → Privacy, search, and services
                → Clear browsing data
              </li>
            </ul>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Cookie Retention Period
            </h2>
            <p className="leading-relaxed">
              The length of time a cookie remains on your device depends on
              whether it is a session or persistent cookie. Session cookies will
              typically expire when you close your web browser. Persistent
              cookies will remain on your device until they expire or you delete
              them. Most of our cookies are persistent and will expire 12 months
              after they are set.
            </p>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Your Consent
            </h2>
            <p className="leading-relaxed">
              When you first visit our website, we will request your consent to
              use non-essential cookies. You can withdraw your consent at any
              time by managing your cookie settings through our cookie
              preference center or your web browser settings.
            </p>
          </motion.section>

          {/* Section 8 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Privacy and Data Protection
            </h2>
            <p className="leading-relaxed">
              Cookies themselves do not contain any personally identifiable
              information. However, personal information we store about you may
              be linked to the information stored in cookies. For more
              information about how we protect your data, please refer to our
              Privacy Policy.
            </p>
          </motion.section>

          {/* Section 9 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in our use of cookies or other operational, legal, or
              regulatory reasons. We will notify you by posting the updated
              Cookie Policy on this page with a new "Last Updated" date.
            </p>
          </motion.section>

          {/* Section 10 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Contact Us
            </h2>
            <p className="leading-relaxed mb-3">
              If you have any questions about this Cookie Policy or our use of
              cookies, please contact us at:
            </p>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="font-semibold mb-2">Dome7AI</p>
              <p>Email: dome7ai@gmail.com</p>
              <p>Regions: India, UAE, Saudi Arabia</p>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CookiePolicy;
