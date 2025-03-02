"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { MagicCard } from "../magicui/magic-card";

const testimonials = [
  {
    name: "Rohan M.",
    role: "Marketing Manager",
    content:
      "EasyMail.ai has completely changed how I handle emails. The AI search is a lifesaver!",
  },
  {
    name: "Priya S.",
    role: "Freelancer",
    content:
      "A minimalist, clutter-free inbox with powerful AI features. Highly recommend!",
  },
  {
    name: "Ankit K.",
    role: "Startup Founder",
    content:
      "I love how I can manage multiple accounts in one place and draft emails in seconds!",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-20">
      <div className="absolute inset-0 opacity-10 blur-3xl">
        <div className="absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
        {/* <div className="absolute bottom-0 right-0 h-[300px] w-[600px] rounded-full bg-gradient-to-l from-pink-400 to-blue-300" /> */}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Join thousands of satisfied users
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MagicCard
                gradientSize={300}
                gradientFrom={"#9E7AFF"}
                gradientTo={"#FE8BBB"}
                gradientOpacity={0.15}
                className="relative translate-y-0 overflow-hidden rounded-xl transition-transform duration-300 ease-in-out hover:-translate-y-3"
              >
                <div className="overflow-hidden bg-muted/30 p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-gray-500 dark:text-gray-400">
                    {testimonial.content}
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
