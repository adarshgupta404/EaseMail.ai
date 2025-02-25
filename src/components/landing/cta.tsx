"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">
            Experience Email, Reimagined
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join our early access list and simplify your inbox today!
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link
              target="__blank"
              href={
                "https://formbuilder-fe.vercel.app/submit/6bcd29f5-b1d5-4797-9613-154cec4902a2"
              }
            >
              Get Early Access <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
