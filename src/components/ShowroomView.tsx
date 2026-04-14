import { getShowroomWorks, ShowroomWork } from '@/lib/showroom';
import { getBodyOfWorks, BodyOfWork } from '@/lib/supabase';
import ShowroomWorkSection from '@/components/ShowroomWorkSection';
import ShowroomHorizontalSeries from '@/components/ShowroomHorizontalSeries';
import DeepLinkHandler from '@/components/DeepLinkHandler';

export default async function ShowroomView() {
  let allWorks: ShowroomWork[] = [];
  let allBodyOfWorks: BodyOfWork[] = [];

  try {
    const [fetchedWorks, fetchedBodyOfWorks] = await Promise.all([
      getShowroomWorks(),
      getBodyOfWorks(),
    ]);
    allWorks = fetchedWorks;
    allBodyOfWorks = fetchedBodyOfWorks;
  } catch (error) {
    console.error("Failed to fetch showroom data:", error);
  }

  const sortedBOWs = allBodyOfWorks.sort((a, b) => (a.SortNumber || 0) - (b.SortNumber || 0));

  const bodyOfWorkSections = sortedBOWs.map(bow => {
    // Works belonging to this BOW that are in the showroom
    const bowWorks = allWorks
      .filter(w => w.BodyOfWork && bow.Name && w.BodyOfWork.includes(bow.Name))
      .sort((a, b) => (a.SortNumber || 0) - (b.SortNumber || 0));
    
    // Group works by Series_Name
    const groups: { type: 'standalone' | 'series', works: ShowroomWork[], id: string, slug?: string }[] = [];
    const processedSeries = new Set<string>();

    bowWorks.forEach(work => {
      if (work.Series_Name) {
        if (!processedSeries.has(work.Series_Name)) {
          const seriesWorks = bowWorks.filter(w => w.Series_Name === work.Series_Name);
          groups.push({ 
            type: 'series', 
            works: seriesWorks, 
            id: `series-${bow.id}-${work.Series_Name}`,
            slug: work.Series_Name 
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
      <DeepLinkHandler />
      
      {bodyOfWorkSections.map((section) => (
        <div key={section.id} id={section.Slug}>
          {section.groups.map((group) => {
            if (group.type === 'series') {
              return (
                <ShowroomHorizontalSeries
                  key={group.id}
                  works={group.works}
                  slug={group.slug || group.id}
                />
              );
            }

            // Standalone works
            return group.works.map((work, idx) => (
              <ShowroomWorkSection
                key={work.id}
                work={work}
                id={work.work_id}
                nextWorkId={idx < group.works.length - 1 ? (group.works[idx + 1].work_id || group.works[idx + 1].id) : undefined}
                prevWorkId={idx > 0 ? (group.works[idx - 1].work_id || group.works[idx - 1].id) : undefined}
              />
            ));
          })}
        </div>
      ))}

      {allWorks.length === 0 && (
          <div className="min-h-screen flex items-center justify-center text-muted-foreground font-mono uppercase tracking-widest text-xs">
              No pieces currently available in the showroom.
          </div>
      )}
    </div>
  );
}
