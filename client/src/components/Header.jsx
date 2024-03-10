import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Easy</span>
          <span className="text-slate-700">Housing</span>
        </h1>

        <form
          action=""
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>

        <ul className="flex gap-">
          <li className="hidden sm:inline px-3 text-slate-500 hover:text-slate-700 cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:inline px-3 text-slate-500 hover:text-slate-700 cursor-pointer">
            <Link to="/about">About</Link>
          </li>
          <li className="inline-block px-3 text-slate-500 hover:text-slate-700 cursor-pointer">
            <Link to="/sign-in">Sign In</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
