"use client"

import { motion } from "framer-motion"
import { Search, Mail, Moon, Shield, Zap, Calendar } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "AI-Powered Search",
    description: "Find the exact email you need in seconds—no more scrolling endlessly.",
  },
  {
    icon: Mail,
    title: "Smart Email Generation",
    description: "Draft professional emails quickly with AI assistance.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your emails stay private with top-tier security and encryption.",
  },
  {
    icon: Zap,
    title: "Instant Email Syncing",
    description: "Stay updated with real-time email synchronization across all devices.",
  },
  {
    icon: Calendar,
    title: "AI Reminders & Follow-ups",
    description: "Never miss an important email—EasyMail.ai will remind you to reply.",
  },
  {
    icon: Moon,
    title: "Dark Mode for Better Focus",
    description: "Switch between light and dark mode for a comfortable reading experience.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900">Why Choose EasyMail.ai?</h2>
          <p className="mt-4 text-lg text-gray-600">Powerful features to make email management effortless</p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

