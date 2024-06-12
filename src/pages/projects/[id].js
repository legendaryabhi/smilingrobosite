"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Logo from "../../components/header/logo";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm"; // Adding GitHub flavored markdown support

import { FaBookOpen } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";

import "../../app/globals.css";

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = doc(db, "projects", id);
        const projectSnapshot = await getDoc(projectDoc);
        if (projectSnapshot.exists()) {
          setProject({ id: projectSnapshot.id, ...projectSnapshot.data() });
          console.log("Fetched project description: ", projectSnapshot.data().description);
        } else {
          console.error("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between">
      <Logo />

      {/* Hamburger Menu Button */}
      <button
        className="sm:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
        onClick={toggleMenu}
      >
        <svg
          className="w-6 h-6"
          fill="none"
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
              }}
            >
              <FaBookOpen className="mr-2" />
              <Link
              href="https://legendaryabhi.github.io/smilingrobo/"
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
              }}
            >
              <IoPerson className="mr-2" />
              <Link href="/profile" legacyBehavior>
                <a
                  className="text-white-700 hover:text-gray-900"
                  onClick={toggleMenu}
                >
                  Docs
                </a>
              </Link>
            </div>
          </li>
          
          
        </ul>
      </nav>
    </header>

      <div className="bg-gray-800 p-12 font-mono">
        <h1 className="text-4xl font-bold text-white">{project.title}</h1>
        <p className=" pb-3 whitespace-pre-line break-words text-gray-400">By {project.userName}</p>
        <h2
          className="mt-4 inline-block border border-gray-400 text-white px-3 py-1.5 rounded transition duration-300 ease-in-out hover:bg-gray-600"
          style={{ fontSize: "1rem" }}
        >
          {project.tags}
        </h2>
      </div>
      
      <div className="p-8 font-mono">
        <ReactMarkdown remarkPlugins={[remarkHtml, remarkGfm]}>
          {project.description}
        </ReactMarkdown>
      </div>

      <div className="flex flex-col items-center">
        <a
          href={project.url}
          download
          className="mt-8 mb-20 bg-green-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600"
        >
          Download Files
        </a>
      </div>
    </div>
  );
}
