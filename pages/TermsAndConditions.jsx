import React, { useEffect } from "react";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
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
            Terms & Conditions
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
              1. Agreement to Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement. These Terms
              and Conditions govern your use of the Dome7AI website and services
              ("Services"). If you do not agree to abide by the above, please do
              not use this service. We reserve the right to make changes to
              these terms and conditions at any time without notice.
            </p>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Use License
            </h2>
            <p className="leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Dome7AI's website for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modifying or copying the materials</li>
              <li>
                Using the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                Attempting to decompile, reverse engineer, disassemble, or
                hacking the materials
              </li>
              <li>
                Removing any copyright or other proprietary notations from the
                materials
              </li>
              <li>
                Transferring the materials to another person or "mirroring" the
                materials on any other server
              </li>
              <li>
                Using the materials for any purpose that is unlawful or
                prohibited by these terms
              </li>
            </ul>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Disclaimer
            </h2>
            <p className="leading-relaxed">
              The materials on Dome7AI's website are provided on an 'as is'
              basis. Dome7AI makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights. Further, Dome7AI does not warrant or make any
              representations concerning the accuracy, likely results, or
              reliability of the use of the materials on its website or
              otherwise relating to such materials or on any sites linked to this
              site.
            </p>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Limitations
            </h2>
            <p className="leading-relaxed">
              In no event shall Dome7AI or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Dome7AI's website, even if
              Dome7AI or an authorized representative has been notified orally
              or in writing of the possibility of such damage.
            </p>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="leading-relaxed">
              The materials appearing on Dome7AI's website could include
              technical, typographical, or photographic errors. Dome7AI does not
              warrant that any of the materials on its website are accurate,
              complete, or current. Dome7AI may make changes to the materials
              contained on its website at any time without notice.
            </p>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Links
            </h2>
            <p className="leading-relaxed">
              Dome7AI has not reviewed all of the sites linked to its website
              and is not responsible for the contents of any such linked site.
              The inclusion of any link does not imply endorsement by Dome7AI of
              the site. Use of any such linked website is at the user's own risk.
            </p>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Modifications
            </h2>
            <p className="leading-relaxed">
              Dome7AI may revise these terms of service for its website at any
              time without notice. By using this website, you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
          </motion.section>

          {/* Section 8 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Governing Law
            </h2>
            <p className="leading-relaxed">
              These terms and conditions are governed by and construed in
              accordance with the laws of India, and you irrevocably submit to
              the exclusive jurisdiction of the courts in that location.
            </p>
          </motion.section>

          {/* Section 9 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              9. User Content
            </h2>
            <p className="leading-relaxed">
              Users may post comments, feedback, and other content on our
              website. You retain all rights to any content you submit, post or
              display on or through the website. By submitting content, you grant
              Dome7AI a worldwide, non-exclusive, royalty-free license to use,
              copy, reproduce, process, adapt, modify, publish, transmit, display
              and distribute such content in any media or medium and for any
              purposes.
            </p>
          </motion.section>

          {/* Section 10 */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Contact Information
            </h2>
            <p className="leading-relaxed mb-3">
              If you have any questions about these Terms and Conditions, please
              contact us at:
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

export default TermsAndConditions;
