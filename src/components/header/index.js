"use client";
import Link from "next/link";
import Logo from "./logo";
import { useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { MdOutlineDataset } from "react-icons/md";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between">
      <Logo />

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
      <nav className="hidden sm:flex space-x-4 ml-auto">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            color:"white"
          }}
        >
          <FaRobot className="mr-2" />
          <Link href="/projects">Projects</Link>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            color:"white"
          }}
        >
          <MdOutlineDataset className="mr-2" />
          <Link href="/datasets">Datasets</Link>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            color:"white"
          }}
        >
          <FaBookOpen className="mr-2" />
          <Link href="https://smilingrobo.github.io/docs/">Docs</Link>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            color:"white"
          }}
        >
          <IoPerson className="mr-2" />
          <Link href="/profile">Profile</Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } sm:hidden absolute top-16 left-0 w-full  shadow-md z-10`}
        style={{ backgroundColor: "#020011" }}
      >
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                color:"white"
              }}
            >
              <FaRobot className="mr-2" />
              <Link href="/projects" legacyBehavior>
                <a
                  className="text-white-700 hover:text-gray-900"
                  onClick={toggleMenu}
                >
                  Projects
                </a>
              </Link>
            </div>
            
          </li>
          <li>
          <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                color:"white"
              }}
            >
              <MdOutlineDataset className="mr-2"/>
              <Link href="/datasets" legacyBehavior>
                <a
                  className="text-white-700 hover:text-gray-900"
                  onClick={toggleMenu}
                >
                  Datasets
                </a>
              </Link>
            </div>
          </li>
          <li>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                color:"white"
              }}
            >
              <FaBookOpen className="mr-2" />
              <Link
              href="https://smilingrobo.github.io/docs/"
              legacyBehavior
            >
                <a
                  className="text-white-700 hover:text-gray-900"
                  onClick={toggleMenu}
                >
                  Docs
                </a>
              </Link>
            </div>
          </li>
          <li>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                color:"white"
              }}
            >
              <IoPerson className="mr-2" />
              <Link href="/profile" legacyBehavior>
                <a
                  className="text-white-700 hover:text-gray-900"
                  onClick={toggleMenu}
                >
                  Profile
                </a>
              </Link>
            </div>
          </li>
          
          
        </ul>
      </nav>
    </header>
  );
};

export default Header;
