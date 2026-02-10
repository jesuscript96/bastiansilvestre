"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, MouseEvent } from 'react';

interface ImageGalleryProps {
    primaryImage: string;
    secondaryImages: string[];
    title: string;
    nextWorkUrl: string;
    prevWorkUrl: string;
    showNavigation?: boolean;
}

export default function ImageGallery({
    primaryImage,
    secondaryImages,
    title,
    nextWorkUrl,
    prevWorkUrl,
    showNavigation = true
}: ImageGalleryProps) {
    const allImages = [primaryImage, ...secondaryImages].filter(Boolean);
    const [currentImage, setCurrentImage] = useState(primaryImage);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [showMagnifier, setShowMagnifier] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;

        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;

        setZoomPos({ x, y });
    };

    if (!primaryImage && (!secondaryImages || secondaryImages.length === 0)) {
        return <div className="text-white/30 text-center mt-20">Image not available</div>;
    }

    return (
        <div className="w-full flex flex-col items-center gap-2 md:gap-8">
            {/* Main Image Container */}
            <div
                ref={containerRef}
                className="relative w-full h-auto md:h-[80vh] group overflow-hidden cursor-none"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
            >
                {/* The Image */}
                <div className="relative w-full h-full md:block hidden overflow-hidden">
                    <Image
                        src={currentImage}
                        alt={`${title}`}
                        fill
                        className="object-contain transition-transform duration-200 ease-out"
                        style={{
                            transform: showMagnifier ? 'scale(2)' : 'scale(1)',
                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                        }}
                        priority
                        quality={90}
                    />
                </div>

                {/* Mobile Image (Visible only on small screens) */}
                <div className="md:hidden block w-full max-h-[60vh] overflow-hidden">
                    <img
                        src={currentImage}
                        alt={`${title}`}
                        className="w-full h-full object-contain block mx-auto"
                    />
                </div>

                {/* Navigation Links (Conditionally rendered) */}
                {showNavigation && (
                    <>
                        <Link
                            href={nextWorkUrl}
                            className="absolute inset-x-1/2 inset-y-0 right-0 z-10 block"
                            aria-label="Next work"
                        />
                        <Link
                            href={prevWorkUrl}
                            className="absolute inset-x-0 inset-y-0 right-1/2 z-10 block"
                            aria-label="Previous work"
                        />

                        {/* Desktop Indicators */}
                        <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 text-4xl font-light select-none z-30 pointer-events-none">
                            &rsaquo;
                        </div>
                        <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 text-4xl font-light select-none z-30 pointer-events-none">
                            &lsaquo;
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails Row */}
            {allImages.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-4 pb-4 md:pb-8">
                    {allImages.filter(img => img !== currentImage).map((img: string, index: number) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(img)}
                            className="relative w-16 h-16 md:w-32 md:h-32 border-[1px] md:border-2 transition-all overflow-hidden border-transparent opacity-40 hover:opacity-80"
                        >
                            <Image
                                src={img}
                                alt={`${title} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 64px, 128px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
