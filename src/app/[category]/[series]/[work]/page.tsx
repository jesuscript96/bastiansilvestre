import { getWorkById, getSeriesBySlug, getSeriesWorks } from '@/lib/airtable';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

    const seriesData = await getSeriesBySlug(seriesSlug);
    const worksValues = seriesData ? await getSeriesWorks(seriesData.Name) : [];

    // Find current index and next work
    const currentIndex = worksValues.findIndex(w => w.id === workId);
    const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % worksValues.length : 0;
    const nextWork = worksValues[nextIndex];

    const nextWorkUrl = nextWork ? `/${category}/${seriesSlug}/${nextWork.id}` : '#';

    // Transform for Context
    const workDetailData = {
        title: work.Title,
        seriesName: work.Series_Name ? work.Series_Name[0] : '', // Lookup returns array
        year: work.Year,
        material: work.Material,
        size: work.Size,
        collection: work.Collection,
        status: work.Status,
        edition: work.Edition
    };

    return (
        <div className="h-full flex flex-col items-center justify-center min-h-[50vh]">
            <WorkDetailClient data={workDetailData} />

            <div className="relative w-full h-[85vh] group">
                {work.Detail_Image || work.Primary_Image ? (
                    <Link href={nextWorkUrl} className="block w-full h-full cursor-e-resize relative">
                        <Image
                            src={(work.Detail_Image || work.Primary_Image) as string}
                            alt={work.Title || 'Detail'}
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
                ) : (
                    <div className="text-white/30 text-center mt-20">Image not available</div>
                )}

                {/* Mobile Info Overlay */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 block md:hidden text-right pointer-events-none max-w-[40%]">
                    <div className="space-y-4">
                        <div>
                            <span className="text-white italic block text-sm">{work.Title}</span>
                            {work.Year && <span className="text-white text-xs block">{work.Year}</span>}
                        </div>

                        <div className="flex flex-col gap-1 text-zinc-400 text-xs font-mono">
                            {work.Material && <p>{work.Material}</p>}
                            {work.Size && <p>{work.Size}</p>}
                            {work.Edition && <p>{work.Edition}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
