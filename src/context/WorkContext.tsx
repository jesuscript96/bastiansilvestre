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
}

interface WorkContextType {
    workDetail: WorkDetail | null;
    setWorkDetail: (detail: WorkDetail | null) => void;
}

const WorkContext = createContext<WorkContextType | undefined>(undefined);

export const WorkProvider = ({ children }: { children: ReactNode }) => {
    const [workDetail, setWorkDetail] = useState<WorkDetail | null>(null);

    return (
        <WorkContext.Provider value={{ workDetail, setWorkDetail }}>
            {children}
        </WorkContext.Provider>
    );
};

export const useWorkContext = () => {
    const context = useContext(WorkContext);
    if (context === undefined) {
        throw new Error('useWorkContext must be used within a WorkProvider');
    }
    return context;
};
