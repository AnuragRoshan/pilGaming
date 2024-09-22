import { useState } from "react";
import "./App.css";
import Stopwatch from "./components/stopwatch";
import WeatherApp from "./components/weather";

function App() {
  const [showComponent, setShowComponent] = useState<string>("stopwatch");

  return (
    <div className="App">
      <div className="flex justify-center space-x-4 my-4">
        <button
          className={`px-4 py-2 rounded-md font-bold ${
            showComponent === "stopwatch"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setShowComponent("stopwatch")}
        >
          Show Stopwatch
        </button>
        <button
          className={`px-4 py-2 rounded-md font-bold ${
            showComponent === "weather"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setShowComponent("weather")}
        >
          Show Weather App
        </button>
      </div>

      <div className="content">
        {showComponent === "stopwatch" && <Stopwatch />}
        {showComponent === "weather" && <WeatherApp />}
      </div>
    </div>
  );
}

export default App;
