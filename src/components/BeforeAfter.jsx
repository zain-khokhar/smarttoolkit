// src/components/BeforeAfter.jsx
'use client';
import React, { useRef, useState } from 'react';

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  type = 'image', // 'image' or 'video'
  alt = 'before-after',
  pos: externalPos,
  setPos: externalSetPos,
  className = ''
}) {
  const containerRef = useRef(null);
  const [internalPos, setInternalPos] = useState(50);
  const pos = typeof externalPos !== 'undefined' ? externalPos : internalPos;
  const setPos = externalSetPos || setInternalPos;
  const [dragging, setDragging] = useState(false);

  function updatePosFromPointer(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let p = Math.round(((clientX - rect.left) / rect.width) * 100);
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    setPos(p);
  }

  function onPointerDown(e) {
    setDragging(true);
    updatePosFromPointer(e);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    updatePosFromPointer(e);
  }
  function onPointerUp() {
    setDragging(false);
  }

  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full select-none touch-none"
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        {type === 'image' ? (
          <>
            <img src={beforeSrc} alt={alt + ' before'} className="w-full h-auto block" />
            <div className="absolute top-0 left-0 h-full overflow-hidden transition-[width]" style={{ width: `${pos}%` }}>
              <img src={afterSrc} alt={alt + ' after'} className="w-full h-auto block" />
            </div>
          </>
        ) : (
          <>
            <video src={beforeSrc} className="w-full h-auto block" muted playsInline />
            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${pos}%` }}>
              <video src={afterSrc} className="w-full h-auto block" controls />
            </div>
          </>
        )}

        {/* Divider handle */}
        <div
          className="absolute top-0 h-full -translate-x-1/2 flex items-center pointer-events-none"
          style={{ left: `${pos}%` }}
        >
          <div className="w-[1px] h-full bg-white/70 pointer-events-none"></div>
          <div className="ml-2 w-8 h-8 rounded-full bg-white/95 border shadow flex items-center justify-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Invisible range for keyboard + accessibility */}
      <input
        aria-label="Before / After slider"
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute left-0 right-0 bottom-2 w-[calc(100%-2rem)] mx-4 appearance-none"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
