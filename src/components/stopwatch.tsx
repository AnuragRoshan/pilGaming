import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      intervalId = window.setInterval(() => setTime((time) => time + 10), 10);
    }
    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds
      .toString()
      .padStart(3, "0")}`;
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-4">
      <motion.div
        className="bg-white bg-opacity-10 rounded-3xl p-8 shadow-lg backdrop-blur-md w-96 flex flex-col items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          className="text-4xl font-bold text-white mb-8 tabular-nums"
          animate={{ opacity: [0.5, 1] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {formatTime(time)}
        </motion.div>
        <div className="flex space-x-4">
          <motion.button
            className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? "Pause" : "Start"}
          </motion.button>
          <motion.button
            className="px-6 py-2 rounded-full bg-yellow-500 text-white font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLap}
          >
            Lap
          </motion.button>
          <motion.button
            className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsRunning(false);
              setTime(0);
              setLaps([]);
            }}
          >
            Reset
          </motion.button>
        </div>
      </motion.div>
      {laps.length > 0 && (
        <motion.div
          className="fixed right-0 top-0 h-full w-72 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-md overflow-y-auto mt-20" // Added margin-top here
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-white font-semibold mb-2">Laps</h3>
          {laps.map((lapTime, index) => (
            <motion.div
              key={index}
              className="text-white mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Lap {index + 1}: {formatTime(lapTime)}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
