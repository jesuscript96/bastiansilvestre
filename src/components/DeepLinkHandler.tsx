"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DeepLinkHandler() {
    const pathname = usePathname();
    const router = useRouter();
    const hasAttemptedScroll = useRef(false);

    useEffect(() => {
        // Detect if there's a slug after the domain (e.g., /BNS_0009_V)
        // Trim trailing slashes and common non-slug paths
        let slug = pathname.split('/').filter(Boolean).pop() || '';
        
        if (!slug || slug === '' || hasAttemptedScroll.current) return;
        if (pathname.includes('/about') || pathname.includes('/portfolio-pdf') || pathname.includes('/showroom')) return;

        console.log(`DeepLinkHandler: detected slug "${slug}"`);

        let attempts = 0;
        const maxAttempts = 10;
        
        const scrollAttempt = () => {
            const element = document.getElementById(slug);

            if (element) {
                console.log(`Deep-linking: Scrolling to ${slug}`);
                element.scrollIntoView({ behavior: 'smooth' });
                hasAttemptedScroll.current = true;
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(scrollAttempt, 300); // Retry every 300ms
            } else {
                console.warn(`Deep-linking: Element with ID "${slug}" not found after ${maxAttempts} attempts.`);
                if (pathname !== '/') {
                    // Redirect to home if slug is invalid
                    router.push('/');
                }
            }
        };

        // Initial delay to let the initial render finish
        const initialTimer = setTimeout(scrollAttempt, 500);

        return () => clearTimeout(initialTimer);
    }, [pathname, router]);

    return null; // This component handles side effects only
}
