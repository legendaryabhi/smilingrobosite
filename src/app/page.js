"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Link from "next/link";

function truncateString(str, numCharacters) {
  if (str.length <= numCharacters) {
    return str;
  } else {
    return str.slice(0, numCharacters) + " ...";
  }
}

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectsQuery = query(projectsCollection, orderBy("timestamp", "desc"), limit(7));
      const projectSnapshot = await getDocs(projectsQuery);
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
    };

    fetchProjects();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-24 font-mono">
      <h1 className="text-3xl font-bold mb-6">Trending Projects</h1>
      <div className="overflow-x-auto max-w-full">
        <div className="flex flex-wrap justify-center gap-8 sm:gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-full sm:w-80 h-60 rounded-lg shadow-md mb-4 bg-gray-700 hover:bg-gray-900 transition-colors"
            >
              <Link href={`/projects/${project.id}`} legacyBehavior>
                <a>
                  <h2 className="px-4 py-2 text-xl font-bold text-white-700">
                    {truncateString(project.title, 80)}
                  </h2>
                </a>
              </Link>
              <p className="px-4 pb-3 whitespace-pre-line break-words text-gray-400">By {project.userName}</p>
              <p className="px-4 py-2 whitespace-pre-line break-words text-whitesmoke">
                {truncateString(project.subtitle, 100)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
