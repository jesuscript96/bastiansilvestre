import { getWorks, getBodyOfWorks, getCategories, Work, BodyOfWork, Category } from '@/lib/supabase';
import WorkSection from '@/components/WorkSection';
import HorizontalSeries from '@/components/HorizontalSeries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // 1. Featured Works
  const featuredWorks = allWorks
    .filter(w => w.Feature)
    .sort((a, b) => (a.SortNumber || 0) - (b.SortNumber || 0));

  // 2. Remaining Works grouped by Body of Work
  const otherWorks = allWorks.filter(w => !w.Feature);
  
  const sortedBOWs = allBodyOfWorks.sort((a, b) => (a.SortNumber || 0) - (b.SortNumber || 0));

  const bodyOfWorkSections = sortedBOWs.map(bow => {
    // Works belonging to this BOW that are not featured
    const bowWorks = otherWorks
      .filter(w => w.BodyOfWork?.includes(bow.Name))
      .sort((a, b) => (a.SortNumber || 0) - (b.SortNumber || 0));
    
    // Group works by Series_Name
    const groups: { type: 'standalone' | 'series', works: Work[], id: string }[] = [];
    const processedSeries = new Set<string>();

    bowWorks.forEach(work => {
      if (work.Series_Name) {
        if (!processedSeries.has(work.Series_Name)) {
          const seriesWorks = bowWorks.filter(w => w.Series_Name === work.Series_Name);
          groups.push({ 
            type: 'series', 
            works: seriesWorks, 
            id: `series-${bow.id}-${work.Series_Name}` 
          });
          processedSeries.add(work.Series_Name);
        }
      } else {
        groups.push({ 
          type: 'standalone', 
          works: [work], 
          id: `work-${work.id}` 
        });
      }
    });

    return {
      ...bow,
      groups
    };
  }).filter(section => section.groups.length > 0);

  return (
    <div className="flex flex-col">
      {/* Render Featured Works first */}
      {featuredWorks.map((work) => (
        <WorkSection
          key={work.id}
          work={work}
        />
      ))}

      {/* Render Body of Work Sections */}
      {bodyOfWorkSections.map((section) => (
        <div key={section.id} id={section.Slug}>
          {section.groups.map((group) => {
            if (group.type === 'series') {
              return (
                <HorizontalSeries
                  key={group.id}
                  works={group.works}
                  slug={group.id}
                />
              );
            }

            // Standalone works
            return group.works.map((work) => (
              <WorkSection
                key={work.id}
                work={work}
              />
            ));
          })}
        </div>
      ))}
    </div>
  );
}
