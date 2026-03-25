'use client';
import { useState, useMemo } from 'react';
import type { Work } from '@/lib/supabase';

export default function PortfolioGenerator({ initialWorks }: { initialWorks: Work[] }) {
    const [selectedYear, setSelectedYear] = useState<string>('All');
    const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedSeries, setSelectedSeries] = useState<string>('All');
    const [selectedBodyOfWork, setSelectedBodyOfWork] = useState<string>('All');
    const [selectedCollection, setSelectedCollection] = useState<string>('All');

    const years = useMemo(() => ['All', ...Array.from(new Set(initialWorks.map(w => w.Year || 'Unknown').filter(Boolean))).sort().reverse()], [initialWorks]);
    const materials = useMemo(() => ['All', ...Array.from(new Set(initialWorks.map(w => w.Material || 'Unknown').filter(Boolean))).sort()], [initialWorks]);
    const statuses = useMemo(() => ['All', ...Array.from(new Set(initialWorks.map(w => w.Status || 'Unknown').filter(Boolean))).sort()], [initialWorks]);
    const series = useMemo(() => ['All', ...Array.from(new Set(initialWorks.map(w => w.Series_Name || w.BodyOfWork_Name || 'Unknown').filter(Boolean))).sort()], [initialWorks]);
    const collections = useMemo(() => ['All', ...Array.from(new Set(initialWorks.map(w => w.Collection || 'Unknown').filter(Boolean))).sort()], [initialWorks]);

    const bodyOfWorksList = useMemo(() => {
        const allBows = initialWorks.flatMap(w => w.BodyOfWork || []);
        return ['All', ...Array.from(new Set(allBows.filter(Boolean))).sort()];
    }, [initialWorks]);

    const filteredWorks = useMemo(() => {
        return initialWorks.filter(work => {
            const matchYear = selectedYear === 'All' || (work.Year || 'Unknown') === selectedYear;
            const matchMaterial = selectedMaterial === 'All' || (work.Material || 'Unknown') === selectedMaterial;
            const matchStatus = selectedStatus === 'All' || (work.Status || 'Unknown') === selectedStatus;
            const workSeries = work.Series_Name || work.BodyOfWork_Name || 'Unknown';
            const matchSeries = selectedSeries === 'All' || workSeries === selectedSeries;
            const matchCollection = selectedCollection === 'All' || (work.Collection || 'Unknown') === selectedCollection;
            const matchBodyOfWork = selectedBodyOfWork === 'All' || (work.BodyOfWork && work.BodyOfWork.includes(selectedBodyOfWork));
            return matchYear && matchMaterial && matchStatus && matchSeries && matchCollection && matchBodyOfWork;
        });
    }, [initialWorks, selectedYear, selectedMaterial, selectedStatus, selectedSeries, selectedCollection, selectedBodyOfWork]);

    // Build a standalone HTML document exactly like pdftemplate.html, with real data
    const generatePDF = () => {
        const worksHtml = filteredWorks.map(work => {
            const primaryImg = work.Primary_Image || work.Detail_Image || work.Detail_Image_2 || '';
            const details: string[] = [];
            if (work.Primary_Image) {
                if (work.Detail_Image) details.push(work.Detail_Image);
                if (work.Detail_Image_2) details.push(work.Detail_Image_2);
            } else if (work.Detail_Image) {
                if (work.Detail_Image_2) details.push(work.Detail_Image_2);
            }

            const material = work.Material ? work.Material.replace(/,([^ ])/g, ', $1') : '';

            const detailsGrid = details.length > 0 ? `
                <div class="details-grid">
                    ${details.map(src => `<img src="${src}" alt="Detalle" class="detail-img">`).join('')}
                </div>` : '';

            return `
            <section class="work-section">
                ${primaryImg ? `<div class="primary-image-wrap"><img src="${primaryImg}" alt="${work.Title || ''}" class="primary-img"></div>` : ''}
                ${detailsGrid}
                <div class="work-info">
                    <p>${work.Title || ''}${(work.Title && work.Year) ? ', ' : ''}${work.Year || ''}</p>
                    ${material ? `<p>${material}</p>` : ''}
                    ${work.Size ? `<p>${work.Size}</p>` : ''}
                    ${work.Edition ? `<p>${work.Edition}</p>` : ''}
                    ${work.Status ? `<p>${work.Status}</p>` : ''}
                </div>
            </section>`;
        }).join('\n');

        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bastian Silvestre - Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'EB Garamond', serif;
            background-color: #ffffff;
            color: #1a1a1a;
            -webkit-font-smoothing: antialiased;
        }

        /* COVER */
        .cover {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 64px;
        }
        .cover-header {
            text-align: center;
            font-size: 14px;
            letter-spacing: 0.05em;
        }
        .cover-center {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .cover-center h1 {
            font-size: 32px;
            font-weight: 500;
            margin-bottom: 16px;
            border-bottom: 1px solid #9ca3af;
            padding-bottom: 8px;
            display: inline-block;
        }
        .cover-center p {
            font-size: 18px;
            color: #4b5563;
        }

        /* WORKS */
        .works-container {
            max-width: 896px;
            margin: 0 auto;
            padding: 0 48px;
        }
        .work-section {
            padding: 48px 0 40px 0;
        }
        .primary-image-wrap {
            margin-bottom: 24px;
            text-align: center;
        }
        .primary-img {
            width: 100%;
            max-height: 500px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }
        .detail-img {
            width: 100%;
            max-height: 250px;
            object-fit: contain;
        }
        .work-info {
            text-align: left;
            font-size: 17px;
            line-height: 1.6;
        }

        /* PRINT — each work on its own page, nothing gets cut */
        @media print {
            @page { margin: 12mm 15mm; }

            .cover { min-height: 100vh; }
            .cover-page-break {
                page-break-after: always;
                break-after: page;
            }

            .work-section {
                page-break-before: always;
                break-before: page;
                page-break-inside: avoid;
                break-inside: avoid;
                padding-top: 32px;
            }
            /* First work needs no extra break since cover already breaks */
            .work-section:first-child {
                page-break-before: auto;
                break-before: auto;
            }

            .work-info {
                page-break-inside: avoid;
                break-inside: avoid;
            }

            .primary-img {
                max-height: 480px;
            }
            .detail-img {
                max-height: 230px;
            }

            .no-print { display: none !important; }
        }
    </style>
</head>
<body>

    <!-- COVER -->
    <section class="cover cover-page-break">
        <header class="cover-header">
            <p>www.bastiansilvestre.com &nbsp;&nbsp; bastian@studiosilvestre.com &nbsp;&nbsp; • &nbsp;&nbsp; +1 917-510-6253 &nbsp;&nbsp; • &nbsp;&nbsp; CDMX</p>
        </header>
        <div class="cover-center">
            <h1>Bastian Silvestre</h1>
            <p>Arte disponible CDMX</p>
        </div>
    </section>

    <main class="works-container">
        ${worksHtml}
    </main>

</body>
</html>`;

        // Open in a clean new window and trigger print
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Por favor permite ventanas emergentes para generar el PDF.');
            return;
        }
        printWindow.document.write(html);
        printWindow.document.close();

        // Wait for fonts and images to load, then print
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
            }, 1000);
        };
    };

    return (
        <div style={{ fontFamily: "'EB Garamond', serif", backgroundColor: '#fff', color: '#1a1a1a', minHeight: '100vh', width: '100%', position: 'absolute', inset: 0, zIndex: 100, overflowY: 'auto' }}>

            {/* Filter Bar */}
            <div style={{ backgroundColor: '#f4f4f5', padding: '24px', borderBottom: '1px solid #d4d4d8', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', justifyContent: 'space-between', fontFamily: 'system-ui, sans-serif' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
                        <FilterSelect label="Body Of Work" value={selectedBodyOfWork} options={bodyOfWorksList} onChange={setSelectedBodyOfWork} />
                        <FilterSelect label="Series" value={selectedSeries} options={series} onChange={setSelectedSeries} />
                        <FilterSelect label="Year" value={selectedYear} options={years} onChange={setSelectedYear} />
                        <FilterSelect label="Material" value={selectedMaterial} options={materials} onChange={setSelectedMaterial} />
                        <FilterSelect label="Collection" value={selectedCollection} options={collections} onChange={setSelectedCollection} />
                        <FilterSelect label="Status" value={selectedStatus} options={statuses} onChange={setSelectedStatus} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexShrink: 0 }}>
                        <span style={{ fontSize: '14px', color: '#71717a', whiteSpace: 'nowrap' }}>
                            {filteredWorks.length} de {initialWorks.length} obras
                        </span>
                        <button
                            onClick={generatePDF}
                            style={{ backgroundColor: '#18181b', color: '#fff', padding: '8px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, height: '38px', minWidth: '160px' }}
                        >
                            Generar PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div style={{ maxWidth: '896px', margin: '0 auto', padding: '64px 48px' }}>
                <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '32px', fontFamily: 'system-ui, sans-serif' }}>
                    Vista previa — Pulsa &quot;Generar PDF&quot; para abrir el documento listo para guardar.
                </p>
                {filteredWorks.map(work => {
                    const img = work.Primary_Image || work.Detail_Image || work.Detail_Image_2 || '';
                    return (
                        <div key={work.id} style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #e5e7eb' }}>
                            {img && <img src={img} alt={work.Title || ''} style={{ width: '100%', height: 'auto', objectFit: 'contain', marginBottom: '16px', backgroundColor: '#f9fafb' }} />}
                            <p style={{ fontSize: '18px', lineHeight: 1.625 }}>
                                {work.Title}{(work.Title && work.Year) ? ', ' : ''}{work.Year}
                            </p>
                            {work.Material && <p style={{ fontSize: '18px', lineHeight: 1.625 }}>{work.Material.replace(/,([^ ])/g, ', $1')}</p>}
                            {work.Size && <p style={{ fontSize: '18px', lineHeight: 1.625 }}>{work.Size}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '128px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#3f3f46' }}>{label}</label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{ padding: '6px 8px', backgroundColor: '#fff', border: '1px solid #d4d4d8', borderRadius: '4px', fontSize: '13px', color: '#18181b', outline: 'none' }}
            >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}
