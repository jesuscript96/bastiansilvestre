"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, MouseEvent, useEffect } from 'react';

interface ImageGalleryProps {
    primaryImage: string;
    secondaryImages: string[];
    title: string;
    nextWorkUrl: string;
    prevWorkUrl: string;
    showNavigation?: boolean;
    isSerie?: boolean;
}

export default function ImageGallery({
    primaryImage,
    secondaryImages,
    title,
    nextWorkUrl,
    prevWorkUrl,
    showNavigation = true,
    isSerie = false
}: ImageGalleryProps) {
    const allImages = [primaryImage, ...secondaryImages].filter(Boolean);
    const [currentImage, setCurrentImage] = useState(primaryImage);

    // Sync state with prop if primaryImage changes (e.g. revalidation)
    useEffect(() => {
        setCurrentImage(primaryImage);
    }, [primaryImage]);

    // Magnifier logic disabled as per request
    // const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    // const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    // const [isOverImage, setIsOverImage] = useState(false);
    // const [showMagnifier, setShowMagnifier] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // const handleMouseMove = (e: MouseEvent) => {
    //     if (!containerRef.current || !aspectRatio) return;
    //     // ... existing logic commented out ...
    // };

    if (!primaryImage && (!secondaryImages || secondaryImages.length === 0)) {
        return <div className="text-white/30 text-center mt-20">Image not available</div>;
    }

    return (
        <div className="w-full flex flex-col items-center gap-2 md:gap-8">
            {/* Main Image Container */}
            <div
                ref={containerRef}
                className="relative w-full h-auto md:h-[80vh] group overflow-hidden cursor-default"
            >
                {/* The Image (Desktop) */}
                <div className="relative w-full h-full md:block hidden overflow-hidden">
                    <Image
                        src={currentImage}
                        alt={`${title}`}
                        fill
                        className="object-contain transition-transform duration-200 ease-out z-0"
                        priority
                        quality={90}
                    />
                </div>

                {/* Mobile Image (Visible only on small screens) */}
                <div className="md:hidden block w-full px-4">
                    <img
                        src={currentImage}
                        alt={`${title}`}
                        className="w-full h-auto block mx-auto"
                    />
                </div>

                {/* Navigation Links (Conditionally rendered) */}
                {showNavigation && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <Link
                            href={nextWorkUrl}
                            className="absolute inset-x-1/2 inset-y-0 right-0 block pointer-events-auto"
                            aria-label="Next work"
                        />
                        <Link
                            href={prevWorkUrl}
                            className="absolute inset-x-0 inset-y-0 right-1/2 block pointer-events-auto"
                            aria-label="Previous work"
                        />

                        {/* Desktop Indicators - Show only if isSerie */}
                        {isSerie && (
                            <>
                                <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 text-4xl font-light select-none z-30 pointer-events-none">
                                    &rsaquo;
                                </div>
                                <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 text-4xl font-light select-none z-30 pointer-events-none">
                                    &lsaquo;
                                </div>
                            </>
                        )}

                        {/* Mobile Indicators - Show only if isSerie */}
                        {isSerie && (
                            <>
                                <div className="md:hidden block absolute right-2 top-1/2 -translate-y-1/2 text-white/50 text-4xl font-light select-none z-30 pointer-events-none">
                                    &rsaquo;
                                </div>
                                <div className="md:hidden block absolute left-2 top-1/2 -translate-y-1/2 text-white/50 text-4xl font-light select-none z-30 pointer-events-none">
                                    &lsaquo;
                                </div>
                            </>
                        )}
                    </div>
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
