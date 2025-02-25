"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function RoboAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000); // 1s delay before appearing
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative pt-4 h-full w-full">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }} // Start hidden
        animate={{ opacity: isVisible ? 1 : 0 }} // Show smoothly
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ y: [0, -20, 0] }} // Up & Down motion
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 rounded-full bg-purple-500/20 blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <Bot className="h-32 w-32 text-purple-500" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
