"use client";

import { motion } from "framer-motion";
import { Search, Mail, Moon, Shield, Zap, Calendar } from "lucide-react";

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
    <section id="features" className="bg-muted py-20">
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
              className="relative rounded-xl bg-primary-foreground p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
