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
      <svg
   width="45px"
   height="45px"
   viewBox="0 0 80.621597 81.733826"
   version="1.1"
   id="svg1"
   xmlns="http://www.w3.org/2000/svg"
><defs
     id="defs1" /><g
     id="layer1"
     transform="translate(-61.223874,-67.086427)"><path
       
       d="M 88.351116,148.57551 C 72.791035,145.75859 63.180296,136.18693 61.462018,121.79575 59.302429,103.70844 72.089236,84.985548 89.332696,80.986523 c 3.759639,-0.871919 3.641491,-0.903222 3.641491,0.96482 v 1.626497 l -1.996326,0.539776 C 80.110474,87.055993 70.61607,96.8008 67.706288,108.00295 l -0.834432,3.21241 -9.21e-4,4.83321 -9.21e-4,4.83321 0.911852,2.94196 c 1.135042,3.66204 2.566147,6.54969 4.542649,9.16603 l 1.526972,2.0213 0.210139,-16.52093 0.21014,-16.52092 3.887582,-0.12084 3.887581,-0.12084 0.04662,16.51173 c 0.02564,9.08145 0.0087,17.78658 -0.03755,19.34474 l -0.08416,2.83301 1.115604,0.42415 c 0.613582,0.23328 1.197854,0.42415 1.298383,0.42415 0.100528,0 0.182779,-11.4421 0.182779,-25.42689 V 90.411546 h 4.202791 4.202792 v 26.057304 26.05731 h 1.050698 1.050697 V 108.06327 73.600381 h 4.202792 4.202785 v 33.202049 33.20205 l 0.52535,-0.006 c 0.28895,-0.004 0.76044,-0.15573 1.04776,-0.3382 l 0.52241,-0.33176 0.10801,-28.76613 0.10801,-28.766136 h 3.99265 3.99265 l 0.10828,25.959826 0.10828,25.95982 1.04492,-0.68466 1.04493,-0.68466 0.10763,-32.630049 0.10764,-32.630047 h 3.99265 3.99265 l 0.21014,27.005323 0.21014,27.005323 3.75323,-6.55014 3.75323,-6.55015 -0.60114,-0.38041 c -0.33062,-0.20923 -1.49948,-0.38331 -2.59746,-0.38685 -2.32834,-0.008 7.36687,-9.924239 11.0149,-11.266571 0.18346,-0.0675 0.54875,2.012878 0.81177,4.623071 1.42069,14.09917 1.55004,12.74544 -1.01684,10.64207 -1.05873,-0.86755 -1.97817,-1.50892 -2.04319,-1.42528 -0.065,0.0836 -1.58929,2.98897 -3.38727,6.45627 -1.79797,3.4673 -4.51784,8.19545 -6.04415,10.50698 l -2.77511,4.20279 -4.63678,4.64897 -4.63677,4.64896 -3.24388,2.00565 c -7.42428,4.59035 -18.523785,7.42241 -24.704683,6.30345 z"
       id="path32" /></g></svg>

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
