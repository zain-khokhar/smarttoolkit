"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ClientHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-indigo-50 via-white to-indigo-100"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900"
        >
          Unlock Your Potential with{" "}
          <span className="text-indigo-600">SmartToolkit</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
        >
          Fast, reliable, and ad-free —{" "}
          <span className="font-semibold text-gray-800">
            privacy-focused tools
          </span>{" "}
          built to help you work smarter.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-2xl shadow-lg"
            asChild
          >
            <Link href="/tools/jpg">Explore Tools</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 rounded-2xl"
            asChild
          >
            {/* <Link href="/about">Learn More</Link> */}
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
