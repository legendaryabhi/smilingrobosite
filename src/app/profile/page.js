"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebaseConfig";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { FaStar } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tags: "",
    url: "",
    description: "",
    userName: "",
    documentation: ""
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const q = query(collection(db, "projects"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } else {
        setUser(null);
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (project) => {
    setFormData(project);
    setEditingProjectId(project.id);
    setFormVisible(true);
  };

  const handleDelete = async (projectId) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      await deleteDoc(doc(db, "projects", projectId));
      setProjects(projects.filter((project) => project.id !== projectId));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProjectId) {
      await updateDoc(doc(db, "projects", editingProjectId), formData);
      setProjects(projects.map((project) =>
        project.id === editingProjectId ? { ...project, ...formData } : project
      ));
      setFormVisible(false);
      alert("Your edits are saved!");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { name: formData.name, email: formData.email });
      setUser({ uid: user.uid, name: formData.name, email: formData.email });
    } catch (error) {
      console.error("Error registering:", error);
      setError(error.message);
    }
    setLoading(false);
  };
 
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      setUser({ uid: user.uid, ...userDoc.data() });
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <main className="flex flex-col items-center w-full p-4 text-white">
        <h2 className="text-3xl font-bold mb-6">Profile</h2>
        {!user ? (
          <div className="p-6 rounded shadow-md w-full max-w-md text-white">
            <h2 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 h-10 rounded-md bg-gray-700 text-white border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 h-10 rounded-md bg-gray-700 text-white border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 h-10 rounded-md bg-gray-700 text-white border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="relative inset-y-0 right-0 pr-3 flex text-sm items-center text-gray-300 hover:text-gray-700"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            {isLogin && showResetPassword && (
              <div className="mb-4">
                <button
                  onClick={handlePasswordReset}
                  className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
                  disabled={loading}
                >
                  Send Password Reset Email
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                onClick={isLogin ? handleLogin : handleRegister}
                className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                disabled={loading}
              >
                {isLogin ? "Login" : "Register"}
              </button>
              <button
                onClick={() => { setIsLogin(!isLogin); setShowResetPassword(false); }}
                className="text-blue-500 hover:underline"
              >
                {isLogin ? "Create an account" : "Already have an account?"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 rounded shadow-md w-full max-w-md text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome, {user.name || "User"}</h2>
              <p className="mb-4">Email: {user.email}</p>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 mt-4">
              Logout
            </button>
            <div className="mt-6 w-full">
              <h1 className="text-white mb-8 mt-8">Your Projects</h1>
              {projects.map((project) => (
                <div key={project.id} className="w-full cursor-pointer sm:w-full sm:h-20 h-32 rounded-lg text-white shadow-md mb-12 bg-emerald-800 hover:bg-gray-900 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start px-4 py-2">
                      <h2 className="text-lg text-white-700">{project.title}</h2>
                      
                    </div>
                    <p className="px-4 py-1 whitespace-pre-line break-words text-whitesmoke">{project.subtitle}</p>
                    <div className="flex flex-row justify-end px-4 py-2">
                      <button onClick={() => handleEdit(project)} className="text-blue-500 hover:underline mr-4">Edit</button>
                      <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {formVisible && (
              <div className="bg-gray-800 p-6 rounded-lg mb-6 sm:w-2/3 w-full">
                <h2 className="text-xl font-bold text-white mb-4">Edit Your Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white">Title</label>
                    <input
                      type="text"
                      name="title"
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
                      value={formData.tags}
                      style={{ backgroundColor: "#020011" }}
                      onChange={handleChange}
                      className="w-full p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Code Link</label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      className="w-full p-2 rounded"
                      style={{ backgroundColor: "#020011" }}
                    />
                  </div>
                  <div>
                    <label className="block text-white">Username</label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      style={{ backgroundColor: "#020011" }}
                      onChange={handleChange}
                      className="w-full p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Documentation</label>
                    <input
                      type="url"
                      name="documentation"
                      value={formData.documentation}
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
                      className="w-full p-2 rounded"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                    Save
                  </button>
                  <button
                    onClick={() => setFormVisible(false)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
