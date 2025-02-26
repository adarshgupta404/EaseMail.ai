"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-900 dark:bg-gray-900/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">EasyMail.ai</span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 text-primary md:flex">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost">
              <Link href={"/sign-in"}>Log in</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-secondary-foreground transition-colors duration-200 dark:text-secondary-foreground"
    >
      <button> {children}</button>
    </Link>
  );
}
