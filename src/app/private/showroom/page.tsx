'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWorksForKey } from '@/lib/private-showroom';
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
            getWorksForKey(keyId),
            getBodyOfWorks(),
        ]).then(([fetchedWorks, fetchedBOWs]) => {
            setWorks(fetchedWorks);
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
