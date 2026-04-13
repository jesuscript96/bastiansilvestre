"use client";

import { useEffect, useRef } from 'react';
import { useLayoutContext, WorkDetail } from '@/context/LayoutContext';
import ImageGallery from '@/app/[category]/[series]/[work]/ImageGallery';
import { ShowroomWork } from '@/lib/showroom';

interface ShowroomWorkSectionProps {
    work: ShowroomWork;
    id?: string;
    nextWorkId?: string;
    prevWorkId?: string;
    isSeriePart?: boolean;
}

export default function ShowroomWorkSection({ work, id, nextWorkId, prevWorkId, isSeriePart }: ShowroomWorkSectionProps) {
    const { setWorkDetail } = useLayoutContext();
    const sectionRef = useRef<HTMLDivElement>(null);

    let sizeDisplay = '';
    if (work.Size) {
        sizeDisplay += String(work.Size).trim();
        if (!sizeDisplay.includes('cm') && !sizeDisplay.includes('CM')) {
            sizeDisplay += ' cm';
        }
    }
    if (work.Size_inches) {
        if (sizeDisplay) sizeDisplay += ' / ';
        let inchesStr = String(work.Size_inches).trim();
        sizeDisplay += inchesStr;
        if (!inchesStr.includes('"') && !inchesStr.includes('”') && !inchesStr.includes('“') && !inchesStr.includes('″')) {
            sizeDisplay += ' "';
        }
    }

    const workDetailData: WorkDetail = {
        title: work.Title,
        bodyOfWorkName: work.BodyOfWork_Name || '',
        year: work.Year,
        material: work.Material,
        size: sizeDisplay,
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
                threshold: 0.6,
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

    const mailtoLink = `mailto:bastian@studiosilvestre.com?subject=Acquire: ${encodeURIComponent(work.Title)}&body=I am interested in acquiring "${encodeURIComponent(work.Title)}" (${work.Year || 'N/A'}). Please provide more details.`;

    return (
        <section
            ref={sectionRef}
            id={id || `work-${work.id}`}
            className="min-h-0 md:min-h-screen flex flex-col items-center justify-center pt-0 pb-10 md:py-20"
        >
            <div className="w-full">
                <ImageGallery
                    primaryImage={primaryImage}
                    secondaryImages={secondaryImages}
                    title={work.Title}
                    nextWorkUrl={nextWorkId ? `#${nextWorkId}` : '#'}
                    prevWorkUrl={prevWorkId ? `#${prevWorkId}` : '#'}
                    showNavigation={!isSeriePart}
                />
            </div>

            {/* Price & Acquire Info (Visible on Desktop as well, near the gallery or below) */}
            <div className="w-full max-w-4xl px-6 md:px-0 mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <span className="text-muted-foreground uppercase text-[10px] tracking-widest block">Showroom Piece</span>
                    <div className="flex items-baseline gap-4">
                        <span className="text-2xl font-light tracking-tighter">
                            {work.work_price ? `$${work.work_price} USD` : 'Price upon request'}
                        </span>
                    </div>
                </div>
                
                <a 
                    href={work.payment_link || mailtoLink}
                    target={work.payment_link ? "_blank" : undefined}
                    rel={work.payment_link ? "noopener noreferrer" : undefined}
                    className="px-8 py-3 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-foreground/80 transition-colors"
                >
                    Acquire
                </a>
            </div>

            {/* Mobile Info Overlay (Optional redundancy) */}
            <div className="block md:hidden w-full bg-background p-6 text-left mt-2">
                <div className="space-y-4">
                    <div>
                        <span className="text-foreground italic block text-xl">{work.Title}</span>
                        {work.Year && <span className="text-foreground/60 text-sm block">{work.Year}</span>}
                    </div>

                    <div className="flex flex-col gap-1 text-muted text-sm font-mono">
                        {work.Material && <p>{work.Material}</p>}
                        {sizeDisplay && <p>{sizeDisplay}</p>}
                    </div>
                </div>
            </div>
        </section>
    );
}
