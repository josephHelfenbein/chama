import React from 'react';

const QuickSelectCrypto = ({ onSelect, currentTicker }) => {
  const cryptoPairs = [
    'BTCUSD',
    'ETHUSD',
    'SOLUSD',
    'BNBUSD',
    'XRPUSD',
    'ADAUSD'
  ];

  const handleClick = async (ticker) => {
    try {
      const response = await fetch(`/api/cryptoData?ticker=${ticker}`);
      if (response.ok) {
        onSelect(ticker);
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  return (
    <div className="w-full flex justify-center gap-2 flex-wrap mb-4">
      {cryptoPairs.map((ticker) => (
        <button
          key={ticker}
          onClick={() => handleClick(ticker)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
            ${currentTicker === ticker
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
        >
          {ticker}
        </button>
      ))}
    </div>
  );
};

export default QuickSelectCrypto;