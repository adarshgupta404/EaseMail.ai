"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Search, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative overflow-hidden pb-32 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            The Smarter, Minimalist
            <br />
            <span className="text-blue-600">Email Client</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-xl text-gray-600"
          >
            One Inbox. Multiple Accounts. AI-Powered Efficiency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8" asChild>
              <Link
                target="__blank"
                href={
                  "https://formbuilder-fe.vercel.app/submit/6bcd29f5-b1d5-4797-9613-154cec4902a2"
                }
              >
                Get Early Access <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
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
              <div className="mx-auto h-[400px] w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-2xl backdrop-blur">
                <img src="https://omnileadzdev.s3.amazonaws.com/NjVlMDhhYjUwMDNlZWY4NmNlNWQwYmY5/1740503395731_blob" />
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
              <span className="text-sm font-medium text-gray-600">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
