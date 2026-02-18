import { getWorkById, getBodyOfWorkBySlug, getBodyOfWorkWorks } from '@/lib/airtable';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ImageGallery from './ImageGallery';
import WorkDetailClient from './WorkDetailClient'; // Client component to update context

interface PageProps {
    params: Promise<{
        category: string;
        series: string;
        work: string;
    }>;
}

export const revalidate = 3600;

export default async function WorkPage({ params }: PageProps) {
    const { work: workId, series: seriesSlug, category } = await params;

    const work = await getWorkById(workId);

    if (!work) {
        notFound();
    }

    const bodyOfWorkData = await getBodyOfWorkBySlug(seriesSlug);
    const worksValues = bodyOfWorkData ? await getBodyOfWorkWorks(bodyOfWorkData.Name) : [];

    // Find current index, next work, and previous work
    const currentIndex = worksValues.findIndex(w => w.id === workId);
    const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % worksValues.length : 0;
    const prevIndex = currentIndex !== -1 ? (currentIndex - 1 + worksValues.length) % worksValues.length : 0;

    const nextWork = worksValues[nextIndex];
    const prevWork = worksValues[prevIndex];

    const nextWorkUrl = nextWork ? `/${category}/${seriesSlug}/${nextWork.id}` : '#';
    const prevWorkUrl = prevWork ? `/${category}/${seriesSlug}/${prevWork.id}` : '#';

    // Primary image is the default
    const primaryImage = work.Primary_Image || work.Detail_Image || '';

    // Secondary images (thumbnails) - max 3, excluding the one used as primary
    const allDetailImages = [
        work.Detail_Image,
        work.Detail_Image_2,
        work.Context_Image,
        work.Primary_Image
    ].filter((img): img is string => !!img);

    // Filter out the primary image from the thumbnails and limit to 3
    const secondaryImages = allDetailImages
        .filter(img => img !== primaryImage)
        .slice(0, 3);

    // Transform for Context
    const workDetailData = {
        title: work.Title,
        bodyOfWorkName: work.BodyOfWork_Name || '',
        year: work.Year,
        material: work.Material,
        size: work.Size,
        collection: work.Collection,
        status: work.Status,
        edition: work.Edition
    };

    return (
        <div className="h-full flex flex-col items-center justify-center min-h-[50vh] pt-0 pb-10 md:py-10">
            <WorkDetailClient data={workDetailData} />

            <div className="w-full">
                <ImageGallery
                    primaryImage={primaryImage}
                    secondaryImages={secondaryImages}
                    title={work.Title}
                    nextWorkUrl={nextWorkUrl}
                    prevWorkUrl={prevWorkUrl}
                    isSerie={bodyOfWorkData?.isSerie ?? false}
                />
            </div>

            {/* Mobile Info Overlay - Moved to relative block below image */}
            <div className="block md:hidden w-full bg-black p-6 text-left">
                <div className="space-y-4">
                    <div>
                        <span className="text-white/60 italic block text-xl">
                            {work.Title}{work.Year ? `, ${work.Year}` : ''}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 text-zinc-400 text-sm font-mono">
                        {work.Material && <p>{work.Material}</p>}
                        {work.Size && <p>{work.Size}</p>}
                        {work.Collection && <p>{work.Collection}</p>}
                        {work.Edition && <p>{work.Edition}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
