'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getAllPrivateKeys,
    createPrivateKey,
    updatePrivateKey,
    deletePrivateKey,
    setWorksForKey,
    getWorkIdsForKey,
    getKeyWorkCounts,
    getAllWorksForAdmin,
    PrivateKey,
    AdminWork,
} from '@/lib/private-showroom';
import { getAllWorksForAdminServer, verifyAdminKey } from '@/lib/private-showroom-server';

function generateKey(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function ShowroomAdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [adminInput, setAdminInput] = useState('');
    const [adminError, setAdminError] = useState('');

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdminError('');
        const isValid = await verifyAdminKey(adminInput);
        if (isValid) {
            setAuthenticated(true);
        } else {
            setAdminError('Invalid admin key or admin key not configured on server.');
        }
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-xs space-y-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center">
                        Showroom Admin
                    </p>
                    <form onSubmit={handleAdminLogin} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={adminInput}
                                onChange={e => setAdminInput(e.target.value)}
                                placeholder="Admin key"
                                autoFocus
                                autoComplete="off"
                                className="w-full border-b border-border bg-transparent text-foreground placeholder:text-muted-foreground text-sm py-3 focus:outline-none focus:border-foreground transition-colors font-mono"
                            />
                            {adminError && (
                                <p className="mt-2 text-[10px] font-mono text-red-500 leading-relaxed">
                                    {adminError}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={!adminInput.trim()}
                            className="w-full border border-foreground/30 text-foreground text-[10px] font-mono uppercase tracking-[0.3em] py-3 hover:border-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Enter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <AdminPanel />;
}

function AdminPanel() {
    const [keys, setKeys] = useState<PrivateKey[]>([]);
    const [workCounts, setWorkCounts] = useState<Record<string, number>>({});
    const [allWorks, setAllWorks] = useState<AdminWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<PrivateKey | null>(null);
    const [formName, setFormName] = useState('');
    const [formKey, setFormKey] = useState('');
    const [selectedWorkIds, setSelectedWorkIds] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);
    const [workSearch, setWorkSearch] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        const [fetchedKeys, fetchedWorks] = await Promise.all([
            getAllPrivateKeys(),
            getAllWorksForAdminServer(),
        ]);

        setKeys(fetchedKeys);
        setAllWorks(fetchedWorks);
        const counts = await getKeyWorkCounts(fetchedKeys.map(k => k.id));
        setWorkCounts(counts);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const openCreate = () => {
        setEditingKey(null);
        setFormName('');
        setFormKey(generateKey());
        setSelectedWorkIds(new Set());
        setWorkSearch('');
        setModalOpen(true);
    };

    const openEdit = async (k: PrivateKey) => {
        setEditingKey(k);
        setFormName(k.name);
        setFormKey(k.key);
        setWorkSearch('');
        const ids = await getWorkIdsForKey(k.id);
        setSelectedWorkIds(new Set(ids));
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!formKey.trim() || !formName.trim()) return;
        setSaving(true);
        try {
            if (editingKey) {
                await updatePrivateKey(editingKey.id, formKey.trim(), formName.trim());
                await setWorksForKey(editingKey.id, [...selectedWorkIds]);
            } else {
                const created = await createPrivateKey(formKey.trim(), formName.trim());
                if (created) await setWorksForKey(created.id, [...selectedWorkIds]);
            }
            setModalOpen(false);
            await load();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (k: PrivateKey) => {
        if (!confirm(`Delete key "${k.name}"? This cannot be undone.`)) return;
        await deletePrivateKey(k.id);
        await load();
    };

    const toggleWork = (id: string) => {
        setSelectedWorkIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const copyKey = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
    };

    const filteredWorks = allWorks.filter(w => {
        if (!workSearch) return true;
        const q = workSearch.toLowerCase();
        return (
            w.Title.toLowerCase().includes(q) ||
            (w.Name_Body_from_body || '').toLowerCase().includes(q)
        );
    });

    return (
        <div className="py-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Private Showrooms
                </h1>
                <button
                    onClick={openCreate}
                    className="border border-foreground/30 text-foreground text-[10px] font-mono uppercase tracking-[0.3em] px-4 py-2 hover:border-foreground hover:bg-foreground hover:text-background transition-all"
                >
                    + New Key
                </button>
            </div>

            {loading ? (
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse">
                    Loading...
                </p>
            ) : keys.length === 0 ? (
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    No keys yet. Create one to get started.
                </p>
            ) : (
                <div className="border border-border overflow-hidden">
                    <table className="w-full text-xs font-mono">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-muted-foreground uppercase tracking-widest font-normal text-[10px]">Name</th>
                                <th className="text-left py-3 px-4 text-muted-foreground uppercase tracking-widest font-normal text-[10px]">Key</th>
                                <th className="text-left py-3 px-4 text-muted-foreground uppercase tracking-widest font-normal text-[10px]">Works</th>
                                <th className="text-left py-3 px-4 text-muted-foreground uppercase tracking-widest font-normal text-[10px]">Created</th>
                                <th className="py-3 px-4" />
                            </tr>
                        </thead>
                        <tbody>
                            {keys.map(k => (
                                <tr key={k.id} className="border-b border-border last:border-0 hover:bg-border/30 transition-colors">
                                    <td className="py-3 px-4 text-foreground">{k.name}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => copyKey(k.key)}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                            title="Copy key"
                                        >
                                            {copied === k.key ? 'Copied!' : k.key}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">{workCounts[k.id] || 0}</td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                        {new Date(k.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-4 justify-end">
                                            <button
                                                onClick={() => openEdit(k)}
                                                className="text-muted-foreground hover:text-foreground transition-colors uppercase text-[10px] tracking-widest"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(k)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors uppercase text-[10px] tracking-widest"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="bg-background border border-border w-full max-w-2xl max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                {editingKey ? 'Edit Key' : 'New Key'}
                            </p>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors text-sm leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 min-h-0">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    placeholder="e.g. John Smith — April 2026"
                                    className="w-full border-b border-border bg-transparent text-foreground placeholder:text-muted-foreground text-sm py-2 focus:outline-none focus:border-foreground transition-colors"
                                />
                            </div>

                            {/* Key */}
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">
                                    Access Key
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={formKey}
                                        onChange={e => setFormKey(e.target.value)}
                                        className="flex-1 border-b border-border bg-transparent text-foreground text-sm py-2 focus:outline-none focus:border-foreground transition-colors font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormKey(generateKey())}
                                        className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {/* Work selection */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                        Works
                                        {selectedWorkIds.size > 0 && (
                                            <span className="ml-2 text-foreground">{selectedWorkIds.size} selected</span>
                                        )}
                                    </label>
                                    {selectedWorkIds.size > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedWorkIds(new Set())}
                                            className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={workSearch}
                                    onChange={e => setWorkSearch(e.target.value)}
                                    placeholder="Search works..."
                                    className="w-full border-b border-border bg-transparent text-foreground placeholder:text-muted-foreground text-xs py-2 focus:outline-none focus:border-foreground transition-colors font-mono"
                                />

                                <div className="border border-border overflow-hidden">
                                    <div className="max-h-72 overflow-y-auto">
                                        {filteredWorks.length === 0 ? (
                                            <p className="px-4 py-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                                No results.
                                            </p>
                                        ) : filteredWorks.map(work => (
                                            <label
                                                key={work.id}
                                                className="flex items-center gap-3 px-4 py-2 border-b border-border last:border-0 hover:bg-border/30 cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedWorkIds.has(work.id)}
                                                    onChange={() => toggleWork(work.id)}
                                                    className="shrink-0 accent-foreground"
                                                />
                                                {work.Primary_Image ? (
                                                    <img
                                                        src={work.Primary_Image}
                                                        alt={work.Title}
                                                        className="w-9 h-9 object-cover shrink-0 bg-border"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 bg-border shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-foreground truncate">{work.Title}</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                                                        {[work.Name_Body_from_body, work.year].filter(Boolean).join(' · ')}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-border flex justify-end gap-6 shrink-0">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !formKey.trim() || !formName.trim()}
                                className="border border-foreground/30 text-foreground text-[10px] font-mono uppercase tracking-[0.3em] px-6 py-2 hover:border-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
