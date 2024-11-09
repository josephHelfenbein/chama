"use client";

// components/SearchBar.tsx
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    console.log("Searching for:", searchQuery);

    // Example API call logic can be added here
    // const API_KEY = "YOUR_API_KEY";
    // const endpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${API_KEY}`;
    // try {
    //   const response = await fetch(endpoint);
    //   const data = await response.json();
    //   console.log("Search results:", data);
    // } catch (error) {
    //   console.error("Error searching for ticker:", error);
    // }

    setSearchQuery(""); // Clear the search query after searching
  };

  return (
    <div className="relative flex items-center sm:w-[80%] md:w-full max-w-2xl">
      <input
        type="text"
        placeholder="Search ticker..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-6 py-3 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm text-lg font-light"
      />
      <button onClick={handleSearch} className="absolute right-2" aria-label="Search">
        <FaSearch className="w-[80%] text-secondary"/>
      </button>
    </div>
  );
};

export default SearchBar;


