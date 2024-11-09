// pages/api/tickerSuggestions.ts
import { NextApiRequest, NextApiResponse } from "next";

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const searchQuery = query.toLowerCase();

  // Filter the crypto list to find closest matches to the search query
  const filteredResults = cryptoList
    .filter(
      (coin) =>
        coin.ticker.toLowerCase().startsWith(searchQuery) ||
        coin.name.toLowerCase().startsWith(searchQuery)
    )
    .slice(0, 5) // Limit to top 5 results
    .map((coin) => `${coin.ticker} - ${coin.name}`);

  res.status(200).json(filteredResults);
}
