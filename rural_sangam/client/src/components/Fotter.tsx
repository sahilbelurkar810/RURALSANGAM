import React from "react";
import { Link } from "react-router"; // Use react-router-dom for navigation

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Links Section */}
          <div className="flex flex-col space-y-4 justify-start items-center">
            <h3 className="text-2xl font-semibold mb-4">RuralSangam</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-blue-300 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-300 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-300 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col justify-start items-center space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-6 text-gray-400">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4 flex flex-col justify-start items-center">
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">Email: contact@ruralsangam.org</p>
            <p className="text-gray-400">Phone: +91-123-456-7890</p>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 text-center ">
          <p>© 2025 RuralSangam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
