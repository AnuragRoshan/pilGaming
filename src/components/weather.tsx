"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import { cityList } from "./cityList";

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  feelsLike: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
}

const defaultWeatherData: WeatherData = {
  city: "Select a city",
  temperature: 0,
  humidity: 0,
  feelsLike: 0,
  pressure: 0,
  windSpeed: 0,
  description: "",
  icon: "01d",
};

export default function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData>(defaultWeatherData);
  const [selectedCity, setSelectedCity] = useState<string>("Bengaluru");
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [20, -20]);
  const rotateY = useTransform(x, [-300, 300], [-20, 20]);

  const springConfig = { stiffness: 150, damping: 20 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  const fetchWeatherData = async (city: string) => {
    const apiKey = "993d8c32269746188ae43928242209";
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const updatedWeather: WeatherData = {
        city: data.location.name,
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        feelsLike: data.current.feelslike_c,
        pressure: data.current.pressure_mb,
        windSpeed: data.current.wind_kph,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      };

      setWeather(updatedWeather);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData("Bengaluru");
  }, []);

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
    if (city) {
      fetchWeatherData(city);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      x.set(mouseX - centerX);
      y.set(mouseY - centerY);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <motion.div
        ref={cardRef}
        className="bg-white bg-opacity-20 p-8 rounded-3xl shadow-lg backdrop-blur-lg w-full max-w-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          rotateX: springX,
          rotateY: springY,
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Weather Forecast
          </h2>

          <select
            className="w-full mb-6 p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">Select a city</option>
            {cityList.map((city: string, index: number) => (
              <option key={index} value={city} className="text-gray-800">
                {city}
              </option>
            ))}
          </select>

          {weather.city !== "Select a city" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex">
                <div className="text-center mb-6 flex-1">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {weather.city}
                  </h3>
                  <p className="text-xl text-white capitalize">
                    {weather.description}
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6">
                  <img
                    src={weather.icon}
                    alt={weather.description}
                    className="w-24 h-24 mr-4"
                  />
                  <div className="text-6xl font-bold text-white">
                    {Math.round(weather.temperature)}°C
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <WeatherInfoCard
                  icon={<Thermometer className="w-6 h-6 text-yellow-300" />}
                  label="Feels Like"
                  value={`${Math.round(weather.feelsLike)}°C`}
                />
                <WeatherInfoCard
                  icon={<Droplets className="w-6 h-6 text-blue-300" />}
                  label="Humidity"
                  value={`${weather.humidity}%`}
                />
                <WeatherInfoCard
                  icon={<Wind className="w-6 h-6 text-green-300" />}
                  label="Wind Speed"
                  value={`${Math.round(weather.windSpeed)} km/h`}
                />
                <WeatherInfoCard
                  icon={<Cloud className="w-6 h-6 text-gray-300" />}
                  label="Pressure"
                  value={`${weather.pressure} hPa`}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function WeatherInfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
      {icon}
      <div className="ml-3">
        <p className="text-sm text-white opacity-80">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
