"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, Home, RefreshCw } from "lucide-react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [count, setCount] = useState(4);
  const [isClient, setIsCount] = useState(false);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setIsCount(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  if (!isClient) return null;
  // Floating particles animation
  const particles = Array.from({ length: 20 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute h-2 w-2 rounded-full bg-primary/30 dark:bg-primary/50"
      initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        x: [
          Math.random() * window.innerWidth,
          Math.random() * window.innerWidth,
          Math.random() * window.innerWidth,
        ],
        y: [
          Math.random() * window.innerHeight,
          Math.random() * window.innerHeight,
          Math.random() * window.innerHeight,
        ],
        scale: [0.5, 1, 0.5],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 10 + Math.random() * 20,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  ));

  // Mouse follower effect
  const followerVariants = {
    default: {
      x: mousePosition.x - 150,
      y: mousePosition.y - 150,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 0.8,
      },
    },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background particles */}
      {particles}

      {/* Mouse follower */}
      <motion.div
        className="pointer-events-none fixed h-[300px] w-[300px] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"
        variants={followerVariants}
        animate="default"
      />

      {/* Main content */}
      <div className="z-10 max-w-3xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-[180px] font-bold leading-none tracking-tighter"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              delay: 0.2,
            }}
          >
            <motion.span
              className="inline-block"
              animate={{
                rotateY: [0, 360],
                color: ["#000", "#f00", "#000"],
              }}
              transition={{
                rotateY: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 5,
                },
                color: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 5,
                },
              }}
            >
              4
            </motion.span>
            <motion.span
              className="mx-2 inline-block"
              animate={{
                rotateX: [0, 360],
                color: ["#000", "#f00", "#000"],
              }}
              transition={{
                rotateX: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 5,
                  delay: 0.3,
                },
                color: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 5,
                  delay: 0.3,
                },
              }}
            >
              0
            </motion.span>
            <motion.span
              className="inline-block"
              animate={{
                rotateY: [0, -360],
                color: ["#000", "#f00", "#000"],
              }}
              transition={{
                rotateY: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 5,
                  delay: 0.6,
                },
                color: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 5,
                  delay: 0.6,
                },
              }}
            >
              4
            </motion.span>
          </motion.div>

          <motion.h1
            className="mb-6 mt-4 text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Page Not Found
          </motion.h1>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="mx-auto max-w-md text-lg text-muted-foreground">
              Oops! It seems you've ventured into uncharted territory. The page
              you're looking for has either been moved, deleted, or never
              existed.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/">
                <motion.button
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home size={18} />
                  Return Home
                </motion.button>
              </Link>

              <motion.button
                className="flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-medium text-secondary-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
              >
                <RefreshCw size={18} />
                Go Back
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Compass animation */}
        <motion.div
          className="mb-8 mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Compass size={80} className="text-primary/50" />
          </motion.div>
        </motion.div>

        {/* Glitch effect text */}
        <motion.div
          className="relative mt-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="glitch-wrapper">
            <div className="glitch" data-text="ERROR_CODE: PAGE_NOT_FOUND">
              ERROR_CODE: PAGE_NOT_FOUND
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
