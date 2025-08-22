// src/components/ToolsDemo.jsx
'use client';
import React from 'react';
import EnhancerCard from './EnhancerCard';

export default function ToolsDemo() {
  return (
    <section className="py-12 px-4 md:px-8 lg:px-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Live Before / After Demos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EnhancerCard
          title="Image Enhancer"
          description="AI-upscaled & denoised result."
          beforeSrc="/demo/image-before.jpg"
          afterSrc="/demo/image-after.jpg"
          type="image"
        />

        <EnhancerCard
          title="Image Converter"
          description="Converted format / compressed preview."
          beforeSrc="/demo/convert-before.png"
          afterSrc="/demo/convert-after.webp"
          type="image"
        />

        <EnhancerCard
          title="Video Enhancer"
          description="Frame-enhanced preview (mute to autoplay before)."
          beforeSrc="/demo/video-before.mp4"
          afterSrc="/demo/video-after.mp4"
          type="video"
        />
      </div>
    </section>
  );
}
