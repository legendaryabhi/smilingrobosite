import { useState } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import "../../app/globals.css";
import { db } from "../../../firebaseConfig";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./markdown.css";
import SEOHead from "@/components/SeoHead";

import Header from "@/components/header";
import Footer from "@/components/footer";

import { FaShareAlt } from "react-icons/fa";
const handleShare = async () => {
  const currentUrl = window.location.href;
  navigator.share({
        
        url: currentUrl,
      });
   
};

export default function ProjectDetail({ project }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      {" "}
      <SEOHead
        title={project.title + " | SmilingRobo "}
        description={
          project.subtitle + " SmilingRobo opensource robotics project "
        }
      />
      <div>
        <Header />

        <div className="bg-gray-800 lg:px-60 md:px-40 sm:px-20 px-4 pb-20 pt-20 font-mono">
        
        <h1 className="text-4xl font-bold text-white">{project.title}</h1>
           
          <p className="pb-3 whitespace-pre-line break-words text-gray-400">
            By {project.userName}
          </p>
          <h2
            className="mt-4 inline-block border border-gray-400 text-white px-3 py-1.5 rounded transition duration-300 ease-in-out hover:bg-gray-600"
            style={{ fontSize: "1rem" }}
          >
            {project.tags}
          </h2>
          <div className="flex flex-row mt-8 space-x-2"> 
          <p>Share this project to show your support</p>
            <button
              onClick={handleShare}
              className="ml-4 text-white transition duration-300 ease-in-out hover:text-gray-400"
            >
              <FaShareAlt size={24} />
            </button>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 mb-20">
          {project.paper && (
            <a
              href={project.paper}
              download
              className="bg-green-800 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600"
            >
              Paper
            </a>
          )}
          {project.hardware && (
            <a
              href={project.hardware}
              download
              className="bg-green-800 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600"
            >
              Hardware
            </a>
          )}
          {project.dataset && (
            <a
              href={project.dataset}
              download
              className="bg-green-800 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600"
            >
              Dataset
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              download
              className="bg-green-800 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600"
            >
              Download Code
            </a>
          )}

          {project.documentation && (
            <a
              href={project.documentation}
              download
              className="bg-green-800 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600"
            >
              Documentation
            </a>
          )}
        </div>

        <div className="lg:px-60 md:px-40 sm:px-20 px-4 pb-20 pt-4">
          <div className="markdown-body text-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {project.description}
            </ReactMarkdown>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const projectsRef = collection(db, "projects");
  const projectsSnapshot = await getDocs(projectsRef);
  const paths = projectsSnapshot.docs.map((doc) => ({
    params: { id: doc.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const projectDoc = doc(db, "projects", id);
  const projectSnapshot = await getDoc(projectDoc);

  if (!projectSnapshot.exists()) {
    return {
      notFound: true,
    };
  }

  const projectData = projectSnapshot.data();
  projectData.timestamp = projectData.timestamp.toDate().toISOString();

  return {
    props: {
      project: { id: projectSnapshot.id, ...projectData },
    },
  };
}
