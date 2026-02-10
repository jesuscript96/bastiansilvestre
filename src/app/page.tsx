import { getWorks, getBodyOfWorks, getCategories, Work, BodyOfWork, Category } from '@/lib/airtable';
import WorkSection from '@/components/WorkSection';
import HorizontalSeries from '@/components/HorizontalSeries';

export const revalidate = 600; // ISR 10 minutes

export default async function Home() {
  let allWorks: Work[] = [];
  let allBodyOfWorks: BodyOfWork[] = [];
  let allCategories: Category[] = [];

  try {
    const [fetchedAllWorks, fetchedBodyOfWorks, fetchedCategories] = await Promise.all([
      getWorks(),
      getBodyOfWorks(),
      getCategories()
    ]);
    allWorks = fetchedAllWorks;
    allBodyOfWorks = fetchedBodyOfWorks;
    allCategories = fetchedCategories;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  // Group works by body of work
  const bodyOfWorkSections = allBodyOfWorks.map(bow => {
    const bowWorks = allWorks.filter(w => w.BodyOfWork?.includes(bow.id));
    return {
      ...bow,
      works: bowWorks
    };
  }).filter(section => section.works.length > 0);

  return (
    <div className="flex flex-col">
      {bodyOfWorkSections.map((section) => {
        if (section.isSerie) {
          // Horizontal navigation for series
          return (
            <HorizontalSeries
              key={section.id}
              works={section.works}
              slug={section.Slug}
            />
          );
        }

        // Standard vertical list for non-series
        return section.works.map((work, index) => {
          const isFirstInBOW = index === 0;
          return (
            <WorkSection
              key={work.id}
              id={isFirstInBOW ? section.Slug : undefined}
              work={work}
            />
          );
        });
      })}
    </div>
  );
}
