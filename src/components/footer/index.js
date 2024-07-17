// Footer.js
import React from 'react';
import Link from 'next/link';
import Logo from './logo';

const Footer = () => {
  return (
    <footer className="w-full py-4  text-white">
      <div className="container mx-auto flex flex-col md:flex-row flex-wrap items-center justify-between px-4">
        {/* Navigation Links (Left) */}
        <div className="flex flex-col md:flex-row flex-1 justify-start md:justify-start mb-4 md:mb-0">
          <Link legacyBehavior href="/termsandconditions">
            <a className="mx-2 my-1 md:my-0 hover:text-gray-400">TOC</a>
          </Link>
          <Link legacyBehavior href="https://smilingrobo.github.io/docs/opensourcerobotics/">
            <a className="mx-2 my-1 md:my-0 hover:text-gray-400">About</a>
          </Link>
        </div>

        {/* Logo (Center) */}
        <div className="flex justify-center mb-4 md:mb-0">
          <Logo />
        </div>

        {/* Navigation Links (Right) */}
        <div className="flex flex-col md:flex-row flex-1 justify-center md:justify-end">
          <Link legacyBehavior href="/projects">
            <a className="mx-2 my-1 md:my-0 hover:text-gray-400">Projects</a>
          </Link>
          <Link legacyBehavior href="/datasets">
            <a className="mx-2 my-1 md:my-0 hover:text-gray-400">Datasets</a>
          </Link>
          <Link legacyBehavior href="https://smilingrobo.github.io/docs/">
            <a className="mx-2 my-1 md:my-0 hover:text-gray-400">Docs</a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
