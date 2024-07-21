"use client";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { db , auth} from "../../firebaseConfig";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import { Circles } from "react-loader-spinner";
import { IoIosTrendingUp } from "react-icons/io";
import { onAuthStateChanged } from "firebase/auth";
import { GiOpenChest } from "react-icons/gi";
import Image from "next/image";
import { FaCircleStop } from "react-icons/fa6";
import Logo from "@/components/header/logo";
import img from "../../public/images/img.png";
import img2 from "../../public/images/img2.png";

function truncateString(str, numCharacters) {
  if (str.length <= numCharacters) {
    return str;
  } else {
    return str.slice(0, numCharacters) + " ...";
  }
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [user, setUser] = useState(null);
  const [showbanner, setShowbanner] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectsQuery = query(
        projectsCollection,
        where("trending", "==", "yes"),
        where("done", "==", "yes"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const projectSnapshot = await getDocs(projectsQuery);
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
      setLoadingProjects(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchDatasets = async () => {
      const datasetsCollection = collection(db, "datasets");
      const datasetsQuery = query(
        datasetsCollection,
        where("trending", "==", "yes"),
        where("done", "==", "yes"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const datasetsSnapshot = await getDocs(datasetsQuery);
      const datasetsList = datasetsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDatasets(datasetsList);
      setLoadingDatasets(false);
    };
    fetchDatasets();
  }, []);

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      setShowbanner(false);
    } else {
      setShowbanner(true);
    }
    return () => unsubscribe();

  });

  const isLoading = loadingProjects || loadingDatasets;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 lg:px-20 lg:pb-24 lg:pt-10 font-mono">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
        {showbanner && (
        
      
        <div className="p-8  mt-12 mb-12 text-white rounded-lg bg-slate-950  transition-transform transform hover:scale-105 shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col items-center space-y-2 w-full sm:w-1/3">
              <Logo className="h-10 w-10 mb-2 align-start" />

              <h2 className="text-white text-3xl">
                Building Open Source Robotics
              </h2>
              <p  className="text-gray-300 text-base">Opensource Robotics Platform with opensource tools and resources. We're on a journey to advance and democratize robotics through opensource.</p>
              <Link legacyBehavior href="/projects" passHref>
                <a className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                  See Projects
                </a>
              </Link>
            </div>

            <div className="w-full sm:w-2/3 mt-4">
              <Image
                src={img2}
                alt="SmilingRobo"
                width={1000}
                height={800}
                className="rounded-lg transform rotate-6"
              />
            </div>
          </div>
          )}

          <div className="flex items-center justify-center w-full mt-12 mb-12">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="flex items-center px-4">
              
              {/* <Logo className="h-8 w-8 mr-2" /> Adjust the className to fit your logo size */}
              <h2 className="text-3xl font-bold text-white text-center">
                Trending on SmilingRobo
              </h2>
            </div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col lg:flex-row justify-center lg:items-start lg:justify-center w-full gap-4 lg:gap-20 mb-36">
            <div className="flex flex-col items-center  ">
              <h3 className="text-2xl mb-4 text-white">Projects 📦</h3>
              <div className="overflow-x-auto max-w-full ">
                <div className="flex flex-col items-center gap-2">
                  {projects.map((project) => (
                    <Link
                      href={`/projects/${project.id}`}
                      legacyBehavior
                      key={project.id}
                    >
                      <div className="w-full cursor-pointer sm:w-full sm:h-20 h-32 rounded-lg text-white shadow-md mb-4 bg-emerald-800 hover:bg-gray-900 transition-colors flex flenterex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start px-4 py-2">
                            <h2 className="text-lg text-white-700">
                              {truncateString(project.title, 20)}
                            </h2>
                            <div className="flex flex-row space-x-2">
                              <FaStar style={{ height: "24px" }} />
                              <p className="whitespace-pre-line break-words text-blue-400">
                                {project.star}
                              </p>
                              {project.trending ? (
                                <IoIosTrendingUp style={{ height: "24px" }} />
                              ) : null}
                            </div>
                          </div>
                          <p className="px-4 py-1 whitespace-pre-line break-words text-whitesmoke">
                            {truncateString(project.subtitle, 45)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link legacyBehavior href={`/projects`} passHref>
                    <h3 className="cursor-pointer underline hover:scale-x-105 hover:text-lime-600">
                      Browse more
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center ">
              <h3 className="text-2xl mb-4 text-white">Datasets ⏺️</h3>
              <div className="overflow-x-auto max-w-full ">
                <div className="flex flex-col items-center gap-2">
                  {datasets.map((dataset) => (
                    <Link
                      legacyBehavior
                      href={`/datasets/${dataset.id}`}
                      passHref
                      key={dataset.id}
                    >
                      <div className="w-full cursor-pointer sm:h-20 h-32 rounded-lg text-white shadow-md mb-4 bg-cyan-800 hover:bg-gray-900 transition-colors flex flex-col justify-between">
                        <div>
                          <a>
                            <h2 className="px-4 py-2 text-lg text-white-700">
                              {dataset.by}/{truncateString(dataset.title, 80)}
                            </h2>
                          </a>
                        </div>
                        <div className="flex flex-row space-x-2 pb-3 px-4 overflow-x-auto">
                          <div>
                            <FaDownload
                              style={{ height: "16px", width: "16px" }}
                            />
                          </div>
                          <p className="whitespace-pre-line text-blue-400">
                            {dataset.downloads}
                          </p>
                          <div>
                            <IoIosTrendingUp
                              style={{ height: "16px", width: "16px" }}
                            />
                          </div>
                          <p className="whitespace-pre-line text-blue-400">
                            trending
                          </p>
                          <div>
                            <FaCircleStop
                              style={{ height: "20px", width: "16px" }}
                            />
                          </div>
                          <p className="whitespace-pre-line text-blue-400">
                            {dataset.tag}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link legacyBehavior href={`/datasets`} passHref>
                    <h3 className="cursor-pointer underline hover:scale-x-105 hover:text-lime-600 ">
                      Browse more
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mb-8">
            <GiOpenChest className="items-center h-16 w-16" />
            <h2 className="text-3xl text-white text-center">
              SmilingRobo Open Source
            </h2>
          </div>
          <Link
            legacyBehavior
            href={`https://github.com/SmilingRobo/opensource-robotics`}
            passHref
          >
            <a target="_blank" rel="noopener noreferrer">
              <div className="p-4 bg-gray-800 text-white rounded-lg border border-gray-600 hover:border-gray-400 transition-transform transform hover:scale-105 shadow-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold ">opensource-robotics</h2>
                  <FaGithub size={24} />
                </div>
                <p className="mt-2 text-gray-400">
                  Get Trending Opensource robotics projects on SmilingRobo.
                </p>
              </div>
            </a>
          </Link>

          <div className="p-8  mt-40 text-white rounded-lg bg-slate-950  transition-transform transform hover:scale-105 shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-2/3 mb-4">
              <Image
                src={img}
                alt="SmilingRobo"
                width={1000}
                height={800}
                className="rounded-lg transform -rotate-6"
              />
            </div>
            <div className="flex flex-col items-center space-y-2 w-full sm:w-1/3">
              <Logo className="h-10 w-10 mb-2 align-start" />

              <p className="text-white text-3xl">
                Documentation to help you
              </p>
              <Link legacyBehavior href="https://smilingrobo.github.io/docs/" target="_blank" passHref>
                <a className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                  Read Docs
                </a>
              </Link>
            </div>

            
          </div>
        </>
      )}
    </main>
  );
}
