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
        background: {
          color: "#ffffff"
        },
        textColor: "#000000",
      },
      grid: {
        vertLines: {
          color: "#F0F0F0"
        },
        horzLines: {
          color: "#F0F0F0"
        },
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
      wickUpColor: "rgb(0, 150, 136)",
      upColor: "rgb(104, 193, 184)",
      wickDownColor: "rgb(244, 67, 54)",
      downColor: "rgb(245, 134, 132)",
      borderVisible: true,
    });

    // Setting up volume series
    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: "rgb(201, 201, 201)",
      priceFormat: { type: "volume" },
      priceScaleId: "",
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Fetch data from the API
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3000/api/cryptoData?ticker=BTCUSD`);
        const data: CandlestickData[] = await response.json();

        // Format data for candlestick chart
        const candlestickData = data.map((item) => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));

        // Format data for volume chart
        const volumeData = data.map((item) => ({
          time: item.time,
          value: item.volume,
          color: item.close >= item.open ? "#26a69a" : "#ef5350", // Green if closed higher, red if lower
        }));

        // Set the data to the series
        mainSeriesRef.current?.setData(candlestickData);
        volumeSeriesRef.current?.setData(volumeData);

        // Fit the chart content
        chartRef.current?.timeScale().fitContent();
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    }

    fetchData();

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chartRef.current?.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
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