'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWorksForKeyServer } from '@/lib/private-showroom-server';
import { getBodyOfWorks, BodyOfWork } from '@/lib/supabase';

import { ShowroomWork } from '@/lib/showroom';
import PrivateShowroomView from '@/components/PrivateShowroomView';

export default function PrivateShowroomPage() {
    const router = useRouter();
    const [works, setWorks] = useState<ShowroomWork[]>([]);
    const [bodyOfWorks, setBodyOfWorks] = useState<BodyOfWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyName, setKeyName] = useState('');

    useEffect(() => {
        const keyId = sessionStorage.getItem('private_key_id');
        const name = sessionStorage.getItem('private_key_name');

        if (!keyId) {
            router.replace('/private');
            return;
        }

        setKeyName(name || '');

        Promise.all([
            getWorksForKeyServer(keyId),
            getBodyOfWorks(),
        ]).then(([fetchedWorks, fetchedBOWs]) => {
            // Map raw records to ShowroomWork structure if needed
            // The server action returns raw records, we need to map them
            const mappedWorks = fetchedWorks.map((record: any) => ({
                id: record.id,
                Title: record.Title || 'Untitled',
                BodyOfWork_Name: record.Name_Body_from_body || '',
                Year: record.year,
                Material: record.material,
                Size: record['Size cm'],
                Size_inches: record.Size_inches,
                Collection: record.collection,
                Status: record.Estado,
                Primary_Image: record.Primary_Image,
                Detail_Image: record.Detail_Image,
                Detail_Image_2: record.Detail_Image_2,
                Context_Image: record.Context_Image,
                Feature: record.Feature,
                BodyOfWork: record.BODY ? record.BODY.split(',').map((s: string) => s.trim()) : undefined,
                Edition: record.Edition,
                SortNumber: record.SortNumber,
                Series_Name: record.Series_Name,
                work_id: record.work_id,
                view_showroom: record.view_showroom,
                work_price: record.work_price,
                payment_link: record.payment_link,
            }));

            setWorks(mappedWorks);
            setBodyOfWorks(fetchedBOWs);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });

    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse">
                    Loading...
                </span>
            </div>
        );
    }

    return (
        <div className="md:pl-12">
            {keyName && (
                <div className="pt-6 pb-0 px-6 md:px-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Private Selection — {keyName}
                    </p>
                </div>
            )}
            <PrivateShowroomView works={works} bodyOfWorks={bodyOfWorks} />
        </div>
    );
}
