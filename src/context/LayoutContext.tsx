"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface WorkDetail {
    title: string;
    seriesName?: string;
    year?: string;
    material?: string;
    size?: string;
    collection?: string;
    status?: string;
    edition?: string;
}

export type SidebarMode = 'work' | 'generic';

export interface GenericInfo {
    title: string;
    description?: string;
    meta?: string[]; // Extra lines if needed
}

interface LayoutContextType {
    sidebarMode: SidebarMode;
    workDetail: WorkDetail | null;
    genericInfo: GenericInfo | null;
    setWorkDetail: (detail: WorkDetail | null) => void;
    setGenericInfo: (info: GenericInfo | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
    const [sidebarMode, setSidebarMode] = useState<SidebarMode>('generic');
    const [workDetail, setWorkDetailState] = useState<WorkDetail | null>(null);
    const [genericInfo, setGenericInfoState] = useState<GenericInfo | null>(null);

    const setWorkDetail = (detail: WorkDetail | null) => {
        setWorkDetailState(detail);
        if (detail) setSidebarMode('work');
    };

    const setGenericInfo = (info: GenericInfo | null) => {
        setGenericInfoState(info);
        if (info) setSidebarMode('generic');
    };

    return (
        <LayoutContext.Provider value={{ sidebarMode, workDetail, genericInfo, setWorkDetail, setGenericInfo }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayoutContext must be used within a LayoutProvider');
    }
    return context;
};
