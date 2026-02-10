import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || ''
);

const TABLE_IDS = {
    CATEGORIES: 'tblDX1ItN2REkeLLf',
    BODY_OF_WORKS: 'tbljnJFwgOc2X0Dg4',
    WORKS: 'tblQyfUdWKtZOS9qA',
};

export interface Category {
    id: string;
    Name: string;
    Slug: string;
    BodyOfWorks?: string[];
}

export interface BodyOfWork {
    id: string;
    Name: string;
    Slug: string;
    Description?: string;
    Category?: string[];
    isSerie: boolean;
}

export interface Work {
    id: string;
    Title: string;
    BodyOfWork_Name?: string;
    Year?: string;
    Material?: string;
    Size?: string;
    Collection?: string;
    Status?: string;
    Primary_Image?: string;
    Detail_Image?: string;
    Detail_Image_2?: string;
    Context_Image?: string;
    Feature?: boolean;
    BodyOfWork?: string[];
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
    BodyOfWorks: record.fields.BODY,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBodyOfWork = (record: any): BodyOfWork => ({
    id: record.id,
    Name: record.fields.Name_Series || record.fields.Name || 'Untitled Body of Work',
    Slug: record.fields.Slug || slugify(record.fields.Name_Series || record.fields.Name || ''),
    Description: record.fields.Description_Series || record.fields.Description,
    Category: record.fields.Category,
    isSerie: record.fields.IS_SERIE === true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapWork = (record: any): Work => ({
    id: record.id,
    Title: record.fields.Title || 'Untitled',
    BodyOfWork_Name: record.fields['Name_Body (from body)'] ? (Array.isArray(record.fields['Name_Body (from body)']) ? record.fields['Name_Body (from body)'][0] : record.fields['Name_Body (from body)']) : '',
    Year: record.fields.year,
    Material: record.fields.material,
    Size: record.fields.Size,
    Collection: record.fields.collection,
    Status: record.fields.Estado,
    Primary_Image: record.fields.Primary_Image,
    Detail_Image: record.fields.Detail_Image,
    Detail_Image_2: record.fields.Detail_Image_2,
    Context_Image: record.fields.Context_Image,
    Feature: record.fields.Feature,
    BodyOfWork: record.fields.BODY,
    Edition: record.fields.Edition,
});

export const getCategories = async () => {
    const records = await base(TABLE_IDS.CATEGORIES).select({
        view: 'Grid view',
    }).all();
    return records.map(mapCategory);
};

export const getBodyOfWorks = async () => {
    const records = await base(TABLE_IDS.BODY_OF_WORKS).select({
        view: 'Grid view',
    }).all();
    return records.map(mapBodyOfWork);
};

export const getFeaturedWorks = async () => {
    const records = await base(TABLE_IDS.WORKS).select({
        filterByFormula: '{Feature} = 1',
    }).all();
    return records.map(mapWork);
};

export const getBodyOfWorkWorks = async (bodyOfWorkName: string) => {
    // Query WORKS where 'BODY' link matches the name
    const records = await base(TABLE_IDS.WORKS).select({
        filterByFormula: `{BODY} = '${bodyOfWorkName}'`,
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

export const getBodyOfWorkBySlug = async (slug: string) => {
    const allBodyOfWorks = await getBodyOfWorks();
    return allBodyOfWorks.find(s => s.Slug === slug) || null;
};

export const getBodyOfWorksByCategory = async (categoryName: string) => {
    // Query BODY_OF_WORKS where 'Category' link matches the name
    const records = await base(TABLE_IDS.BODY_OF_WORKS).select({
        filterByFormula: `{Category} = '${categoryName}'`,
    }).all();
    return records.map(mapBodyOfWork);
};

export const getWorkById = async (id: string) => {
    const record = await base(TABLE_IDS.WORKS).find(id);
    return mapWork(record);
};

export const getWorks = async () => {
    const records = await base(TABLE_IDS.WORKS).select({
        view: 'Grid view',
    }).all();
    return records.map(mapWork);
};

export const getWorkBySlug = async () => {
    return null;
};
