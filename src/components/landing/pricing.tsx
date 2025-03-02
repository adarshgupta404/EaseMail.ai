"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { MagicCard } from "../magicui/magic-card";

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
    <section id="pricing" className="relative py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-10 blur-3xl">
        <div className="absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
        {/* <div className="absolute bottom-0 right-0 h-[300px] w-[600px] rounded-full bg-gradient-to-l from-pink-400 to-blue-300" /> */}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Choose the perfect plan for your needs. No hidden fees. Cancel
            anytime.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`flex h-fit ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              <MagicCard
                className={`relative flex h-full w-full flex-col rounded-2xl ${
                  plan.popular
                    ? "border-blue-500/20"
                    : "border border-border/40"
                }`}
                gradientSize={300}
                gradientFrom={plan.popular ? "#4F46E5" : "#9E7AFF"}
                gradientTo={plan.popular ? "#06B6D4" : "#FE8BBB"}
                gradientOpacity={0.15}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-max text-white shadow-lg">
                    <button className="border border-white animate-shimmer inline-flex items-center justify-center rounded-full bg-[linear-gradient(110deg,#1E3A8A,45%,#3B82F6,55%,#1E3A8A)] bg-[length:200%_100%] px-6 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-50">
                      Most Popular
                    </button>
                  </div>
                )}
                <div className="flex flex-col p-8">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-5 flex items-baseline">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-xl font-medium text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {plan.name === "Free"
                      ? "Perfect for getting started"
                      : plan.name === "Pro"
                        ? "Everything you need for personal use"
                        : "Advanced features for teams"}
                  </p>

                  <button
                    className="animate-shimmer mt-8 inline-flex items-center justify-center rounded-lg border border-blue-800 bg-[linear-gradient(110deg,#2563EB,45%,#06B6D4,55%,#2563EB)] bg-[length:200%_100%] px-6 py-2 font-medium text-white transition-colors hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-50" // className={`mt-8 w-full text-base font-semibold ${
                  >
                    {plan.price === "0" ? "Get Started" : "Subscribe Now"}
                  </button>
                </div>

                <div className="flex flex-1 flex-col rounded-b-2xl bg-muted/30 p-8 pt-6">
                  <p className="font-medium text-muted-foreground">Includes:</p>
                  <ul className="mt-6 flex-1 space-y-5">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div
                          className={`rounded-full p-1 ${plan.popular ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"}`}
                        >
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Need a custom plan for your enterprise?{" "}
            <a
              href="#contact"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
