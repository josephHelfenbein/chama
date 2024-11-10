"use client";

import { useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa"; // Import chat and close icons

//Components
import ChatBox from "./components/ChatBox";
import StockChart from "./components/Chart";
import SearchBar from "./components/SearchBar";
import TestArea from "./components/Test";
import QuickSelectCrypto from "./components/QuickSelectCrypto";
import { FundButton } from "@coinbase/onchainkit/fund";



export default function Home() {
  const [ticker, setTicker] = useState("BTCUSD"); // Default ticker
  const [isChatOpen, setIsChatOpen] = useState(false); // Track chatbox visibility

  // Handler to toggle chat visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Handler for ticker search
  const handleTickerSearch = async (newTicker: string): Promise<boolean> => {
    const upperTicker = newTicker.toUpperCase();
    try {
      const response = await fetch(`/api/cryptoData?ticker=${upperTicker}`);
      if (!response.ok) {
        return false; // Ticker is invalid
      }
      setTicker(upperTicker); // Set the ticker if valid
      return true; // Ticker is valid
    } catch (error) {
      console.error("Error validating ticker:", error);
      return false; // Return false if there's an error
    }
  };

  return (
    <main className="flex h-screen">
      {/* Main Content Area */}
      <section className="flex-grow h-full overflow-y-auto p-4">
        {/* Search bar section */}
        <section className="w-full flex justify-center pt-6">
          <div className="w-[95%] md:w-[90%] flex flex-col items-center">
            <SearchBar onSearch={handleTickerSearch} /> {/* Pass the handler */}
          </div>
        </section>

      {/* chart section */}
      <section className="w-full flex justify-center pt-10">
        <div className="w-[95%] md:w-[90%] bg-white rounded-lg shadow-lg flex flex-col items-center">
          <section className="w-full flex justify-center pt-6">
              <QuickSelectCrypto onSelect={setTicker} currentTicker={ticker} />
          </section>
          <div className="w-[90%] h-[90%] p-5">
            <StockChart ticker={ticker} />
          </div>
          <div className="flex justify-end w-full p-5">
          <FundButton />
          </div>
        </div>
      </section>

      </section>

      {/* Right Sidebar - Fixed ChatBox for large screens */}
      <aside
        className={`fixed bottom-16 top-0 h-full w-full lg:w-1/4 lg:h-[60vh] lg:right-0 lg:top-auto border-l border-gray-200 bg-white shadow-lg z-10 transition-transform duration-300 ${
          isChatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ChatBox/>

      </aside>

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-500 text-white shadow-lg"
      >
        {isChatOpen ? <FaTimes /> : <FaComments className="font-bold w-12"/>} {/* Toggle between icons */}
        <span>{isChatOpen ? "" : "Ask"}</span>
      </button>
    </main>
  );
}
