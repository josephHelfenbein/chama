import dynamic from "next/dynamic";

import Image from "next/image";
import Link from "next/link";

// importing components
import TestArea from "./components/Test";
import StockChart from "./components/Chart";
import SearchBar from "./components/SearchBar";
import ChatBox from "./components/ChatBox";



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">

      {/* Search bar */}
      <section className="w-full flex justify-center pt-6">
        <div className="w-[95%] md:w-[90%] flex flex-col items-center">
          <SearchBar />
        </div>
      </section>

      {/* chart section */}
      <section className="w-full flex justify-center pt-10">
        <div className="w-[95%] md:w-[90%] md:h-[60vh] h-full bg-white rounded-lg shadow-lg flex flex-col items-center">
          <h1 className="md:text-3xl text-lg font-bold font-sans text-center mt-2">Company name</h1>
          <div className="w-[90%] h-[90%]">
            <StockChart ticker="AAPL" />
          </div>
        </div>
      </section>


      {/* test section */}
      <section className="h-screen flex justify-center">
        <TestArea/>
      </section>
    </main>
  );
}
