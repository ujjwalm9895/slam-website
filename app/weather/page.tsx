"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Chart from "chart.js/auto";
import { Search, CloudRain, ThermometerSun, ThermometerSnowflake } from "lucide-react";

export default function WeatherPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [weather, setWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch location suggestions
  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelected(null);
    setWeather(null);
    setError(null);
    if (e.target.value.length < 2) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(e.target.value)}&count=5&language=en&format=json`);
    const data = await res.json();
    setSuggestions(data.results || []);
  };

  // On suggestion select
  const handleSelect = async (loc: any) => {
    setSelected(loc);
    setQuery(loc.name + (loc.admin1 ? ", " + loc.admin1 : "") + (loc.country ? ", " + loc.country : ""));
    setSuggestions([]);
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      setWeather({
        days: data.daily.time,
        rain: data.daily.precipitation_sum,
        tempMax: data.daily.temperature_2m_max,
        tempMin: data.daily.temperature_2m_min,
      });
      setTimeout(() => drawChart(data.daily), 100); // Draw after DOM update
    } catch (e) {
      setError("Failed to fetch weather data. Please try again.");
    }
    setLoading(false);
  };

  // Draw Chart.js graph
  const drawChart = (daily: any) => {
    const ctx = document.getElementById("weather-chart") as HTMLCanvasElement;
    if (!ctx) return;
    if ((window as any).weatherChart) (window as any).weatherChart.destroy();
    (window as any).weatherChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: daily.time.map((d: string) => new Date(d).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })),
        datasets: [
          {
            type: "bar",
            label: "Rainfall (mm)",
            data: daily.precipitation_sum,
            backgroundColor: "#2563eb",
            borderRadius: 8,
            yAxisID: "y",
            order: 2,
          },
          {
            type: "line",
            label: "Max Temp (°C)",
            data: daily.temperature_2m_max,
            borderColor: "#f59e42",
            backgroundColor: "#f59e42",
            pointBackgroundColor: "#f59e42",
            pointBorderColor: "#f59e42",
            tension: 0.4,
            yAxisID: "y1",
            order: 1,
          },
          {
            type: "line",
            label: "Min Temp (°C)",
            data: daily.temperature_2m_min,
            borderColor: "#38bdf8",
            backgroundColor: "#38bdf8",
            pointBackgroundColor: "#38bdf8",
            pointBorderColor: "#38bdf8",
            tension: 0.4,
            yAxisID: "y1",
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { font: { size: 16 } } },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return `${context.dataset.label}: ${context.parsed.y} ${context.dataset.label.includes('Temp') ? '°C' : 'mm'}`;
              }
            }
          },
          title: { display: false },
        },
        scales: {
          x: {
            title: { display: true, text: "Date", font: { size: 16 } },
            grid: { color: "#e0e7ef" },
            ticks: { font: { size: 14 } },
          },
          y: {
            type: "linear",
            position: "left",
            title: { display: true, text: "Rainfall (mm)", font: { size: 16 } },
            grid: { color: "#e0e7ef" },
            ticks: { font: { size: 14 } },
          },
          y1: {
            type: "linear",
            position: "right",
            title: { display: true, text: "Temperature (°C)", font: { size: 16 } },
            grid: { drawOnChartArea: false },
            ticks: { font: { size: 14 } },
          },
        },
      },
    });
  };

  // Generate a plain-language summary for the week
  const getSummary = () => {
    if (!weather) return "";
    const totalRain = weather.rain.reduce((a: number, b: number) => a + b, 0);
    const minTemp = Math.min(...weather.tempMin);
    const maxTemp = Math.max(...weather.tempMax);
    let rainDesc = totalRain > 50 ? "Heavy rainfall expected" : totalRain > 20 ? "Moderate rainfall likely" : totalRain > 5 ? "Light rain possible" : "Mostly dry week";
    let tempDesc = maxTemp > 38 ? "Very hot days" : maxTemp > 32 ? "Warm days" : maxTemp > 25 ? "Mild temperatures" : "Cool week";
    return `${rainDesc}. ${tempDesc}.`;
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-2 sm:px-4 py-10 gap-12 animate-fade-in">
      {/* Hero Section */}
      <section className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 py-8 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 dark:text-blue-300 drop-shadow-lg text-center mb-2">Rainfall & Temperature Forecast</h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 text-center max-w-2xl mb-2">
          Get the latest 7-day rainfall and temperature forecast for your city or region.<br />
          <span className="text-base text-blue-700 dark:text-blue-400 font-semibold">Empowering smarter farming decisions across India.</span>
        </p>
      </section>
      {/* Search Box */}
      <section className="w-full max-w-xl flex flex-col gap-2 animate-fade-in">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-500 size-6 pointer-events-none" />
          <input
            type="text"
            className="w-full rounded-2xl border border-blue-200 dark:border-blue-800 pl-12 pr-4 py-3 text-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow transition-all"
            placeholder="Search city, state, or location..."
            value={query}
            onChange={handleInput}
            autoComplete="off"
            aria-label="Location search"
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900 rounded-2xl shadow mt-1 z-10 animate-fade-in">
            {suggestions.map((s) => (
              <li
                key={s.id}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                onClick={() => handleSelect(s)}
              >
                {s.name}{s.admin1 ? ", " + s.admin1 : ""}{s.country ? ", " + s.country : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* Results Section */}
      {loading && (
        <Card className="w-full max-w-2xl p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900 text-center text-blue-500 dark:text-blue-300 animate-pulse">
          Loading weather data...
        </Card>
      )}
      {error && (
        <Card className="w-full max-w-2xl p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-red-200 dark:border-red-700 text-center text-red-600 dark:text-red-400">
          {error}
        </Card>
      )}
      {weather && selected && !loading && !error && (
        <section className="w-full max-w-4xl flex flex-col gap-8 mt-8 animate-fade-in">
          {/* Summary Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900 px-8 py-6 min-w-[180px]">
              <CloudRain className="size-8 text-blue-600 mb-1" />
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{weather.rain.reduce((a: number, b: number) => a + b, 0).toFixed(1)} mm</div>
              <div className="text-xs text-gray-500">Total Rainfall</div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900 px-8 py-6 min-w-[180px]">
              <ThermometerSun className="size-8 text-orange-500 mb-1" />
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{Math.max(...weather.tempMax).toFixed(1)}°C</div>
              <div className="text-xs text-gray-500">Max Temperature</div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900 px-8 py-6 min-w-[180px]">
              <ThermometerSnowflake className="size-8 text-sky-500 mb-1" />
              <div className="text-lg font-bold text-sky-600 dark:text-sky-400">{Math.min(...weather.tempMin).toFixed(1)}°C</div>
              <div className="text-xs text-gray-500">Min Temperature</div>
            </div>
          </div>
          {/* Plain-language summary */}
          <div className="w-full text-center text-base sm:text-lg text-gray-700 dark:text-gray-200 font-medium mt-2 mb-2 animate-fade-in">
            {getSummary()}
          </div>
          {/* Chart Row */}
          <div className="w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900 p-6 flex items-center justify-center animate-fade-in min-h-[420px]">
            <canvas id="weather-chart" className="w-full h-[340px] sm:h-[380px] md:h-[400px]" aria-label="Rainfall and temperature chart" />
          </div>
        </section>
      )}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
} 