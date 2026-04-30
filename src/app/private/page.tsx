'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validatePrivateKey } from '@/lib/private-showroom';

export default function PrivatePage() {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!key.trim()) return;

        setLoading(true);
        setError('');

        try {
            const privateKey = await validatePrivateKey(key.trim());
            if (privateKey) {
                sessionStorage.setItem('private_key_id', privateKey.id);
                sessionStorage.setItem('private_key_name', privateKey.name);
                router.push('/private/showroom');
            } else {
                setError('Invalid access key.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-xs space-y-10">
                <div className="text-center space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Private Showroom
                    </p>
                    <h1 className="text-lg tracking-tight text-foreground">
                        Bastian Silvestre
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={key}
                            onChange={e => setKey(e.target.value)}
                            placeholder="Access key"
                            autoFocus
                            autoComplete="off"
                            className="w-full border-b border-border bg-transparent text-foreground placeholder:text-muted-foreground text-sm py-3 focus:outline-none focus:border-foreground transition-colors font-mono"
                        />
                        {error && (
                            <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-red-500">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !key.trim()}
                        className="w-full border border-foreground/30 text-foreground text-[10px] font-mono uppercase tracking-[0.3em] py-3 hover:border-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Enter'}
                    </button>
                </form>
            </div>
        </div>
    );
}
