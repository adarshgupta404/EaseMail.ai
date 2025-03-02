"use client";

import { motion } from "framer-motion";
import { Search, Mail, Moon, Shield, Zap, Calendar } from "lucide-react";
import { MagicCard } from "../magicui/magic-card";

const features = [
  {
    icon: Search,
    title: "AI-Powered Search",
    description:
      "Find the exact email you need in seconds—no more scrolling endlessly.",
  },
  {
    icon: Mail,
    title: "Smart Email Generation",
    description: "Draft professional emails quickly with AI assistance.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your emails stay private with top-tier security and encryption.",
  },
  {
    icon: Zap,
    title: "Instant Email Syncing",
    description:
      "Stay updated with real-time email synchronization across all devices.",
  },
  {
    icon: Calendar,
    title: "AI Reminders & Follow-ups",
    description:
      "Never miss an important email—EasyMail.ai will remind you to reply.",
  },
  {
    icon: Moon,
    title: "Dark Mode for Better Focus",
    description:
      "Switch between light and dark mode for a comfortable reading experience.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20">
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
          <h2 className="text-3xl font-bold">Why Choose EasyMail.ai?</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Powerful features to make email management effortless
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
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
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted dark:bg-muted">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
