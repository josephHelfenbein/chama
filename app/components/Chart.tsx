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
    const testData: CandlestickData[] = [
      { time: "2023-01-01", open: 100, high: 110, low: 90, close: 105, volume: 1200 },
      { time: "2023-01-02", open: 105, high: 120, low: 100, close: 115, volume: 1500 },
      { time: "2023-01-03", open: 115, high: 125, low: 110, close: 120, volume: 1100 },
      { time: "2023-01-04", open: 120, high: 130, low: 115, close: 125, volume: 1300 },
      { time: "2023-01-05", open: 125, high: 135, low: 120, close: 130, volume: 1400 },
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
      chartRef.current?.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the chart
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, [ticker]);

  return (
    <div
      className="w-full flex items-center justify-center"
      ref={chartContainerRef}
      style={{ width: "100%", height: "400px" }}
    ></div>
  );
};

export default StockChart;
