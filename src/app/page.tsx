import { getWorks, getSeries, getCategories, Work, Series, Category } from '@/lib/airtable';
import WorkSection from '@/components/WorkSection';

export const revalidate = 600; // ISR 10 minutes

export default async function Home() {
  let allWorks: Work[] = [];
  let allSeries: Series[] = [];
  let allCategories: Category[] = [];

  try {
    const [fetchedAllWorks, fetchedSeries, fetchedCategories] = await Promise.all([
      getWorks(),
      getSeries(),
      getCategories()
    ]);
    allWorks = fetchedAllWorks;
    allSeries = fetchedSeries;
    allCategories = fetchedCategories;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  // Create a flat list of works ordered by series and their internal order
  // We'll iterate through series to maintain the "Body of Work" grouping
  const orderedWorks: Work[] = [];
  const seriesFirstWorkMap: Record<string, string> = {};

  allSeries.forEach((series) => {
    const seriesWorks = allWorks.filter(w => w.Series?.includes(series.id));
    // Optionally sort seriesWorks by an 'Order' field if it exists in Airtable
    if (seriesWorks.length > 0) {
      seriesFirstWorkMap[series.Slug] = seriesWorks[0].id;
      orderedWorks.push(...seriesWorks);
    }
  });

  return (
    <div className="flex flex-col">
      {orderedWorks.map((work, index) => {
        const nextWork = orderedWorks[index + 1];
        const prevWork = orderedWorks[index - 1];

        // Find if this is the first work of a series
        const seriesSlug = allSeries.find(s => s.id === work.Series?.[0])?.Slug;
        const isFirstInSeries = seriesSlug && orderedWorks.findIndex(w => w.Series?.[0] === work.Series?.[0]) === index;

        return (
          <WorkSection
            key={work.id}
            id={isFirstInSeries ? seriesSlug : undefined}
            work={work}
            nextWorkId={nextWork?.id}
            prevWorkId={prevWork?.id}
          />
        );
      })}
    </div>
  );
}
