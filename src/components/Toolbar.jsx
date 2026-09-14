import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Grid,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Rotate3d,
  Layers,
  Sparkles,
  Cloud
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export function Toolbar({
  currentPage,
  totalPages,
  pages,
  onPageChange,
  isOrbitMode,
  onToggleOrbit,
  isPlaying,
  onTogglePlay,
  zoomLevel,
  onZoomChange
}) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleSound = () => {
    const nextState = soundFx.toggleSound();
    setSoundEnabled(nextState);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* TOP FLOATING HEADER BAR */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-5xl glass-panel px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#08090d] rounded-[7px] flex items-center justify-center">
              <Cloud className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold font-display tracking-wider text-metallic">
              CLOUDBYTE
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              3D BOOK SPECIFICATION MODEL
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Table of Contents Drawer Toggle */}
          <button
            onClick={() => setShowDrawer(prev => !prev)}
            className={`glass-btn ${showDrawer ? 'active' : ''}`}
            title="Table of Contents Drawer"
          >
            <Grid className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Contents</span>
          </button>

          {/* 3D Orbit Camera Mode */}
          <button
            onClick={onToggleOrbit}
            className={`glass-btn ${isOrbitMode ? 'active' : ''}`}
            title="Toggle 3D Mouse Drag Orbit"
          >
            <Rotate3d className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">3D View</span>
          </button>

          {/* Auto-Play Mode */}
          <button
            onClick={onTogglePlay}
            className={`glass-btn ${isPlaying ? 'active' : ''}`}
            title="Toggle Slideshow Presentation Mode"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-amber-400" />
            ) : (
              <Play className="w-4 h-4 text-emerald-400" />
            )}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          {/* Audio FX Toggle */}
          <button
            onClick={handleToggleSound}
            className={`glass-btn ${soundEnabled ? '' : 'text-gray-500'}`}
            title="Toggle Paper Flip Sound Effects"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Zoom Level Controls */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-white/10 rounded-xl p-1">
            <button
              onClick={() => onZoomChange(Math.max(0.7, zoomLevel - 0.1))}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-gray-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => onZoomChange(Math.min(1.3, zoomLevel + 0.1))}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="glass-btn p-2"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* BOTTOM PROGRESS & NAVIGATION SCRUBBER */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl glass-panel px-5 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (currentPage > 0) {
                soundFx.playFlipSound('backward');
                onPageChange(currentPage - 1);
              }
            }}
            disabled={currentPage === 0}
            className="glass-btn p-2 disabled:opacity-30 disabled:pointer-events-none"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 text-indigo-400" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400">
              Page <span className="text-white font-bold">{currentPage + 1}</span> of{' '}
              <span className="text-gray-300">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={() => {
              if (currentPage < totalPages - 1) {
                soundFx.playFlipSound('forward');
                onPageChange(currentPage + 1);
              }
            }}
            disabled={currentPage === totalPages - 1}
            className="glass-btn p-2 disabled:opacity-30 disabled:pointer-events-none"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          </button>
        </div>

        {/* Scrubber Range Input */}
        <input
          type="range"
          min="0"
          max={totalPages - 1}
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
      </footer>

      {/* TABLE OF CONTENTS THUMBNAIL DRAWER */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-4xl max-h-[85vh] glass-panel p-6 overflow-y-auto flex flex-col gap-6 relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold font-display text-metallic">
                  Table of Contents & Thumbnails
                </h3>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="glass-btn px-3 py-1 text-xs"
              >
                Close Drawer
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pages.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onPageChange(index);
                    setShowDrawer(false);
                    soundFx.playFlipSound('forward');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-40 ${
                    currentPage === index
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-indigo-300">
                      PG {index + 1}
                    </span>
                    {currentPage === index && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-200 line-clamp-1">{p.title}</div>
                    <div className="text-[10px] text-gray-500 line-clamp-2 mt-1">
                      {p.subtitle || p.description || 'Chapter Content'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
