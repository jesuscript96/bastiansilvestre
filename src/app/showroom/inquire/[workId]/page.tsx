import { getShowroomWorkById } from '@/lib/showroom';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import InquireForm from '@/components/InquireForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{ workId: string }>;
}

export default async function InquirePage({ params }: PageProps) {
    const { workId } = await params;
    const work = await getShowroomWorkById(workId);

    if (!work) notFound();

    let sizeDisplay = '';
    if (work.Size) {
        sizeDisplay += String(work.Size).trim();
        if (!sizeDisplay.includes('cm') && !sizeDisplay.includes('CM')) {
            sizeDisplay += ' cm';
        }
    }
    if (work.Size_inches) {
        if (sizeDisplay) sizeDisplay += ' / ';
        const inchesStr = String(work.Size_inches).trim();
        sizeDisplay += inchesStr;
        if (!inchesStr.includes('"') && !inchesStr.includes('”') && !inchesStr.includes('″')) {
            sizeDisplay += ' "';
        }
    }

    const primaryImage = work.Primary_Image || work.Detail_Image || '';

    return (
        <div className="min-h-screen md:pl-12">
            {/* Back link */}
            <div className="px-6 md:px-12 pt-8 pb-4">
                <Link
                    href="/showroom"
                    className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Showroom
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)]">
                {/* Left — image + info */}
                <div className="flex flex-col px-6 md:px-12 pb-12 md:py-12 gap-8">
                    {primaryImage && (
                        <div className="w-full aspect-[4/5] relative overflow-hidden bg-muted/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={primaryImage}
                                alt={work.Title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <span className="text-foreground italic text-2xl block">{work.Title}</span>
                            {work.Year && (
                                <span className="text-muted-foreground text-sm block mt-1">{work.Year}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 text-sm text-muted-foreground font-mono">
                            {work.Material && <p>{work.Material}</p>}
                            {sizeDisplay && <p>{sizeDisplay}</p>}
                            {work.Edition && <p>{work.Edition}</p>}
                            {work.Collection && <p>{work.Collection}</p>}
                        </div>

                        {work.work_price && (
                            <p className="text-xl font-light tracking-tighter">
                                ${work.work_price} USD
                            </p>
                        )}
                    </div>
                </div>

                {/* Right — form */}
                <div className="flex flex-col justify-start px-6 md:px-16 pt-12 pb-16 border-t md:border-t-0 md:border-l border-foreground/10">
                    <InquireForm
                        workTitle={work.Title}
                        workId={work.id}
                        workImageUrl={primaryImage}
                        workYear={work.Year}
                        workMaterial={work.Material}
                        workSize={sizeDisplay}
                    />
                </div>
            </div>
        </div>
    );
}
