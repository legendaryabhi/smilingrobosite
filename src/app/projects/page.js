"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth, storage } from "../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { Circles } from "react-loader-spinner";

function truncateString(str, numCharacters) {
  return str.length <= numCharacters
    ? str
    : str.slice(0, numCharacters) + " ...";
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [uploading, setUploading] = useState(false); // State for uploading status
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tags: "",
    url: "",
    userName: "",
    description: "",
    website: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectsQuery = query(
        projectsCollection,
        where("done", "==", "yes"),
        orderBy("timestamp", "desc")
      );
      const projectSnapshot = await getDocs(projectsQuery);
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setShowLoginMessage(false);
      } else {
        setUser(null);
      }
    });

    fetchProjects();

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginMessage(true);
      return;
    }

    try {
      await addDoc(collection(db, "projects"), {
        ...formData,
        timestamp: new Date(),
        done: "no",
        trending: 'no',
        star: '', // default value until verification
      });
      setMessage(
        "Your project has been submitted and will be live after verifying."
      );
      setFormData({
        title: "",
        subtitle: "",
        tags: "",
        url: "",
        userName: "",
        description: "",
        website: "",
      });
      setFormVisible(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleFormVisibility = () => {
    if (!user) {
      setShowLoginMessage(true);
    } else {
      setFormVisible(!formVisible);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `projects/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("File upload error: ", error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            url: downloadURL,
          }));
          setUploading(false);
        });
      }
    );
  };

  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-24 font-mono">
      <div className="flex justify-between items-center mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          All Projects
        </h2>
        <button
          className="bg-blue-500 text-white px-3 py-1.5 rounded cursor-pointer"
          onClick={handleFormVisibility}
        >
          Submit your Project
        </button>
      </div>
      {showLoginMessage && (
        <p className="text-red-500 mb-4">
          Please log in to submit your project.
        </p>
      )}
      {formVisible && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Submit Your Project
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Example: Poppy Humanoid"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 rounded"
                style={{ backgroundColor: "#020011" }}
                required
              />
            </div>
            <div>
              <label className="block text-white">Subtitle</label>
              <input
                type="text"
                placeholder="ADVANCED AND EASY TO USE OPEN SOURCE HUMANOID ROBOT"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                style={{ backgroundColor: "#020011" }}
                className="w-full p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-white">Tag</label>
              <input
                type="text"
                name="tags"
                placeholder="Humanoid-Robot"
                value={formData.tags}
                style={{ backgroundColor: "#020011" }}
                onChange={handleChange}
                className="w-full p-2 rounded"
                required
              />
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <label className="block text-white">Code Link</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://github.com/poppy-project/Poppy-Humanoid"
                  className="w-full p-2 rounded"
                  style={{ backgroundColor: "#020011" }}
                  disabled={uploading}
                />
              </div>
              <div className="ml-4  w-1/2 overflow-hidden">
                <label className="block text-white">Or Upload File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".zip,.rar"
                  disabled={formData.url}
                />
              </div>
            </div>
            {uploading && (
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}
            <div>
              <label className="block text-white">Username</label>
              <input
                type="text"
                placeholder="Poppy Projects"
                name="userName"
                value={formData.userName}
                style={{ backgroundColor: "#020011" }}
                onChange={handleChange}
                className="w-full p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-white">Official Website</label>
              <input
                type="url"
                placeholder="https://www.poppy-project.org/en/robots/poppy-humanoid/"
                name="website"
                value={formData.website}
                style={{ backgroundColor: "#020011" }}
                onChange={handleChange}
                className="w-full p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-white">Description</label>
              <textarea
                name="description"
                style={{ backgroundColor: "#020011" }}
                value={formData.description}
                onChange={handleChange}
                placeholder="use html like <p></p> <h2></h2>"
                className="w-full p-2 rounded"
                required
              ></textarea>
              <a
                href="https://drive.google.com/file/d/1EXHZHUxYpaFqM2_DBT_Yycro3EF7AAl2/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-blue-500">See sample</p>
              </a>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              disabled={uploading}
            >
              Submit
            </button>
          </form>
        </div>
      )}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <div className="flex overflow-x-auto space-x-4 mb-8">
        {[
          "All",
          "Humanoid-Robot",
          "robotic-arm",
          "vision-model",
          "robot-dog",
          "Balancing-Robot",
          "Rover",
          "Mobile-Robot"
        ].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              filter === category
                ? "bg-blue-800 text-white"
                : "bg-gray-500 text-black"
            }`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {loading ? (
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
        <div className="overflow-x-auto max-w-full items-center">
          <div className="flex flex-wrap justify-center gap-4 text-white sm:gap-6">
            {projects
              .filter(
                (project) => filter === "All" || project.tags?.includes(filter)
              )
              .map((project) => (
                <Link
                  legacyBehavior
                  href={`/projects/${project.id}`}
                  passHref
                  key={project.id}
                >
                  <div className="w-full cursor-pointer sm:w-80 h-60 rounded-lg text-white shadow-md mb-4 bg-gray-700 hover:bg-gray-900 transition-colors flex flex-col justify-between">
                    <div>
                      <a>
                        <h2 className="px-4 py-2 text-xl font-bold text-white-700">
                          {truncateString(project.title, 80)}
                        </h2>
                      </a>
                      <p className="px-4 pb-3 whitespace-pre-line break-words text-gray-400">
                        By {project.userName}
                      </p>
                      <p className="px-4 py-2 whitespace-pre-line break-words text-whitesmoke">
                        {truncateString(project.subtitle, 100)}
                      </p>
                    </div>
                    <div className="flex flex-row space-x-2 pb-3 px-4">
                      <FaGithub style={{ height: "24px" }} />
                      <p className="whitespace-pre-line break-words text-blue-400">
                        {project.star}
                      </p>
                      {project.trending && (
                        <IoIosTrendingUp style={{ height: "24px" }} />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </main>
  );
}
