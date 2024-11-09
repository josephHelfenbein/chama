"use client";

// components/SearchBar.tsx
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (ticker: string) => Promise<boolean>; // Define a prop for the search handler
}

const cryptoList = [
  { ticker: "BTCUSD", name: "Bitcoin" },
  { ticker: "ETHUSD", name: "Ethereum" },
  { ticker: "USDTUSD", name: "Tether" },
  { ticker: "BNBUSD", name: "Binance Coin" },
  { ticker: "USDCUSD", name: "USD Coin" },
  { ticker: "XRPUSD", name: "XRP" },
  { ticker: "ADAUSD", name: "Cardano" },
  { ticker: "SOLUSD", name: "Solana" },
  { ticker: "DOTUSD", name: "Polkadot" },
  { ticker: "DOGEUSD", name: "Dogecoin" },
  { ticker: "MATICUSD", name: "Polygon" },
  { ticker: "SHIBUSD", name: "Shiba Inu" },
  { ticker: "TRXUSD", name: "TRON" },
  { ticker: "AVAXUSD", name: "Avalanche" },
  { ticker: "DAIUSD", name: "Dai" },
  { ticker: "ATOMUSD", name: "Cosmos" },
  { ticker: "LINKUSD", name: "Chainlink" },
  { ticker: "XMRUSD", name: "Monero" },
  { ticker: "BCHUSD", name: "Bitcoin Cash" },
  { ticker: "LTCUSD", name: "Litecoin" },
  { ticker: "UNIUSD", name: "Uniswap" },
  { ticker: "FTTUSD", name: "FTX Token" },
  { ticker: "CROUSD", name: "Cronos" },
  { ticker: "NEARUSD", name: "NEAR Protocol" },
  { ticker: "VETUSD", name: "VeChain" },
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]); // Clear suggestions if input is empty
      return;
    }

    // Filter the crypto list based on searchQuery
    const searchQueryLower = searchQuery.toLowerCase();
    const filteredResults = cryptoList
      .filter(
        (coin) =>
          coin.ticker.toLowerCase().startsWith(searchQueryLower) ||
          coin.name.toLowerCase().startsWith(searchQueryLower)
      )
      .slice(0, 5) // Limit to top 5 results
      .map((coin) => `${coin.ticker} - ${coin.name}`);
    
    setSuggestions(filteredResults);
  }, [searchQuery]);


  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const isValid = await onSearch(searchQuery); // Call the handler with the search query
      if (!isValid) {
        setError("Invalid ticker symbol. Please try again."); // Set error if ticker is invalid
      } else {
        setError(""); // Clear error if ticker is valid
      }
      setSearchQuery(""); // Clear the input after search
      setSuggestions([]);
    }
  };

 // Handle selection of a suggestion
  const handleSuggestionClick = async (suggestion: string) => {
  const selectedTicker = suggestion.split(" - ")[0]; // Extract ticker symbol from suggestion
  setSearchQuery(selectedTicker);
  setSuggestions([]);
  const isValid = await onSearch(selectedTicker); // Trigger search with full ticker (e.g., "BTCUSD")
  if (!isValid) {
    setError("Invalid ticker symbol. Please try again."); // Show error if ticker is invalid
  } else {
    setError(""); // Clear error if ticker is valid
  }
};


  return (
    <div className="relative flex flex-col items-center sm:w-[80%] md:w-full max-w-2xl">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          placeholder="Search ticker..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-3 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm text-lg font-light"
        />
        <button onClick={handleSearch} className="absolute right-2" aria-label="Search">
          <FaSearch className="w-[80%] text-black" />
        </button>
      </div>

      {/* Dropdown for ticker suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute mt-12 bg-white border border-gray-300 rounded-lg w-full max-h-40 overflow-y-auto shadow-md z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      
      {/* Error message */}
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error message */}
    </div>
  );
};

export default SearchBar;


