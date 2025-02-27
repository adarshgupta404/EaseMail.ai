"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Search, Sparkles } from "lucide-react";
import { RoboAnimation } from "./robo-animation";
import { SparklesCore } from "./sparkles";
import { useTheme } from "next-themes";
import { FloatingPaper } from "@/components/landing/floating-paper"

export default function Hero() {
  const { theme } = useTheme();
  return (
    <div className="relative z-0 overflow-hidden">
      <div className="relative z-10 h-[calc(100dvh+308px)] min-h-[1050px] w-full">
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={10} />
      </div>

        <SparklesCore
          particleColor={
            theme === "dark" || theme === "system" ? "#FFFFFF" : "#000000"
          }
        />
        <div className="absolute top-0 z-20 h-full w-full">
          <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
            <RoboAnimation />
            <div className="relative text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold tracking-tight sm:text-6xl"
              >
                The Smarter, Minimalist
                <br />
                <span className="text-blue-600">Email Client</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto mt-6 max-w-2xl text-xl"
              >
                One Inbox. Multiple Accounts. AI-Powered Efficiency.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 flex items-center justify-center gap-4"
              >
                <Button size="lg" className="h-12 px-8">
                  Get Early Access <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Learn More
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-20"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full max-w-4xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
                </div>
                <div className="relative">
                  <div className="mx-auto h-[400px] w-full max-w-4xl overflow-hidden rounded-2xl border bg-card/70 shadow-2xl backdrop-blur">
                    <img
                      className="h-full w-full object-cover object-left md:object-center"
                      src="https://omnileadzdev.s3.amazonaws.com/NjVlMDhhYjUwMDNlZWY4NmNlNWQwYmY5/1740503395731_blob"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-20 flex justify-center gap-8">
              {[
                { icon: Mail, text: "All Your Emails in One Place" },
                { icon: Search, text: "AI-Powered Search" },
                { icon: Sparkles, text: "Smart Email Generation" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="rounded-full bg-blue-100 p-3">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-center text-sm font-medium">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
