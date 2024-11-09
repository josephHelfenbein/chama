// components/Chart.tsx
"use client";

import React, { useEffect, useRef } from "react";
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  Time,
} from "lightweight-charts";

interface CandlestickData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartProps {
  ticker: string;
}

const StockChart: React.FC<ChartProps> = ({ ticker }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart
    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#ffffff" },
        textColor: "#000000",
        fontFamily: "Roboto, sans-serif",
      },
      grid: {
        vertLines: { color: "#F0F0F0" },
        horzLines: { color: "#F0F0F0" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#000000", labelBackgroundColor: "#000000" },
        horzLine: { color: "#000000", labelBackgroundColor: "#000000" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    // Setting up main candlestick series
    mainSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "rgb(104, 193, 184)",
      downColor: "rgb(245, 134, 132)",
      wickUpColor: "rgb(0, 150, 136)",
      wickDownColor: "rgb(244, 67, 54)",
    });

    // Setting up volume series
    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: "#c9c9c9",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    // Mock data for testing the chart
    const testData = [
        { time: "2022-03-01", open: 140.039993, high: 140.479996, low: 133.580002, close: 136.449997, volume: 36840400 },
        { time: "2022-03-02", open: 137.289993, high: 140.039993, low: 136.610001, close: 139.279999, volume: 19405600 },
        { time: "2022-03-03", open: 139.839996, high: 140.979996, low: 137.059998, close: 138.289993, volume: 16640800 },
        { time: "2022-03-04", open: 134.940002, high: 135.419998, low: 132.399994, close: 134.399994, volume: 21016000 },
        { time: "2022-03-07", open: 132.169998, high: 132.690002, low: 128.949997, close: 129.210007, volume: 27560100 },
        { time: "2022-03-08", open: 129.639999, high: 131.789993, low: 127.269997, close: 128.300003, volume: 19207800 },
        { time: "2022-03-09", open: 132.899994, high: 135.240005, low: 132.440002, close: 133.440002, volume: 17536200 },
        { time: "2022-03-10", open: 131.860001, high: 133.449997, low: 130.320007, close: 131.860001, volume: 15604200 },
        { time: "2022-03-11", open: 132.490005, high: 134.080002, low: 128.419998, close: 128.889999, volume: 20061800 },
        { time: "2022-03-14", open: 129.460007, high: 132.919998, low: 129.229996, close: 130.169998, volume: 15786900 },
        { time: "2022-03-15", open: 131.800003, high: 133.550003, low: 131.130005, close: 132.479996, volume: 15096600 },
        { time: "2022-03-16", open: 134.869995, high: 138.490005, low: 134.429993, close: 138.399994, volume: 20354900 },
        { time: "2022-03-17", open: 136.860001, high: 140.190002, low: 135.919998, close: 140.149994, volume: 17050500 },
        { time: "2022-03-18", open: 140.190002, high: 140.850006, low: 138.460007, close: 140.100006, volume: 23656500 },
        { time: "2022-03-21", open: 140.350006, high: 140.759995, low: 138.729996, close: 139.649994, volume: 12676100 },
        { time: "2022-03-22", open: 142.270004, high: 143.929993, low: 141.720001, close: 142.619995, volume: 13548600 },
        { time: "2022-03-23", open: 140.979996, high: 141.589996, low: 139.199997, close: 139.779999, volume: 12093200 },
        { time: "2022-03-24", open: 140.300003, high: 140.710007, low: 139.110001, close: 140.690002, volume: 10017600 },
        { time: "2022-03-25", open: 141.089996, high: 143.179993, low: 140.800003, close: 141.919998, volume: 8383500 },
        { time: "2022-03-28", open: 140, high: 140.970001, low: 137.899994, close: 140.869995, volume: 10818100 },
        { time: "2022-03-29", open: 143.350006, high: 143.600006, low: 140.240005, close: 141.179993, volume: 11316500 },
        { time: "2022-03-30", open: 141.899994, high: 142.119995, low: 139.910004, close: 140.539993, volume: 8771000 },
        { time: "2022-03-31", open: 139.830002, high: 140.350006, low: 136.259995, close: 136.320007, volume: 17353900 },
        { time: "2022-04-01", open: 137.399994, high: 137.410004, low: 133.800003, close: 135.309998, volume: 15721300 },
        { time: "2022-04-04", open: 134.119995, high: 136.940002, low: 132.889999, close: 135.910004, volume: 17416400 },
        { time: "2022-04-05", open: 134.070007, high: 135.399994, low: 133.009995, close: 133.339996, volume: 12110300 },
        { time: "2022-04-06", open: 131.580002, high: 132.559998, low: 130.960007, close: 131.490005, volume: 12914700 },
        { time: "2022-04-07", open: 130.949997, high: 131.919998, low: 128.729996, close: 131.089996, volume: 12994200 },
        { time: "2022-04-08", open: 131.669998, high: 133.899994, low: 131.490005, close: 133.490005, volume: 13126900 },
        { time: "2022-04-11", open: 133, high: 134.899994, low: 132.570007, close: 133, volume: 10466400 },
        { time: "2022-04-12", open: 132.139999, high: 134.580002, low: 130.699997, close: 131.539993, volume: 12989900 },
        { time: "2022-04-13", open: 126.940002, high: 129.25, low: 126.010002, close: 127.300003, volume: 30838000 },
      ];
      

    // Set data to main and volume series
    mainSeriesRef.current?.setData(
      testData.map((item) => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }))
    );

    volumeSeriesRef.current?.setData(
      testData.map((item) => ({ time: item.time, value: item.volume }))
    );

    // Uncomment the following function to fetch data from an API instead of using mock data
    /*
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:8000/data/${ticker}`);
        const data: CandlestickData[] = await response.json();

        mainSeriesRef.current?.setData(
          data.map((item) => ({
            time: item.time,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }))
        );

        volumeSeriesRef.current?.setData(
          data.map((item) => ({ time: item.time, value: item.volume }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
    */

    // Resize the chart on window resize
    const handleResize = () =>
      chartRef.current?.resize(chartContainerRef.current!.clientWidth, chartContainerRef.current!.clientHeight);
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the chart
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, [ticker]);

  return (
    <div
      className="w-full lg:w-full md:w-11/12 h-full min-h-[400px] max-h-[600px] overflow-hidden"
      ref={chartContainerRef}
      
    ></div>
  );
};

export default StockChart;
