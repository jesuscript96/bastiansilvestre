"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutContext } from '@/context/LayoutContext';
import { Category, BodyOfWork } from '@/lib/supabase';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
    categories: Category[];
    bodyOfWorks: BodyOfWork[];
}

export default function Sidebar({ categories, bodyOfWorks }: SidebarProps) {
    const { workDetail, genericInfo, sidebarMode } = useLayoutContext();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const getBodyOfWorksForCategory = (catId: string) => {
        return bodyOfWorks.filter(s => s.Category && s.Category.includes(catId));
    };

    return (
        <>
            <button
                className="md:hidden fixed top-6 right-6 z-50 text-accent hover:text-foreground transition-colors mix-blend-difference print:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                )}
            </button>

            <aside className={`
        fixed inset-y-0 left-0 z-40 w-full md:w-80 bg-background flex flex-col justify-between px-6 pb-8 md:px-12 transition-transform duration-300 pt-24 md:pt-32
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-full print:hidden
      `}>
                {/* Top: Navigation */}
                <div className="space-y-12">

                    <nav className="space-y-4">
                        <div className="text-sm uppercase tracking-widest text-muted mb-4 select-none">
                            Bodies of Work
                        </div>
                        <ul className="space-y-2">
                            {bodyOfWorks.map(s => {
                                const href = `/#${s.Slug}`;
                                const isActive = typeof window !== 'undefined' && window.location.hash === `#${s.Slug}`;
                                return (
                                    <li key={s.id}>
                                        <Link
                                            href={href}
                                            onClick={() => setIsOpen(false)}
                                            className={`block text-xs uppercase tracking-widest transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-accent'}`}
                                        >
                                            {s.Name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    <nav className="space-y-4">
                        <Link href="/showroom" onClick={() => setIsOpen(false)} className={`block text-sm uppercase hover:text-foreground/60 tracking-widest ${pathname === '/showroom' ? 'text-foreground' : 'text-muted-foreground'}`}>Showroom</Link>
                        <Link href="/about" onClick={() => setIsOpen(false)} className={`block text-sm uppercase hover:text-foreground/60 tracking-widest ${pathname === '/about' ? 'text-foreground' : 'text-muted-foreground'}`}>About</Link>
                    </nav>

                    {/* Mobile theme toggle */}
                    <div className="md:hidden">
                        <ThemeToggle />
                    </div>
                </div>

                <div className="mt-auto pt-12 text-xs leading-relaxed text-muted font-mono min-h-[180px] hidden md:block border-t border-border">
                    {sidebarMode === 'work' && workDetail ? (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <span className="text-muted-foreground italic block text-base leading-tight">
                                    {workDetail.title}{workDetail.year ? `, ${workDetail.year}` : ''}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 text-muted text-[11px] tracking-wider">
                                {workDetail.material && <p>{workDetail.material}</p>}
                                {workDetail.size && <p>{workDetail.size}</p>}
                                {workDetail.edition && <p>{workDetail.edition}</p>}
                                {workDetail.collection && <p>{workDetail.collection}</p>}
                            </div>
                        </div>
                    ) : genericInfo && (
                        <div className="space-y-4 animate-fade-in">
                            <h4 className="text-foreground uppercase tracking-wider">{genericInfo.title}</h4>
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
