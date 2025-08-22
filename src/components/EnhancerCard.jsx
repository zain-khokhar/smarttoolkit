// src/components/EnhancerCard.jsx
'use client';
import React, { useState } from 'react';
import BeforeAfter from './BeforeAfter';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EnhancerCard({
  title = 'Image Enhancer',
  description = 'Quick preview of before / after.',
  beforeSrc,
  afterSrc,
  type = 'image' // or 'video'
}) {
  const [pos, setPos] = useState(0); // start showing "before"
  const [processing, setProcessing] = useState(false);

  function showResultAuto() {
    // simulate processing, then show 100%
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPos(100);
    }, 900); // fake processing time
  }

  function resetBefore() {
    setPos(0);
  }

  function toggleHalf() {
    setPos((p) => (p === 50 ? 0 : 50));
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <BeforeAfter beforeSrc={beforeSrc} afterSrc={afterSrc} type={type} pos={pos} setPos={setPos} />
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button onClick={showResultAuto} variant="default" size="sm">
            {processing ? 'Processing...' : 'Show Result'}
          </Button>
          <Button onClick={resetBefore} variant="outline" size="sm">Show Before</Button>
          <Button onClick={toggleHalf} variant="ghost" size="sm">Toggle 50/0</Button>
        </div>
      </CardContent>
    </Card>
  );
}
