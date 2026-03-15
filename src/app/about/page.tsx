import Image from 'next/image';
import GenericInfoUpdater from '@/components/GenericInfoUpdater';

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* <GenericInfoUpdater
                data={{
                    title: "About & Contact",
                    description: "Bastian Silvestre is a minimalist artist based in Mexico City, focusing on sculpture and the themes of decay and nostalgia."
                }}
            /> */}

            {/* Top Row: Photo & About/Contact */}
            <div className="flex flex-col md:flex-row gap-12">
                {/* Left: Photo (Less vertical) */}
                <div className="w-full md:w-1/2 aspect-[4/3] relative bg-background overflow-hidden">
                    <Image
                        src="/ABOUTHD.JPG"
                        alt="Bastian Silvestre Portrait"
                        fill
                        className="object-contain transition-all duration-700"
                        priority
                    />
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="space-y-8">
                        <h1 className="text-4xl font-light tracking-tighter">Bastian Silvestre (b. Habana, 1997)</h1>

                        <div className="space-y-6 text-body leading-relaxed max-w-lg">
                            <p>
                                Bastian Silvestre is a Cuban-American interdisciplinary artist. His work combines techniques of painting, sculpture, metalwork, and found-objects to form emotive, often brutalist three-dimensional assemblages which reference the natural world amidst textures of urban decay
                            </p>
                            <p>
                                His work has been exhibited by various galleries and institutions in Havana, New York and internationally, including at the Biennale de La Habana, Galleria Furiosa, MACO, Furiosa Jeddah HQ, and Istanbul Contemporary.
                            </p>
                            <p>
                                Bastian holds a BA in Studio Art from Wesleyan University, where his senior thesis received the Elizabeth Verveer Tishler Prize for most outstanding senior exhibition in Studio Art. He currently lives and works in Mexico City.
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-16 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">Contact</h2>
                            <div className="space-y-2">
                                <a
                                    href="mailto:hello@bastiansilvestre.com"
                                    className="block text-xl hover:text-foreground/60 transition-colors tracking-tight"
                                >
                                    bastian@studiosilvestre.com
                                </a>
                                <a
                                    href="https://www.instagram.com/bastian_silvestre/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 group text-xl hover:text-foreground/60 transition-colors tracking-tight"
                                >
                                    <svg
                                        className="w-5 h-5 fill-current opacity-60 group-hover:opacity-100 transition-opacity"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Statement */}
            <div className="w-full space-y-8">
                <h1 className="text-2xl font-light tracking-tighter uppercase">Statement</h1>
                <div className="space-y-6 text-body leading-relaxed md:w-1/2">
                    <p>
                        My work emphasizes the multiple ways in which everyday artifacts are displaced, circulated and increasingly intermingled.</p>
                    <p>
                        By tending to their decay, the work wields nostalgia for worlds lost, and presents an alternative to development focused on excavating the beauty of forgotten materials. </p>

                </div>
            </div>
        </div>
    );
}
