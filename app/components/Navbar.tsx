"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import { WalletComponent } from "./WalletComponent";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full bg-background z-50 p-4 fixed top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-sans font-semibold text-black">
          CHAMA
        </Link>
        <div className="hidden md:flex space-x-6">
          <WalletComponent />
        </div>
        
        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background w-full">
          <div className="flex flex-col items-center space-y-4 p-4">
            <Link href="/" className="text-gray-700 hover:text-black" onClick={toggleMenu}>Home</Link>
            <Link href="/chat" className="text-gray-700 hover:text-black" onClick={toggleMenu}>Chat Bot</Link>
            <Link href="/profile" className="text-gray-700 hover:text-black" onClick={toggleMenu}>Profile</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
