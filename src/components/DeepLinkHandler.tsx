"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DeepLinkHandler() {
    const pathname = usePathname();
    const router = useRouter();
    const hasAttemptedScroll = useRef(false);

    useEffect(() => {
        // Detect if there's a slug after the domain (e.g., /BNS_0009_V)
        const slug = pathname.substring(1);
        
        if (!slug || slug === '' || hasAttemptedScroll.current) return;

        // Give Next.js time to render the DOM if it's a cold load
        const scrollTimer = setTimeout(() => {
            const element = document.getElementById(slug);

            if (element) {
                console.log(`Deep-linking: Scrolling to ${slug}`);
                element.scrollIntoView({ behavior: 'smooth' });
                hasAttemptedScroll.current = true;
            } else {
                console.warn(`Deep-linking: Element with ID "${slug}" not found.`);
                // If the element doesn't exist (hidden/filtered or wrong URL), 
                // we might want to redirect, but only if it's not a known static path
                // For a one-page site, if it's on a dynamic root slug that doesn't exist, redirect to /
                if (pathname !== '/' && !pathname.includes('/about') && !pathname.includes('/portfolio-pdf')) {
                    router.push('/');
                }
            }
        }, 800); // Wait for works to render

        return () => clearTimeout(scrollTimer);
    }, [pathname, router]);

    return null; // This component handles side effects only
}
