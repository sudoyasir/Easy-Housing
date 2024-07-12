import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-200 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col gap-3">
          <Link to="/">
            <h1 className="font-bold text-sm:text-xl flex flex-wrap">
              <span className="text-slate-500 text-2xl">Easy</span>
              <span className="text-slate-700 text-2xl">Housing</span>
            </h1>
          </Link>
          <p className="text-sm">All rights reserved.</p>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/about" className="hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-blue-600">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/create-listing" className="hover:text-blue-600">
                Create Listing
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
