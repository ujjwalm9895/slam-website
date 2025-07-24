"use client";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import type { Chart as ChartJS } from "chart.js";
import Chart from "chart.js/auto";

export type WeatherData = {
  rainSum: string;
  tempAvg: string;
  labels: string[];
  rainData: number[];
  tempData: number[];
};

type Props = {
  setWeather: (data: WeatherData) => void;
  setCoords: (coords: { lat: number; lon: number }) => void;
};

export default function WeatherMapClient({ setWeather, setCoords }: Props) {
  console.log("Google Maps API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (googleMapRef.current) return;
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
    });
    loader.load().then(() => {
      if (!mapRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 22.9734, lng: 78.6569 },
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      googleMapRef.current = map;
      map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lon = e.latLng.lng();
        setCoords({ lat, lon });
        if (markerRef.current) markerRef.current.setMap(null);
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng: lon },
          map,
        });
        // Fetch weather data from Google Weather API (One Call as fallback)
        // Example endpoint: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=minutely,current,alerts&appid=API_KEY&units=metric
        // Replace with Google Weather API endpoint if available
        const weatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,current,alerts&appid=${weatherApiKey}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();
        // Process next 5 days
        const days = data.daily.slice(0, 5);
        const labels = days.map((d: any) => {
          const date = new Date(d.dt * 1000);
          return date.toLocaleDateString();
        });
        const rainData = days.map((d: any) => d.rain ? Number(d.rain.toFixed(1)) : 0);
        const tempData = days.map((d: any) => Number(d.temp.day.toFixed(1)));
        setWeather({
          rainSum: rainData.reduce((a: number, b: number) => a + b, 0).toFixed(1),
          tempAvg: (tempData.reduce((a: number, b: number) => a + b, 0) / tempData.length).toFixed(1),
          labels,
          rainData,
          tempData,
        });
        // Draw chart
        if (chartRef.current) chartRef.current.destroy();
        const ctx = (document.getElementById("weather-chart") as HTMLCanvasElement).getContext("2d");
        if (!ctx) return;
        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                type: "bar",
                label: "Rainfall (mm)",
                data: rainData,
                backgroundColor: "#3b82f6",
                yAxisID: "y",
              },
              {
                type: "line",
                label: "Avg Temp (°C)",
                data: tempData,
                borderColor: "#f59e42",
                backgroundColor: "#f59e42",
                yAxisID: "y1",
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: false },
            },
            scales: {
              y: {
                type: "linear",
                position: "left",
                title: { display: true, text: "Rainfall (mm)" },
                grid: { color: "#e0e7ef" },
              },
              y1: {
                type: "linear",
                position: "right",
                title: { display: true, text: "Temperature (°C)" },
                grid: { drawOnChartArea: false },
              },
            },
          },
        });
      });
    });
    return () => {
      if (googleMapRef.current) googleMapRef.current = null;
      if (markerRef.current) markerRef.current = null;
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [setWeather, setCoords]);

  return <div ref={mapRef} className="w-full h-72 sm:h-96 rounded-2xl" />;
} 