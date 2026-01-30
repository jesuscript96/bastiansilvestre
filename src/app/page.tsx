import { getFeaturedWorks, Work } from '@/lib/airtable';
import Image from 'next/image';
import GenericInfoUpdater from '@/components/GenericInfoUpdater';

export const revalidate = 600; // ISR 10 minutes

export default async function Home() {
  let works: Work[] = [];
  try {
    works = await getFeaturedWorks();
  } catch (error) {
    console.error("Failed to fetch featured works:", error);
  }

  return (
    <div className="space-y-12">
      <GenericInfoUpdater
        data={{
          title: "Featured Works",
          description: "Selected projects demonstrating minimal aesthetics and technical precision."
        }}
      />
      <h1 className="text-4xl font-light tracking-tighter uppercase mb-12">Featured Works</h1>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {works.map((work) => (
          <div key={work.id} className="break-inside-avoid relative bg-neutral-900 overflow-hidden group">
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
          </div>
        ))}
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
