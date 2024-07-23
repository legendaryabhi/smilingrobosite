'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./logo";
import { FaBookOpen } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { MdOutlineDataset } from "react-icons/md";
import { searchProjects } from "../../../firebaseConfig"; // import the search function

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 2) { // Minimum 3 characters to search
      try {
        const results = await searchProjects(term);
        console.log('Search Results:', results); // Debugging line
        setSearchResults(results.slice(0, 4)); // Limit to 4 results
      } catch (error) {
        console.error("Error searching projects:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between">
      <Logo />

      {/* Search Bar */}
      <div className="relative w-full max-w-xs ml-4 mr-auto">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm.toLocaleLowerCase()}
          onChange={handleSearch}
          className="w-full px-3 py-2 rounded-md bg-slate-800  "
        />
        {searchResults.length > 0 && (
          <ul className="absolute top-12 left-0 w-full bg-slate-800 cursor-pointer rounded-md shadow-lg z-10">
            <p className="p-2 text-gray-400">search results</p>
            {searchResults.map((result) => (
              <Link legacyBehavior href={`/projects/${result.id}`} onClick={() => setSearchTerm("")}>
              <div key={result.id} className="p-2 hover:bg-slate-900">
                  <a>{result.title}</a>
              </div>
              </Link>
            ))}
          </ul>
        )}
      </div>

      {/* Hamburger Menu Button */}
      <button
        className="sm:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
        onClick={toggleMenu}
      >
        <svg
          className="w-6 h-6"
          fill="white"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex space-x-4">
        <Link href="/projects">
          <div className="hover:scale-105 flex items-center text-white">
            <FaRobot className="mr-2" />
            Projects
          </div>
        </Link>
        <Link href="/datasets">
          <div className="hover:scale-105 flex items-center text-white">
            <MdOutlineDataset className="mr-2" />
            Datasets
          </div>
        </Link>
        <Link href="https://smilingrobo.github.io/docs/" target="_blank">
          <div className="hover:scale-105 flex items-center text-white">
            <FaBookOpen className="mr-2" />
            Docs
          </div>
        </Link>
        <Link href="/profile">
          <div className="hover:scale-105 flex items-center text-white">
            <IoPerson className="mr-2" />
            Profile
          </div>
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } sm:hidden absolute top-16 left-0 w-full bg-gray-800 shadow-md z-10`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li>
            <Link href="/projects">
              <div
                className="text-white hover:text-gray-900"
                onClick={toggleMenu}
              >
                <FaRobot className="mr-2" />
                Projects
              </div>
            </Link>
          </li>
          <li>
            <Link href="/datasets">
              <div
                className="text-white hover:text-gray-900"
                onClick={toggleMenu}
              >
                <MdOutlineDataset className="mr-2" />
                Datasets
              </div>
            </Link>
          </li>
          <li>
            <Link href="https://smilingrobo.github.io/docs/">
              <div
                className="text-white hover:text-gray-900"
                onClick={toggleMenu}
              >
                <FaBookOpen className="mr-2" />
                Docs
              </div>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <div
                className="text-white hover:text-gray-900"
                onClick={toggleMenu}
              >
                <IoPerson className="mr-2" />
                Profile
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
