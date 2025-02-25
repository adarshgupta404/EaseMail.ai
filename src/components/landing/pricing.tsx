"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

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
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl bg-primary-foreground p-8 shadow-sm transition-shadow hover:shadow-lg ${
                plan.popular
                  ? "border-2 border-blue-500 dark:shadow-blue-500"
                  : "border border-gray-200 dark:shadow-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0 -translate-y-1/2 rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                  Popular
                </div>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-x-2">
                  <span className="text-4xl font-bold tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <Button className="mt-8 w-full">
                  {plan.price === "0" ? "Get Started" : "Subscribe"}
                </Button>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
