import { getSeriesBySlug, getSeriesWorks } from '@/lib/airtable';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GenericInfoUpdater from '@/components/GenericInfoUpdater';

interface PageProps {
    params: Promise<{
        category: string;
        series: string;
    }>;
}

export const revalidate = 3600;

export default async function SeriesPage({ params }: PageProps) {
    const { series: seriesSlug, category } = await params;

    const series = await getSeriesBySlug(seriesSlug);

    if (!series) {
        notFound();
    }

    const works = await getSeriesWorks(series.Name);

    return (
        <div className="space-y-8">
            <GenericInfoUpdater
                data={{
                    title: series.Name,
                    description: series.Description,
                    meta: [`Category: ${category}`]
                }}
            />
            <header className="pb-4">
                <h1 className="text-3xl font-light uppercase tracking-widest">{series.Name}</h1>
                {series.Description && <p className="text-white/60 mt-2 max-w-xl">{series.Description}</p>}
            </header>

            <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
                {works.map(work => (
                    <Link
                        key={work.id}
                        href={`/${category}/${seriesSlug}/${work.id}`}
                        className="group break-inside-avoid block space-y-2 opacity-80 hover:opacity-100 transition-opacity"
                    >
                        <div className="relative bg-neutral-900 overflow-hidden">
                            {work.Primary_Image ? (
                                <Image
                                    src={work.Primary_Image}
                                    alt={work.Title || ''}
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-cover transition-all duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center aspect-square text-white/10">NO IMAGE</div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
