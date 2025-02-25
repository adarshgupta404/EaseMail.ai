"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Mail, Search, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight"
          >
            The Smarter, Minimalist
            <br />
            <span className="text-blue-600">Email Client</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            One Inbox. Multiple Accounts. AI-Powered Efficiency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8">
              Get Early Access
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
              <div className="w-full h-full max-w-4xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
            </div>
            <div className="relative">
              <div className="w-full h-[400px] max-w-4xl mx-auto rounded-2xl bg-white/70 backdrop-blur border border-gray-200 shadow-2xl overflow-hidden">
              <img src="https://omnileadzdev.s3.amazonaws.com/NjVlMDhhYjUwMDNlZWY4NmNlNWQwYmY5/1740503395731_blob"/></div>
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
              <div className="p-3 rounded-full bg-blue-100">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

