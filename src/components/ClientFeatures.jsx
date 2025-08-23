"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Lock,
  Zap,
  SlidersHorizontal as Customize,
  Shield,
  BarChart,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Leverage intuitive AI to simplify complex tasks and improve decision-making.",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Experience seamless performance with instant, consistent results.",
  },
  {
    icon: Lock,
    title: "Privacy-Focused",
    description: "Your data stays secure. 100% private, with zero tracking or logging.",
  },
  {
    icon: Customize,
    title: "Customizable",
    description: "Tailor SmartToolkit utilities to your personal workflow and needs.",
  },
  {
    icon: Shield,
    title: "Ad-Free",
    description: "No clutter, no distractions — just clean and productive tools.",
  },
  {
    icon: BarChart,
    title: "Boost Efficiency",
    description: "Streamlined utilities designed to save time and maximize productivity.",
  },
];

export default function ClientFeatures() {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900">
          Why Choose <span className="text-indigo-600">SmartToolkit</span>?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our powerful, privacy-first utilities designed to make your digital life easier, faster, and more secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-50 mb-4">
                    <Icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {f.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
