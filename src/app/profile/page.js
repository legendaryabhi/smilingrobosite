"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state
  const [showResetPassword, setShowResetPassword] = useState(false); // Reset password state
  const router = useRouter(); // Make sure this is placed inside the component

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUser({ uid: user.uid, ...userDoc.data() });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { name: formData.name, email: formData.email });
      setUser({ uid: user.uid, name: formData.name, email: formData.email });
    } catch (error) {
      console.error("Error registering:", error);
      setError(error.message); // Set error message
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      setUser({ uid: user.uid, ...userDoc.data() });
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.message); // Set error message
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError(error.message); // Set error message
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
                <label htmlFor="name" className="block text-sm font-medium text-white-700 text-white ">Name</label>
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
              <label htmlFor="email" className="block text-sm font-medium text-white-700">Email</label>
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
              <label htmlFor="password" className="block text-sm font-medium text-white-700">Password</label>
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
              <button onClick={() => { setIsLogin(!isLogin); setShowResetPassword(false); }} className="text-blue-500 hover:underline">
                {isLogin ? "Create an account" : "Already have an account?"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded shadow-md w-full max-w-md text-white text-center">
            <h2 className="text-2xl font-bold mb-4 ">Welcome, {user.name}</h2>
            <p className="mb-4">Email: {user.email}</p>
            
          </div>
        )}
        {user && (
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 mt-4">
            Logout
          </button>
        )}
      </main>
    </div>
  );
}
