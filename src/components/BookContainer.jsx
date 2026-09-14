import React, { useState, useRef } from 'react';
import { BookPageFlip } from './BookPageFlip';
import { RotateCcw } from 'lucide-react';

export function BookContainer({
  pages,
  currentPage,
  onPageChange,
  onEditPage,
  isOrbitMode,
  zoomLevel
}) {
  const [rotation, setRotation] = useState({ x: 12, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 12, initialY: 0 });

  const handleMouseDown = (e) => {
    if (!isOrbitMode) return;
    // Don't drag if clicking buttons
    if (e.target.closest('button') || e.target.closest('.glass-btn')) return;

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: rotation.x,
      initialY: rotation.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isOrbitMode) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    // Clamp X tilt between -40deg and 45deg
    const newX = Math.max(-40, Math.min(45, dragRef.current.initialX - deltaY * 0.25));
    const newY = dragRef.current.initialY + deltaX * 0.35;

    setRotation({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetOrbit = () => {
    setRotation({ x: 12, y: 0 });
  };

  return (
    <div
      className={`stage-3d ${isOrbitMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Reset 3D View indicator if rotated */}
      {isOrbitMode && (rotation.x !== 12 || rotation.y !== 0) && (
        <button
          onClick={handleResetOrbit}
          className="absolute top-6 right-6 z-30 glass-btn text-xs animate-fade-in"
          title="Reset 3D Orbit Camera"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Reset Camera Angle</span>
        </button>
      )}

      {/* 3D Viewport wrapper with rotation & zoom transforms */}
      <div
        className="book-3d-viewport"
        style={{
          transform: `rotateX(${isOrbitMode ? rotation.x : 0}deg) rotateY(${
            isOrbitMode ? rotation.y : 0
          }deg) scale(${zoomLevel})`,
        }}
      >
        <BookPageFlip
          pages={pages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          onEditPage={onEditPage}
          is3DTilted={isOrbitMode}
        />

        {/* Ambient Floor Shadow ("bg shadow") */}
        <div className="book-shadow-floor"></div>
      </div>
    </div>
  );
}
