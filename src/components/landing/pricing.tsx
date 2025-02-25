"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Free",
    price: "0",
    features: [
      "Connect up to 2 email accounts",
      "Basic AI search",
      "AI email drafts (Limited)",
      "Standard email organization",
    ],
  },
  {
    name: "Pro",
    price: "9.99",
    features: [
      "Connect unlimited email accounts",
      "Advanced AI search & filtering",
      "Unlimited AI email drafts",
      "Smart follow-ups & reminders",
      "Dark mode & customizable themes",
    ],
    popular: true,
  },
  {
    name: "Business",
    price: "19.99",
    features: [
      "All Pro features",
      "Team collaboration",
      "Shared inbox for teams",
      "Priority customer support",
      "Custom AI workflows",
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-gray-600">No hidden fees. Cancel anytime.</p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow ${
                plan.popular ? "border-2 border-blue-500" : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                  Popular
                </div>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-x-2">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">${plan.price}</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">/month</span>
                </div>
                <Button className="mt-8 w-full">{plan.price === "0" ? "Get Started" : "Subscribe"}</Button>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

