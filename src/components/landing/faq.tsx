"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What email providers does EasyMail.ai support?",
    answer: "We support Gmail, Outlook, Yahoo, and any email service with IMAP/SMTP access.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes! We use end-to-end encryption and never store your emails on our servers.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "You can cancel anytime, and you won't be charged for the next billing cycle.",
  },
  {
    question: "Does EasyMail.ai work on mobile?",
    answer: "Yes! We have a responsive web app, and mobile apps are coming soon.",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600">Everything you need to know about EasyMail.ai</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

