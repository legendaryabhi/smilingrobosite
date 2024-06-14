"use client";
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

function truncateString(str, numCharacters) {
  if (str.length <= numCharacters) {
    return str;
  } else {
    return str.slice(0, numCharacters) + " ...";
  }
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    subtitle: "",
    description: "",
    tags: "",
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectsQuery = query(projectsCollection, orderBy("timestamp", "desc"), limit());
      const projectSnapshot = await getDocs(projectsQuery);
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
    };

    const fetchUserName = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserName(userDocSnap.data().name);
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserName(user.uid);
      } else {
        setUser(null);
        setUserName("");
      }
    });

    fetchProjects();

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewProject({ ...newProject, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to upload a project.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        title: newProject.title,
        subtitle: newProject.subtitle,
        description: newProject.description,
        tags: newProject.tags,
        timestamp: new Date(),
        userName: userName, // Ensure user's name is included
        userId: user.uid,   // Include user's ID
      });

      if (newProject.file) {
        const storageRef = ref(storage, `projects/${docRef.id}/${newProject.file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newProject.file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("File upload error: ", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "projects", docRef.id), { url: downloadURL });
            setUploadProgress(0);
            setNewProject({ title: "", subtitle: "", description: "", tags: "", file: null });
            setIsModalOpen(false);
            // Refresh projects
            const projectsCollection = collection(db, "projects");
            const projectsQuery = query(projectsCollection, orderBy("timestamp", "desc"), limit());
            const projectSnapshot = await getDocs(projectsQuery);
            const projectList = projectSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setProjects(projectList);
          }
        );
      } else {
        setNewProject({ title: "", subtitle: "", description: "", tags: "", file: null });
        setIsModalOpen(false);
        // Refresh projects
        const projectsCollection = collection(db, "projects");
        const projectsQuery = query(projectsCollection, orderBy("timestamp", "desc"), limit());
        const projectSnapshot = await getDocs(projectsQuery);
        const projectList = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectList);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-24 font-mono">
      <div className="flex justify-between items-center mb-20">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => {
            if (user) {
              setIsModalOpen(true);
            } else {
              alert("Please log in to upload a project.");
            }
          }}
        >
          Upload Project
        </button>
      </div>
      <div className="overflow-x-auto max-w-full items-center">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-full sm:w-80 h-60 rounded-lg shadow-md mb-4"
              style={{ backgroundColor: "#374151" }}
            >
              <Link href={`/projects/${project.id}`} legacyBehavior>
                <a>
                  <h2 className="px-4 py-2 text-xl font-bold text-white-700">{truncateString(project.title, 80)}</h2>
                </a>
              </Link>
              <p className="px-4 pb-3 whitespace-pre-line break-words text-gray-400">By {project.userName}</p>
              <p className="px-4 py-2 whitespace-pre-line break-words" style={{ color: "whitesmoke" }}>
                {truncateString(project.subtitle, 100)}
              </p>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="p-4 rounded-lg max-w-md w-full bg-gray-900 overflow-y-auto max-h-screen">
            <h2 className="text-2xl mb-4 text-white">Upload Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newProject.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-2 bg-black text-white"
                  required
                />
              </div>
              
                <div className="mb-4 ">
                  <label className="block text-white">Subtitle</label>
                  <textarea
                    name="subtitle"
                    value={newProject.subtitle}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2 bg-black text-white"
                    required
                    rows="4"
                  />
                </div>
                <div className="mb-4 ">
                  <label className="block text-white">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={newProject.tags}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2 bg-black text-white"
                    required
                  />
                
              </div>
              <div className="mb-4">
                <label className="block text-white">Detailed Description</label>
                <label className="block text-gray-300">Use MarkDown for good representation</label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-2 bg-black text-white"
                  rows="8"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded mt-2 bg-black text-white"
                />
              </div>
              {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full">
                    <div
                      className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {uploadProgress.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
