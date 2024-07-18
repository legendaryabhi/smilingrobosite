import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "../components/footer";
import Header from "../components/header";
import SEOHead from '../components/SeoHead'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmilingRobo",
  description: "Opensource Robotics Platform with opensource tools and resources. We're on a journey to advance and democratize robotics through opensource.",
  openGraph: {
    title: 'SmilingRobo',
    description: "Opensource Robotics Platform with opensource tools and resources. We're on a journey to advance and democratize robotics through opensource.",
    url: "https://www.smilingrobo.com/",
    siteName: 'SmilingRobo',
    type:'website',
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: 'SmilingRobo',
  },
};


export default function RootLayout({ children, pageMetadata }) {
  return (
    <html lang="en">
      <SEOHead title={pageMetadata?.title || "SmilingRobo"} 
               description={pageMetadata?.description || "Opensource Robotics Platform with opensource tools and resources. We're on a journey to advance and democratize robotics through opensource."} />
      <body className={inter.className}>
        <Header />
        <div className="w-full border-b border-gray-800"></div>
        {children}
        <Footer />
      </body>
    </html>
  );
}

