import React, { useState, useEffect } from 'react';
import { PageContent } from './PageContent';
import { soundFx } from '../utils/audio';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function BookPageFlip({
  pages,
  currentPage,
  onPageChange,
  onEditPage,
  is3DTilted
}) {
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [dragStartX, setDragStartX] = useState(null);

  const totalPages = pages.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      soundFx.playFlipSound('forward');
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      soundFx.playFlipSound('backward');
      onPageChange(currentPage - 1);
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Touch / Drag handler for swiping
  const handleTouchStart = (e) => {
    setDragStartX(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const handleTouchEnd = (e) => {
    if (dragStartX === null) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diffX = endX - dragStartX;

    if (diffX < -50) {
      handleNext();
    } else if (diffX > 50) {
      handlePrev();
    }
    setDragStartX(null);
  };

  // Calculate pairs of pages for sheets
  // Cover is Page 0. Spread 1 is Page 1 (Left) & Page 2 (Right)...
  const isCover = currentPage === 0;
  const isBackCover = currentPage === totalPages - 1;

  // Determine active left and right page indices
  const leftPageIndex = currentPage > 0 ? (currentPage % 2 === 1 ? currentPage : currentPage - 1) : null;
  const rightPageIndex = currentPage > 0 ? (currentPage % 2 === 1 ? currentPage + 1 : currentPage) : 0;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Book Container */}
      <div
        className={`book-shell transition-all duration-700 ${
          isCover || isBackCover ? 'w-[360px] sm:w-[420px]' : 'w-[700px] sm:w-[840px]'
        } h-[500px] sm:h-[560px] flex relative`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Book Spine Center Lighting */}
        {!isCover && !isBackCover && (
          <div className="book-spine-middle"></div>
        )}

        {/* LEFT PAGE (Spread view) */}
        {!isCover && (
          <div
            className="w-1/2 h-full relative rounded-l-xl overflow-hidden bg-[#07080d] border-r border-white/5 shadow-2xl flex flex-col cursor-pointer"
            onClick={handlePrev}
          >
            {leftPageIndex !== null && pages[leftPageIndex] ? (
              <PageContent
                page={pages[leftPageIndex]}
                customData={pages[leftPageIndex]}
                onEditPage={onEditPage}
              />
            ) : (
              <div className="w-full h-full bg-[#05060a]"></div>
            )}
            <div className="page-spine-shadow-left"></div>
            {/* Click hover prompt left */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity p-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* RIGHT PAGE / COVER VIEW */}
        {!isBackCover && (
          <div
            className={`${
              isCover ? 'w-full' : 'w-1/2'
            } h-full relative rounded-r-xl overflow-hidden bg-[#07080d] shadow-2xl flex flex-col cursor-pointer`}
            onClick={handleNext}
          >
            {rightPageIndex !== null && pages[rightPageIndex] ? (
              <PageContent
                page={pages[rightPageIndex]}
                customData={pages[rightPageIndex]}
                onEditPage={onEditPage}
              />
            ) : (
              <div className="w-full h-full bg-[#05060a]"></div>
            )}
            <div className="page-spine-shadow-right"></div>
            {/* Click hover prompt right */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity p-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* BACK COVER DISPLAY */}
        {isBackCover && (
          <div className="w-full h-full relative rounded-xl overflow-hidden bg-[#07080d] shadow-2xl flex flex-col cursor-pointer" onClick={handlePrev}>
            <PageContent
              page={pages[totalPages - 1]}
              customData={pages[totalPages - 1]}
              onEditPage={onEditPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
