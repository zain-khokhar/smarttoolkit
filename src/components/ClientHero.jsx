'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ClientHero() {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-indigo-50 to-indigo-100"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Unlock Your Potential with SmartToolkit</h1>
        <p className="text-lg md:text-xl mb-8">Fast, private, ad-free — tools that actually help you work.</p>
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
      </div>
    </motion.section>
  );
}
