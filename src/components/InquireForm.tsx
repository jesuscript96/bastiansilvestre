"use client";

import { useState } from 'react';
import emailjs from '@emailjs/browser';

interface InquireFormProps {
    workTitle: string;
    workId: string;
    workImageUrl: string;
    workYear?: string;
    workMaterial?: string;
    workSize?: string;
}

export default function InquireForm({
    workTitle,
    workImageUrl,
    workYear,
    workMaterial,
    workSize,
}: InquireFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(
        `I am interested in receiving more information about "${workTitle}". Please let me know about availability and any further details.`
    );
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        const serviceId = 'service_88e02ym';
        const ownerTemplateId = 'template_b3rw0gg';
        const clientTemplateId = 'template_lnoaoaa';
        const publicKey = 'I6I07HGv4V2wck1tU';

        const templateParams = {
            from_name: name,
            from_email: email,
            message,
            work_title: workTitle,
            work_year: workYear || '',
            work_material: workMaterial || '',
            work_size: workSize || '',
            work_image: workImageUrl,
            reply_to: email,
        };

        try {
            await Promise.all([
                emailjs.send(serviceId, ownerTemplateId, templateParams, publicKey),
                emailjs.send(serviceId, clientTemplateId, templateParams, publicKey),
            ]);
            setStatus('success');
        } catch (err: any) {
            console.error('EmailJS error:', err);
            setErrorMessage(err?.text || err?.message || JSON.stringify(err) || 'Unknown error');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col gap-6">
                <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                        Inquiry sent
                    </span>
                    <h2 className="text-2xl font-light tracking-tight">Thank you, {name}.</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Your inquiry regarding <span className="italic text-foreground">{workTitle}</span> has
                    been received. A confirmation has been sent to {email}. We will be in touch shortly.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-md">
            <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                    Inquire
                </span>
                <h2 className="text-2xl font-light tracking-tight">{workTitle}</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '2rem' }}>
                <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        Name
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-transparent border-b border-foreground/25 focus:border-foreground/70 outline-none py-2.5 text-sm text-foreground transition-colors placeholder:text-foreground/30"
                        placeholder="Your name"
                    />
                </div>

                <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-foreground/25 focus:border-foreground/70 outline-none py-2.5 text-sm text-foreground transition-colors placeholder:text-foreground/30"
                        placeholder="your@email.com"
                    />
                </div>

                <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        Message
                    </label>
                    <textarea
                        required
                        rows={6}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full bg-foreground/[0.03] border border-foreground/15 focus:border-foreground/40 outline-none px-4 py-3.5 text-sm text-foreground/75 focus:text-foreground transition-colors resize-none leading-relaxed"
                    />
                </div>

                {status === 'error' && (
                    <p className="text-sm text-red-500 font-mono">
                        Error: {errorMessage || 'Unknown'}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="mt-2 px-8 py-3 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto self-start"
                >
                    {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
                </button>
            </form>
        </div>
    );
}
