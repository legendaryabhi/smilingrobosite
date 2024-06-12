import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmilingRobo",
  description: "Welcome to SmilingRobo, Building the Robo community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Header />
      <div className="w-full border-b border-gray-800"></div>
        {children}
        </body>
    </html>
  );
}
