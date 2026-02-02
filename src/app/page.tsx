import { getFeaturedWorks, getWorks, getSeries, getCategories, Work, Series, Category } from '@/lib/airtable';
import Image from 'next/image';
import Link from 'next/link';
import GenericInfoUpdater from '@/components/GenericInfoUpdater';

export const revalidate = 600; // ISR 10 minutes

export default async function Home() {
  let featuredWorks: Work[] = [];
  let allWorks: Work[] = [];
  let allSeries: Series[] = [];
  let allCategories: Category[] = [];

  try {
    const [fetchedFeatured, fetchedAllWorks, fetchedSeries, fetchedCategories] = await Promise.all([
      getFeaturedWorks(),
      getWorks(),
      getSeries(),
      getCategories()
    ]);
    featuredWorks = fetchedFeatured;
    allWorks = fetchedAllWorks;
    allSeries = fetchedSeries;
    allCategories = fetchedCategories;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  const getWorkUrl = (work: Work) => {
    const seriesId = work.Series?.[0];
    if (!seriesId) return '#';
    const series = allSeries.find(s => s.id === seriesId);
    if (!series) return '#';
    const categoryId = series.Category?.[0];
    if (!categoryId) return '#';
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return '#';
    return `/${category.Slug}/${series.Slug}/${work.id}`;
  };

  return (
    <div className="space-y-24 pb-20">
      {/* <GenericInfoUpdater
        data={{
          title: "Bastian Silvestre",
          description: "Visual artist exploring materiality and form."
        }}
      /> */}

      {/* Featured Works Section */}
      <section id="featured" className="space-y-12">
        <h1 className="text-2xl md:text-[1.7rem] font-light tracking-tighter uppercase text-zinc-200">Featured Works</h1>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {featuredWorks.map((work) => (
            <WorkCard key={work.id} work={work} workUrl={getWorkUrl(work)} />
          ))}
        </div>
      </section>

      {/* Series Sections */}
      {allSeries.map((series) => {
        const seriesId = series.id;
        const seriesWorks = allWorks.filter(w => w.Series?.includes(seriesId));

        if (seriesWorks.length === 0) return null;

        return (
          <section key={series.id} id={series.Slug} className="space-y-12 pt-12 border-t border-white/5">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-[1.7rem] font-light tracking-tighter uppercase text-zinc-200">{series.Name}</h2>
              {series.Description && <p className="text-zinc-500 text-sm max-w-2xl">{series.Description}</p>}
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {seriesWorks.map((work) => (
                <WorkCard key={work.id} work={work} workUrl={getWorkUrl(work)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function WorkCard({ work, workUrl }: { work: Work; workUrl: string }) {
  return (
    <Link
      href={workUrl}
      className="break-inside-avoid relative block bg-black overflow-hidden group cursor-pointer"
    >
      {work.Primary_Image ? (
        <Image
          src={work.Primary_Image}
          alt={work.Title || 'Artwork'}
          width={800}
          height={1000}
          className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full aspect-[4/5] flex items-center justify-center text-white/20 uppercase tracking-widest text-xs">
          No Image
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h2 className="text-lg font-medium text-white">{work.Title}</h2>
        <p className="text-xs text-white/60">{work.Year}</p>
      </div>
    </Link>
  );
}
