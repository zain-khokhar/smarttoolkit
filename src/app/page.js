// src/app/page.js
import ClientHero from '@/components/ClientHero';
import ClientFeatures from '@/components/ClientFeatures';

export const metadata = {
  title: 'SmartToolkit: Fast, Reliable, AI-Powered Productivity Toolkit',
  description: 'Discover SmartToolkit — fast, private, ad-free toolkit.',
  keywords: 'fast reliable toolkit, privacy-focused, no ads, AI-powered productivity',
  openGraph: { title: 'SmartToolkit', description: '...' }
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ClientHero />
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <ClientFeatures />
      </section>
      <footer className="py-8 px-4 bg-indigo-800 text-white">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p>&copy; 2025 SmartToolkit. All rights reserved.</p>
          <nav>
            <a href="/privacy" className="mx-2">Privacy</a>
            <a href="/contact" className="mx-2">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
