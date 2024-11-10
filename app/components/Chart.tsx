import React, { useEffect, useRef, useState } from "react";
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

interface PopupState {
  visible: boolean;
  text: string;
  x: number;
  y: number;
}

const StockChart: React.FC<ChartProps> = ({ ticker = "BTCUSD" }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const markersRef = useRef<Array<{ time: Time; text: string }>>([]);
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

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
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chartRef.current.subscribeCrosshairMove(param => {
      if (!param.point || !param.time) {
        setPopup(prev => ({ ...prev, visible: false }));
        return;
      }

      // Find if there's a marker at the current time
      const marker = markersRef.current.find(m => {
        const markerTime = typeof m.time === 'object'
          ? `${m.time.year}-${String(m.time.month).padStart(2, '0')}-${String(m.time.day).padStart(2, '0')}`
          : m.time.toString();
        const paramTime = param.time.toString();
        return markerTime === paramTime;
      });

      if (marker) {
        setPopup({
          visible: true,
          text: marker.text,
          x: param.point.x,
          y: param.point.y,
        });
      } else {
        setPopup(prev => ({ ...prev, visible: false }));
      }
    });

    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: "#c9c9c9",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    mainSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "rgb(104, 193, 184)",
      downColor: "rgb(245, 134, 132)",
      wickUpColor: "rgb(0, 150, 136)",
      wickDownColor: "rgb(244, 67, 54)",
    });

    const handleResize = () =>
      chartRef.current?.resize(
        chartContainerRef.current!.clientWidth,
        chartContainerRef.current!.clientHeight
      );
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/cryptoData?ticker=${ticker}`);
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

        const markers = [
          {
            time: { year: 2024, month: 8, day: 23 },
            position: 'aboveBar',
            color: '#f68410',
            shape: 'circle',
            text: 'This is a very very big headline.',
          },
          {
            time: { year: 2024, month: 9, day: 23 },
            position: 'aboveBar',
            color: '#f68410',
            shape: 'circle',
            text: 'This is a pretty small\nheadline.',
          },
          {
            time: { year: 2024, month: 10, day: 23 },
            position: 'aboveBar',
            color: '#f68410',
            shape: 'circle',
            text: 'This is a headline.',
          }
        ];

        // Store markers for reference in crosshair handler
        markersRef.current = markers.map(m => ({
          time: m.time,
          text: m.text
        }));

        mainSeriesRef.current?.setMarkers(markers);
        volumeSeriesRef.current?.setData(
          data.map((item) => ({ time: item.time, value: item.volume }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [ticker]);

  return (
    <div className="relative w-full lg:w-full md:w-11/12 h-full min-h-[400px] max-h-[600px]">
      <div className="w-full h-full" ref={chartContainerRef}></div>
      {popup.visible && (
        <div
          className="absolute p-4 bg-white shadow-lg rounded-lg z-50 max-w-xs border border-gray-200"
          style={{
            left: `${popup.x}px`,
            top: `${popup.y - 60}px`, // Offset above the cursor
            transform: 'translateX(-50%)', // Center horizontally
          }}
        >
          <p className="text-sm">{popup.text}</p>
        </div>
      )}
    </div>
  );
};

export default StockChart;