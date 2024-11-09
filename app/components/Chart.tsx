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
  ticker?: string;  
}

const StockChart: React.FC<ChartProps> = ({ ticker = "BTCUSD" }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create and configure the chart
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

    // Setting up main candlestick series and volume series
    mainSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "rgb(104, 193, 184)",
      downColor: "rgb(245, 134, 132)",
      wickUpColor: "rgb(0, 150, 136)",
      wickDownColor: "rgb(244, 67, 54)",
    });

    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: "#c9c9c9",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    // Resize the chart on window resize
    const handleResize = () =>
      chartRef.current?.resize(chartContainerRef.current!.clientWidth, chartContainerRef.current!.clientHeight);
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the chart
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, []);

  // Fetch data whenever ticker changes
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/cryptoData?ticker=${ticker}`);
        const data: CandlestickData[] = await response.json();

        // Map data to chart series
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

    // Call fetchData when ticker changes
    fetchData();
  }, [ticker]);

  return (
    <div
      className="w-full flex items-center justify-center"
      ref={chartContainerRef}
    ></div>
  );
};

export default StockChart;
