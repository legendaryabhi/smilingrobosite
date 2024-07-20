import { useState } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import "../../app/globals.css";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "../projects/markdown.css";
import SEOHead from "@/components/SeoHead";
import Header from "@/components/header";
import { FaShareAlt } from "react-icons/fa";

const handleShare = async () => {
  const currentUrl = window.location.href;
  navigator.share({
    url: currentUrl,
  });
};

export default function datasetsDetail({ datasets }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!datasets) {
    return <div>datasets not found</div>;
  }

  return (
    <>
      {" "}
      <SEOHead
        title={datasets.title + " | SmilingRobo "}
        description={
          datasets.subtitle + " SmilingRobo opensource robotics datasets "
        }
      />
      <div>
        <Header />

        <div className="bg-cyan-950 lg:px-60 md:px-40 sm:px-20 px-4 pb-20 pt-20 font-mono">
          <h1 className="text-4xl font-bold text-white">{datasets.title}</h1>
          <p className="pb-3 whitespace-pre-line break-words text-gray-400">
            By {datasets.by}
          </p>
          <h2
            className="mt-4 inline-block border border-gray-400 text-white px-3 py-1.5 rounded transition duration-300 ease-in-out hover:bg-gray-600"
            style={{ fontSize: "1rem" }}
          >
            {datasets.tag}
          </h2>
          <div className="flex flex-row mt-8 space-x-2">
            <p>Share this dataset </p>
            <button
              onClick={handleShare}
              className="ml-4 text-white transition duration-300 ease-in-out hover:text-gray-400"
            >
              <FaShareAlt size={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 mb-20">
          {datasets.url && (
            <a
              href={datasets.url}
              download
              className="bg-green-800 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600"
            >
              Download
            </a>
          )}
          {datasets.website && (
            <a
              href={datasets.website}
              download
              className="bg-green-800 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600"
            >
              Website
            </a>
          )}
        </div>

        <div className="lg:px-60 md:px-40 sm:px-20 px-4 pb-20 pt-4">
          <div className="markdown-body text-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {datasets.description}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const datasetssRef = collection(db, "datasets");
  const datasetssSnapshot = await getDocs(datasetssRef);
  const paths = datasetssSnapshot.docs.map((doc) => ({
    params: { id: doc.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const datasetsDoc = doc(db, "datasets", id);
  const datasetsSnapshot = await getDoc(datasetsDoc);

  if (!datasetsSnapshot.exists()) {
    return {
      notFound: true,
    };
  }

  const datasetsData = datasetsSnapshot.data();
  datasetsData.timestamp = datasetsData.timestamp.toDate().toISOString();

  return {
    props: {
      datasets: { id: datasetsSnapshot.id, ...datasetsData },
    },
  };
}
