"use client";

import { useLayoutContext, GenericInfo } from '@/context/LayoutContext';
import { useEffect } from 'react';

export default function GenericInfoUpdater({ data }: { data: GenericInfo }) {
    const { setGenericInfo } = useLayoutContext();

    useEffect(() => {
        setGenericInfo(data);
    }, [data, setGenericInfo]);

    return null;
}
