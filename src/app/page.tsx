import { getFeaturedWorks, getSeries, getCategories, Work, Series, Category } from '@/lib/airtable';
import Image from 'next/image';
import Link from 'next/link';
import GenericInfoUpdater from '@/components/GenericInfoUpdater';

export const revalidate = 600; // ISR 10 minutes

export default async function Home() {
  let works: Work[] = [];
  let allSeries: Series[] = [];
  let allCategories: Category[] = [];

  try {
    const [fetchedWorks, fetchedSeries, fetchedCategories] = await Promise.all([
      getFeaturedWorks(),
      getSeries(),
      getCategories()
    ]);
    works = fetchedWorks;
    allSeries = fetchedSeries;
    allCategories = fetchedCategories;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  const getWorkUrl = (work: Work) => {
    // 1. Find the series
    // Work.Series is an array of IDs. Take the first one.
    const seriesId = work.Series?.[0];
    if (!seriesId) return '#';

    const series = allSeries.find(s => s.id === seriesId);
    if (!series) return '#';

    // 2. Find the category
    // Series.Category is an array of IDs. Take the first one.
    const categoryId = series.Category?.[0];
    if (!categoryId) return '#';

    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return '#';

    return `/${category.Slug}/${series.Slug}/${work.id}`;
  };

  return (
    <div className="space-y-12">
      <GenericInfoUpdater
        data={{
          title: "Featured Works",
          description: "Selected projects demonstrating minimal aesthetics and technical precision."
        }}
      />
      {/* 10% smaller roughly translates to text-3xl from text-4xl, and off-white color */}
      <h1 className="text-[1.8rem] md:text-[2rem] font-light tracking-tighter uppercase mb-12 text-zinc-300">Featured Works</h1>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {works.map((work) => {
          const workUrl = getWorkUrl(work);

          return (
            <Link
              key={work.id}
              href={workUrl}
              className="break-inside-avoid relative block bg-neutral-900 overflow-hidden group cursor-pointer"
            >
              {work.Primary_Image ? (
                <Image
                  src={work.Primary_Image}
                  alt={work.Title || 'Artwork'}
                  width={800}
                  height={1000} // Estimate, but css will handle ratio
                  className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full aspect-[4/5] flex items-center justify-center text-white/20 uppercase tracking-widest text-xs">
                  No Image
                </div>
              )}

              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h2 className="text-lg font-medium text-white">{work.Title}</h2>
                <p className="text-xs text-white/60">{work.Year}</p>
              </div>
            </Link>
          );
        })}
        {works.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-50">
            <p>No featured works found or Airtable not connected.</p>
            <p className="text-xs mt-2 text-white/30">Make sure to check .env.local configuration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
