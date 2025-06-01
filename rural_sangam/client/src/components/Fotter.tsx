import React from "react";
import { Link } from "react-router-dom"; // Use react-router-dom for navigation

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 py-16">
      <div className="container mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Links Section */}
          <div className="flex flex-col space-y-6 justify-start items-center md:items-start">
            <h3 className="text-3xl font-bold mb-4 text-white">RuralSangam</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-gray-200 transition-all duration-300 text-lg">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gray-200 transition-all duration-300 text-lg">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-200 transition-all duration-300 text-lg">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col justify-start items-center md:items-start space-y-6">
            <h3 className="text-3xl font-bold mb-4 text-white">Follow Us</h3>
            <div className="flex gap-8 text-gray-400">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-all duration-300 text-lg transform hover:scale-110"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-all duration-300 text-lg transform hover:scale-110"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6 flex flex-col justify-start items-center md:items-start">
            <h3 className="text-3xl font-bold mb-4 text-white">Contact Us</h3>
            <p className="text-gray-400 text-lg hover:text-gray-200 transition-all duration-300">Email: contact@ruralsangam.org</p>
            <p className="text-gray-400 text-lg hover:text-gray-200 transition-all duration-300">Phone: +91-123-456-7890</p>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-16 text-center border-t border-gray-800 pt-8">
          <p className="text-gray-400">© 2025 RuralSangam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
