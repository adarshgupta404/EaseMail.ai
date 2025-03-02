"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 opacity-10 blur-3xl">
        <div className="absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
        {/* <div className="absolute bottom-0 right-0 h-[300px] w-[600px] rounded-full bg-gradient-to-l from-pink-400 to-blue-300" /> */}
      </div>
      <div className="mx-auto relative max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold">Experience Email, Reimagined</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Join our early access list and simplify your inbox today!
          </p>
          <Button size="lg" className="mt-8 relative">
            Get Early Access <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
