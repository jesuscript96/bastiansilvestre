"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLayoutContext, WorkDetail } from '@/context/LayoutContext';
import ImageGallery from '@/app/[category]/[series]/[work]/ImageGallery';

interface WorkSectionProps {
    work: any;
    id?: string;
    nextWorkId?: string;
    prevWorkId?: string;
}

export default function WorkSection({ work, id, nextWorkId, prevWorkId }: WorkSectionProps) {
    const { setWorkDetail } = useLayoutContext();
    const sectionRef = useRef<HTMLDivElement>(null);

    const workDetailData: WorkDetail = {
        title: work.Title,
        seriesName: work.Series_Name ? work.Series_Name[0] : '',
        year: work.Year,
        material: work.Material,
        size: work.Size,
        collection: work.Collection,
        status: work.Status,
        edition: work.Edition
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setWorkDetail(workDetailData);
                }
            },
            {
                threshold: 0.6, // Trigger when 60% of the section is visible
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [work.id]);

    const primaryImage = work.Primary_Image || work.Detail_Image || '';
    const allDetailImages = [
        work.Detail_Image,
        work.Detail_Image_2,
        work.Context_Image,
        work.Primary_Image
    ].filter((img): img is string => !!img);

    const secondaryImages = allDetailImages
        .filter(img => img !== primaryImage)
        .slice(0, 3);

    return (
        <section
            ref={sectionRef}
            id={id || `work-${work.id}`}
            className="min-h-0 md:min-h-screen flex flex-col items-center justify-center py-10 md:py-20"
        >
            <div className="w-full">
                <ImageGallery
                    primaryImage={primaryImage}
                    secondaryImages={secondaryImages}
                    title={work.Title}
                    nextWorkUrl={nextWorkId ? `#work-${nextWorkId}` : '#'}
                    prevWorkUrl={prevWorkId ? `#work-${prevWorkId}` : '#'}
                />
            </div>

            {/* Mobile Info Overlay */}
            <div className="block md:hidden w-full bg-black p-6 text-left mt-2">
                <div className="space-y-4">
                    <div>
                        <span className="text-white italic block text-xl">{work.Title}</span>
                        {work.Year && <span className="text-white/60 text-sm block">{work.Year}</span>}
                    </div>

                    <div className="flex flex-col gap-1 text-zinc-400 text-sm font-mono">
                        {work.Material && <p>{work.Material}</p>}
                        {work.Size && <p>{work.Size}</p>}
                        {work.Collection && <p>{work.Collection}</p>}
                        {work.Edition && <p>{work.Edition}</p>}
                    </div>
                </div>
            </div>
        </section>
    );
}
