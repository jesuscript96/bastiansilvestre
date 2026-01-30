"use client";

import { useLayoutContext, WorkDetail } from '@/context/LayoutContext';
import { useEffect } from 'react';

export default function WorkDetailClient({ data }: { data: WorkDetail }) {
    const { setWorkDetail } = useLayoutContext();

    useEffect(() => {
        setWorkDetail(data);

        // Cleanup on unmount
        return () => setWorkDetail(null);
    }, [data, setWorkDetail]);

    return null; // This component renders nothing
}
