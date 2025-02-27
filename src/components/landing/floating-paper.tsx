"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export function FloatingPaper({ count = 5 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [showPapers, setShowPapers] = useState(false);

  useEffect(() => {
    // Update dimensions only on client side
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Delay showing floating papers by 1 second
    const timer = setTimeout(() => {
      setShowPapers(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full">
      {showPapers &&
        Array.from({ length: count }).map((_, i) => (
          <motion.div
            suppressHydrationWarning
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            animate={{
              x: [
                Math.random() * dimensions.width,
                Math.random() * dimensions.width,
                Math.random() * dimensions.width,
              ],
              y: [
                Math.random() * dimensions.height,
                Math.random() * dimensions.height,
                Math.random() * dimensions.height,
              ],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="relative flex h-20 w-16 transform items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-transform hover:scale-110">
              <FileText className="h-8 w-8 text-purple-400/50" />
            </div>
          </motion.div>
        ))}
    </div>
  );
}
