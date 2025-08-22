'use client';
import { motion } from 'framer-motion';
import { Brain, Lock, Zap, SlidersHorizontal as Customize, Shield, BarChart } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  { icon: Brain, title: 'AI-Powered Insights', description: 'Leverage intuitive AI...' },
  { icon: Zap, title: 'Fast & Reliable', description: 'Seamless performance...' },
  { icon: Lock, title: 'Privacy-Focused', description: 'No ads, secure data...' },
  { icon: Customize, title: 'Customizable', description: 'Tailor to your needs...' },
  { icon: Shield, title: 'Ad-Free', description: 'No distractions...' },
  { icon: BarChart, title: 'Boost Efficiency', description: 'Streamlined tasks...' },
];

export default function ClientFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full">
              <CardHeader>
                <Icon className="w-10 h-10 mb-2 text-indigo-600" />
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{f.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
