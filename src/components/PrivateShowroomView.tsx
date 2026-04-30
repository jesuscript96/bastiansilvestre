'use client';

import { ShowroomWork } from '@/lib/showroom';
import { BodyOfWork } from '@/lib/supabase';
import ShowroomWorkSection from '@/components/ShowroomWorkSection';
import ShowroomHorizontalSeries from '@/components/ShowroomHorizontalSeries';

interface Props {
    works: ShowroomWork[];
    bodyOfWorks: BodyOfWork[];
}

export default function PrivateShowroomView({ works, bodyOfWorks }: Props) {
    const sortedBOWs = [...bodyOfWorks].sort((a, b) => (a.SortNumber || 0) - (b.SortNumber || 0));

    type Group = { type: 'standalone' | 'series'; works: ShowroomWork[]; id: string; slug?: string };

    const bodyOfWorkSections = sortedBOWs.map(bow => {
        const bowWorks = works
            .filter(w => w.BodyOfWork && bow.Name && w.BodyOfWork.includes(bow.Name))
            .sort((a, b) => (a.SortNumber || 0) - (b.SortNumber || 0));

        const groups: Group[] = [];
        const processedSeries = new Set<string>();

        bowWorks.forEach(work => {
            if (work.Series_Name) {
                if (!processedSeries.has(work.Series_Name)) {
                    const seriesWorks = bowWorks.filter(w => w.Series_Name === work.Series_Name);
                    groups.push({
                        type: 'series',
                        works: seriesWorks,
                        id: `series-${bow.id}-${work.Series_Name}`,
                        slug: work.Series_Name,
                    });
                    processedSeries.add(work.Series_Name);
                }
            } else {
                groups.push({ type: 'standalone', works: [work], id: `work-${work.id}` });
            }
        });

        return { ...bow, groups };
    }).filter(section => section.groups.length > 0);

    const assignedIds = new Set(
        bodyOfWorkSections.flatMap(s => s.groups.flatMap(g => g.works.map(w => w.id)))
    );
    const orphanWorks = works.filter(w => !assignedIds.has(w.id));

    if (works.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground font-mono uppercase tracking-widest text-xs">
                No pieces in this selection.
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {bodyOfWorkSections.map(section => (
                <div key={section.id} id={section.Slug}>
                    {section.groups.map(group => {
                        if (group.type === 'series') {
                            return (
                                <ShowroomHorizontalSeries
                                    key={group.id}
                                    works={group.works}
                                    slug={group.slug || group.id}
                                />
                            );
                        }
                        return group.works.map((work, idx) => (
                            <ShowroomWorkSection
                                key={work.id}
                                work={work}
                                id={work.work_id}
                                nextWorkId={group.works[idx + 1] ? (group.works[idx + 1].work_id || group.works[idx + 1].id) : undefined}
                                prevWorkId={group.works[idx - 1] ? (group.works[idx - 1].work_id || group.works[idx - 1].id) : undefined}
                            />
                        ));
                    })}
                </div>
            ))}

            {orphanWorks.map((work, idx) => (
                <ShowroomWorkSection
                    key={work.id}
                    work={work}
                    id={work.work_id}
                    nextWorkId={orphanWorks[idx + 1] ? (orphanWorks[idx + 1].work_id || orphanWorks[idx + 1].id) : undefined}
                    prevWorkId={orphanWorks[idx - 1] ? (orphanWorks[idx - 1].work_id || orphanWorks[idx - 1].id) : undefined}
                />
            ))}
        </div>
    );
}
