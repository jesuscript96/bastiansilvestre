"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutContext } from '@/context/LayoutContext';
import { Category, Series } from '@/lib/airtable';

interface SidebarProps {
    categories: Category[];
    series: Series[];
}

export default function Sidebar({ categories, series }: SidebarProps) {
    const { workDetail, genericInfo, sidebarMode } = useLayoutContext();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const getSeriesForCategory = (catId: string) => {
        return series.filter(s => s.Category && s.Category.includes(catId));
    };

    return (
        <>
            <button
                className="md:hidden fixed top-6 right-6 z-50 text-white uppercase text-xs tracking-widest mix-blend-difference"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? 'Close' : 'Menu'}
            </button>

            <aside className={`
        fixed inset-y-0 left-0 z-40 w-full md:w-80 bg-black flex flex-col justify-between p-8 transition-transform duration-300 pt-28 md:pt-12
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-full
      `}>
                {/* Top: Navigation */}
                <div className="space-y-12">

                    <nav className="space-y-8">
                        {categories.map(cat => (
                            <div key={cat.id} className="space-y-3">
                                {/* Category Link */}
                                <Link
                                    href={`/${cat.Slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block uppercase text-xs font-bold tracking-widest text-white hover:text-white/60 transition-colors"
                                >
                                    {cat.Name}
                                </Link>

                                <ul className="space-y-2">
                                    {getSeriesForCategory(cat.id).map(s => {
                                        const href = `/${cat.Slug}/${s.Slug}`;
                                        const isActive = pathname?.startsWith(href);
                                        return (
                                            <li key={s.id}>
                                                <Link
                                                    href={href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`block text-xs uppercase tracking-wide transition-colors ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                >
                                                    {s.Name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    <nav className="space-y-4">
                        <Link href="/about" onClick={() => setIsOpen(false)} className="block text-sm uppercase hover:text-white/60 tracking-widest">About</Link>
                        {/* Contact removed */}
                    </nav>
                </div>

                <div className="mt-auto pt-12 text-xs leading-relaxed text-zinc-400 font-mono min-h-[150px] hidden md:block">
                    {sidebarMode === 'work' && workDetail && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <span className="text-white italic">{workDetail.title}</span>
                                {workDetail.year && <span className="text-white">, {workDetail.year}</span>}
                            </div>

                            <div className="flex flex-col gap-1 text-zinc-400">
                                {workDetail.material && <p>{workDetail.material}</p>}
                                {workDetail.size && <p>{workDetail.size}</p>}
                                {workDetail.edition && <p>{workDetail.edition}</p>}
                            </div>
                        </div>
                    )}

                    {sidebarMode === 'generic' && genericInfo && (
                        <div className="space-y-4 animate-fade-in">
                            <h4 className="text-white uppercase tracking-wider">{genericInfo.title}</h4>
                            {genericInfo.description && <p className="opacity-80 max-w-[90%]">{genericInfo.description}</p>}
                            {genericInfo.meta && (
                                <ul className="space-y-1 opacity-60">
                                    {genericInfo.meta.map((line, i) => <li key={i}>{line}</li>)}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
