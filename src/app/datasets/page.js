"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { FaDownload } from "react-icons/fa";
import { Circles } from "react-loader-spinner";
import { IoIosTrendingUp } from "react-icons/io";
import { FaCircleStop } from "react-icons/fa6";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function truncateString(str, numCharacters) {
  if (str.length <= numCharacters) {
    return str;
  } else {
    return str.slice(0, numCharacters) + " ...";
  }
}

export default function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    tag: "",
    by: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDatasets = async () => {
      const datasetsCollection = collection(db, "datasets");
      const datasetsQuery = query(datasetsCollection,where("done", "==", "yes"), orderBy("timestamp", "desc"));
      const datasetsSnapshot = await getDocs(datasetsQuery);
      const datasetsList = datasetsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDatasets(datasetsList);
      setLoading(false);
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
        setShowLoginMessage(false);
      } else {
        setUser(null);
        setUserName("");
      }
    });

    fetchDatasets();

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginMessage(true);
      return;
    }

    const saveToFirestore = async (downloadURL) => {
      try {
        await addDoc(collection(db, "datasets"), {
          ...formData,
          url: downloadURL,
          timestamp: new Date(),
          downloads: 0,
          trending: 'no',
          done:'',
        });
        setMessage("Your dataset has been submitted and will be live after verifying.");
        setFormData({
          title: "",
          description: "",
          url: "",
          tag: "",
          by: "",
        });
        setFile(null);
        setUploading(false);
        setFormVisible(false);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    };

    if (file) {
      try {
        setUploading(true);
        const storageRef = ref(storage, `datasets/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading file:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            saveToFirestore(downloadURL);
          }
        );
      } catch (error) {
        console.error("Error adding document:", error);
      }
    } else {
      saveToFirestore(formData.url);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData((prev) => ({
      ...prev,
      url: "",
    }));
  };

  const handleFormVisibility = () => {
    if (!user) {
      setShowLoginMessage(true);
    } else {
      setFormVisible(!formVisible);
    }
  };

  const filteredDatasets = datasets.filter((dataset) => {
    if (filter === "All") {
      return true;
    }
    return dataset.tag && dataset.tag.includes(filter);
  });

  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-24 font-mono">
      <div className="flex justify-between items-center mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">All Datasets</h2>
        <button
          className="bg-blue-500 text-white px-3 py-1.5 rounded cursor-pointer"
          onClick={handleFormVisibility}
        >
          Submit your Dataset
        </button>
      </div>
      {showLoginMessage && (
        <p className="text-red-500 mb-4">Please log in to submit your Dataset.</p>
      )}
      {formVisible && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Submit Your Dataset</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Example: Poppy Dataset"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 rounded"
                style={{ backgroundColor: "#020011" }}
                required
              />
            </div>
            <div>
              <label className="block text-white">Description</label>
              <textarea
                name="description"
                style={{ backgroundColor: "#020011" }}
                value={formData.description}
                onChange={handleChange}
                placeholder="Description of your dataset"
                className="w-full p-2 rounded"
                required
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 pr-2">
                <label className="block text-white">URL</label>
                <input
                  type="url"
                  name="url"
                  placeholder="https://example.com/dataset"
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full p-2 rounded"
                  style={{ backgroundColor: "#020011" }}
                  disabled={!!file}
                />
              </div>
              <div className="w-1/2 pl-2">
                <label className="block text-white">Or Upload File</label>
                <input
                  type="file"
                  name="file"
                  accept=".zip,.rar,.7zip"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded"
                  style={{ backgroundColor: "#020011" }}
                  disabled={!!formData.url}
                />
              </div>
            </div>
            <div>
              <label className="block text-white">Tag</label>
              <input
                type="text"
                name="tag"
                placeholder="Humanoid-Dataset"
                value={formData.tag}
                onChange={handleChange}
                className="w-full p-2 rounded"
                style={{ backgroundColor: "#020011" }}
                required
              />
            </div>
            <div>
              <label className="block text-white">Username</label>
              <input
                type="text"
                name="by"
                placeholder="Your username"
                value={formData.by}
                onChange={handleChange}
                className="w-full p-2 rounded"
                style={{ backgroundColor: "#020011" }}
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4" disabled={uploading}>
              Submit
            </button>
            {uploading && <p className="text-white mt-2">Uploading: {Math.round(uploadProgress)}%</p>}
          </form>
        </div>
      )}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <div className="flex overflow-x-auto space-x-4 mb-8">
        {["All", "Humanoid-Dataset", "Drone-Dataset", "Driving-Dataset"].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              filter === category ? "bg-blue-800 text-white" : "bg-gray-500 text-black"
            }`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Circles height="80" width="80" color="#4fa94d" ariaLabel="circles-loading" visible={true} />
        </div>
      ) : (
        <div className="overflow-x-auto max-w-full items-center">
          <div className="flex flex-wrap justify-center gap-4 text-white sm:gap-6">
            {filteredDatasets.map((dataset) => (
              <Link legacyBehavior href={`/datasets/${dataset.id}`} passHref key={dataset.id}>
                <div
                  className="w-full cursor-pointer sm:w-128 sm:h-20 h-32 rounded-lg text-white shadow-md mb-4 bg-cyan-950 hover:bg-gray-900 transition-colors flex flex-col justify-between"
                >
                  <div>
                        <a>
                          <h2 className="px-4 py-2 text-xl font-bold text-white-700">
                            {dataset.by}/{truncateString(dataset.title, 80)}
                          </h2>
                        </a>
                        
                      </div>
                      <div className="flex flex-row space-x-2 pb-3 px-4 overflow-x-auto">
                        <div><FaDownload style={{ height: '16px' ,width:'16px' }} /></div>
                        
                        <p className="whitespace-pre-line  text-blue-400">
                          {dataset.downloads}
                        </p>
                        
                        
                        <div><IoIosTrendingUp style={{ height: '16px' ,width:'16px' }} /></div>
                          <p className="whitespace-pre-line  text-blue-400">
                          trending
                          
                        </p>
                        <div><FaCircleStop style={{ height: '20px' ,width:'16px' }} /></div>
                          <p className="whitespace-pre-line  text-blue-400">
                          {dataset.tag}
                        </p>
                        
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
