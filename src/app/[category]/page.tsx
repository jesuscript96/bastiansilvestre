import { getCategoryBySlug, getSeries, getSeriesWorks } from '@/lib/airtable';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import GenericInfoUpdater from '@/components/GenericInfoUpdater';

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: PageProps) {
    const { category: categorySlug } = await params;

    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
        notFound();
    }

    const allSeries = await getSeries();
    // Filter series that belong to this category by ID
    const seriesList = allSeries.filter(s => s.Category && s.Category.includes(category.id));

    // Fetch works for each series
    const seriesWithWorks = await Promise.all(
        seriesList.map(async (s) => {
            const works = await getSeriesWorks(s.Name);
            return { ...s, works: works.slice(0, 4) }; // Show up to 4 featured works
        })
    );

    return (
        <div className="space-y-12 pb-20">
            <GenericInfoUpdater
                data={{
                    title: category.Name,
                    description: `Bodies of work under ${category.Name}`,
                }}
            />

            <header>
                <h1 className="text-4xl font-light uppercase tracking-widest">{category.Name}</h1>
                <div className="w-12 h-px bg-white my-6"></div>
            </header>

            <div className="space-y-8">
                {seriesWithWorks.map(series => (
                    <div key={series.id} className="space-y-8 pt-8">
                        <div className="flex justify-between items-baseline">
                            <h2 className="text-2xl font-light uppercase tracking-wider">{series.Name}</h2>
                            <Link
                                href={`/${categorySlug}/${series.Slug}`}
                                className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
                            >
                                View Collection &rarr;
                            </Link>
                        </div>

                        {series.Description && (
                            <p className="text-xs text-white/50 leading-loose max-w-2xl font-mono hidden md:block">
                                {series.Description}
                            </p>
                        )}

                        <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4">
                            {series.works.map(work => (
                                <Link
                                    key={work.id}
                                    href={`/${categorySlug}/${series.Slug}/${work.id}`}
                                    className="break-inside-avoid relative group bg-neutral-900 overflow-hidden block"
                                >
                                    {work.Primary_Image ? (
                                        <Image
                                            src={work.Primary_Image}
                                            alt={work.Title}
                                            width={600}
                                            height={600}
                                            className="w-full h-auto object-cover transition-opacity duration-500 opacity-80 group-hover:opacity-100"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="aspect-square flex items-center justify-center text-[10px] uppercase tracking-widest text-white/10">No Image</div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
                {seriesList.length === 0 && (
                    <div className="text-white/40 italic">No series found in this category.</div>
                )}
            </div>
        </div>
    );
}
