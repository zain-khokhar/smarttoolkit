"use client";
import dynamic from 'next/dynamic';
const HumnizerUI = dynamic(() => import('../../../components/HumnizerUI'), { ssr: false });

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HumnizerUI />
    </div>
  );
}