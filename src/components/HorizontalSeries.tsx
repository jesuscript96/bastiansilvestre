"use client";

import { useRef, useState, useEffect } from 'react';
import WorkSection from './WorkSection';
import { Work } from '@/lib/supabase';

interface HorizontalSeriesProps {
    works: Work[];
    slug: string;
}

export default function HorizontalSeries({ works, slug }: HorizontalSeriesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollToIndex = (index: number) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const targetX = index * container.clientWidth;
        container.scrollTo({
            left: targetX,
            behavior: 'smooth'
        });
        setCurrentIndex(index);
    };

    const handleNext = () => {
        if (currentIndex < works.length - 1) {
            scrollToIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            scrollToIndex(currentIndex - 1);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollLeft / container.clientWidth);
            if (index !== currentIndex) {
                setCurrentIndex(index);
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [currentIndex]);

    return (
        <section id={slug} className="w-full relative min-h-screen flex flex-col justify-center py-10 md:py-20 group">
            {/* Side Navigation Arrows (Desktop Overlay) */}
            <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[100] w-16 h-16 items-center justify-center text-foreground/30 hover:text-foreground transition-all hover:bg-foreground/5 rounded-full ${currentIndex === 0 ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                aria-label="Previous work"
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            <button
                onClick={handleNext}
                disabled={currentIndex === works.length - 1}
                className={`hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[100] w-16 h-16 items-center justify-center text-foreground/30 hover:text-foreground transition-all hover:bg-foreground/5 rounded-full ${currentIndex === works.length - 1 ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                aria-label="Next work"
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {works.map((work, idx) => (
                    <div key={work.id} className="w-full min-w-full snap-center flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <div className="w-full max-w-full">
                            <WorkSection
                                work={work}
                                id={work.work_id}
                                nextWorkId={idx < works.length - 1 ? (works[idx + 1].work_id || works[idx + 1].id) : undefined}
                                prevWorkId={idx > 0 ? (works[idx - 1].work_id || works[idx - 1].id) : undefined}
                                isSeriePart={true}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Navigation controls */}
            <div className="flex flex-col items-center mt-4 md:mt-8 gap-4 px-6 md:px-0 w-full">
                <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`p-2 transition-colors ${currentIndex === 0 ? 'text-disabled' : 'text-muted-foreground hover:text-foreground'}`}
                        aria-label="Previous work"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                        {currentIndex + 1} <span className="mx-2">/</span> {works.length}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === works.length - 1}
                        className={`p-2 transition-colors ${currentIndex === works.length - 1 ? 'text-disabled' : 'text-muted-foreground hover:text-foreground'}`}
                        aria-label="Next work"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
