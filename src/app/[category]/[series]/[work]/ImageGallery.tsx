"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ImageGalleryProps {
    primaryImage: string;
    secondaryImages: string[];
    title: string;
    nextWorkUrl: string;
}

export default function ImageGallery({ primaryImage, secondaryImages, title, nextWorkUrl }: ImageGalleryProps) {
    const [currentImage, setCurrentImage] = useState(primaryImage);

    if (!primaryImage && (!secondaryImages || secondaryImages.length === 0)) {
        return <div className="text-white/30 text-center mt-20">Image not available</div>;
    }

    // Combined list for thumbnail rendering if needed, 
    // but the user said thumbnails shouldn't include the principal image.
    // However, we want to be able to switch back to primary image if we click it?
    // Actually, "Los thumbnails siempre serán máximo 3 y no incluirán la imagen principal"
    // implies once you click a thumbnail, you might want to go back.
    // Let's stick to the requirement: thumbnails = secondary images only.

    return (
        <div className="w-full flex flex-col items-center gap-8">
            {/* Main Image Container */}
            <div className="relative w-full h-[60vh] md:h-[80vh] group">
                <Link href={nextWorkUrl} className="block w-full h-full cursor-e-resize relative">
                    <Image
                        src={currentImage}
                        alt={`${title}`}
                        fill
                        className="object-contain"
                        priority
                        quality={90}
                    />
                    {/* Optional Next Indicator on Hover */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 text-4xl font-light select-none">
                        &rsaquo;
                    </div>
                </Link>
            </div>

            {/* Thumbnails Row */}
            {secondaryImages.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 px-4 pb-8">
                    {secondaryImages.map((img: string, index: number) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(img)}
                            className={`relative w-24 h-24 md:w-32 md:h-32 border-2 transition-all overflow-hidden ${currentImage === img ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${title} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 96px, 128px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
