// src/components/common/Footer.jsx
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/wardrobe" className="text-xl font-bold text-indigo-600">
              Wardrobe
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              Organize your clothes and discover new outfit combinations
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <FiGithub className="text-xl" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <FiTwitter className="text-xl" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Wardrobe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;