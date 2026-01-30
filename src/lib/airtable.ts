import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || ''
);

const TABLE_IDS = {
    CATEGORIES: 'tblDX1ItN2REkeLLf',
    SERIES: 'tbljnJFwgOc2X0Dg4',
    WORKS: 'tblQyfUdWKtZOS9qA',
};

export interface Category {
    id: string;
    Name: string;
    Slug: string;
    Series?: string[];
}

export interface Series {
    id: string;
    Name: string;
    Slug: string;
    Description?: string;
    Category?: string[];
}

export interface Work {
    id: string;
    Title: string;
    Series_Name?: string[];
    Year?: string;
    Material?: string;
    Size?: string;
    Collection?: string;
    Status?: string;
    Primary_Image?: string;
    Detail_Image?: string;
    Feature?: boolean;
    Series?: string[];
    Edition?: string;
}

const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapCategory = (record: any): Category => ({
    id: record.id,
    Name: record.fields.Name || 'Untitled',
    Slug: record.fields.Slug || slugify(record.fields.Name || ''),
    Series: record.fields.SERIES,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapSeries = (record: any): Series => ({
    id: record.id,
    Name: record.fields.Name_Series || record.fields.Name || 'Untitled Series',
    Slug: record.fields.Slug || slugify(record.fields.Name_Series || record.fields.Name || ''),
    Description: record.fields.Description_Series || record.fields.Description,
    Category: record.fields.Category,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapWork = (record: any): Work => ({
    id: record.id,
    Title: record.fields.Title || 'Untitled',
    Series_Name: record.fields['Name_Series (from Series)'] ? (Array.isArray(record.fields['Name_Series (from Series)']) ? record.fields['Name_Series (from Series)'][0] : record.fields['Name_Series (from Series)']) : '',
    Year: record.fields.year,
    Material: record.fields.material,
    Size: record.fields.Size,
    Collection: record.fields.collection,
    Status: record.fields.Estado,
    Primary_Image: record.fields.Primary_Image,
    Detail_Image: record.fields.Detail_Image,
    Feature: record.fields.Feature,
    Series: record.fields.Series,
    Edition: record.fields.Edition,
});

export const getCategories = async () => {
    const records = await base(TABLE_IDS.CATEGORIES).select({
        view: 'Grid view',
    }).all();
    return records.map(mapCategory);
};

export const getSeries = async () => {
    const records = await base(TABLE_IDS.SERIES).select({
        view: 'Grid view',
    }).all();
    return records.map(mapSeries);
};

export const getFeaturedWorks = async () => {
    const records = await base(TABLE_IDS.WORKS).select({
        filterByFormula: '{Feature} = 1',
    }).all();
    return records.map(mapWork);
};

export const getSeriesWorks = async (seriesName: string) => {
    // Query WORKS where 'Series' link matches the name
    const records = await base(TABLE_IDS.WORKS).select({
        filterByFormula: `{Series} = '${seriesName}'`,
    }).all();
    return records.map(mapWork);
};

export const getCategoryBySlug = async (slug: string) => {
    const records = await base(TABLE_IDS.CATEGORIES).select({
        filterByFormula: `{Slug} = '${slug}'`,
        maxRecords: 1,
    }).all();
    if (records.length === 0) return null;
    return mapCategory(records[0]);
};

export const getSeriesBySlug = async (slug: string) => {
    const allSeries = await getSeries();
    return allSeries.find(s => s.Slug === slug) || null;
};

export const getSeriesByCategory = async (categoryName: string) => {
    // Query SERIES where 'Category' link matches the name
    const records = await base(TABLE_IDS.SERIES).select({
        filterByFormula: `{Category} = '${categoryName}'`,
    }).all();
    return records.map(mapSeries);
};

export const getWorkById = async (id: string) => {
    const record = await base(TABLE_IDS.WORKS).find(id);
    return mapWork(record);
};

export const getWorkBySlug = async () => {
    return null;
};
