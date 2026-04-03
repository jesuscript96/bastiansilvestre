import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface DbCategory {
    id: string;
    Name: string;
    Slug: string;
    Description?: string;
    BODY?: string;
    WORKS?: string;
}

export interface DbBodyOfWork {
    id: string;
    Name_Series: string;
    Category?: string;
    Description_Series?: string;
    Year?: string;
    WORKS?: string;
    IS_SERIE: boolean;
    SortNumber?: number;
}

export interface DbWork {
    id: string;
    Title: string;
    BODY?: string;
    Category?: string;
    Name_Body_from_body?: string;
    Primary_Image?: string;
    Detail_Image?: string;
    Detail_Image_2?: string;
    Context_Image?: string;
    material?: string;
    'Size cm'?: string;
    Size_inches?: string;
    year?: string;
    Estado?: string;
    collection?: string;
    Feature?: boolean;
    Edition?: string;
    SortNumber?: number;
    Series_Name?: string;
    view_web?: boolean;
}

// Maps to the structure expected by components originally from Airtable
export interface MappedCategory {
    id: string;
    Name: string;
    Slug: string;
    BodyOfWorks?: string[];
}

export interface MappedBodyOfWork {
    id: string;
    Name: string;
    Slug: string;
    Description?: string;
    Category?: string[];
    isSerie: boolean;
    SortNumber?: number;
}

export interface MappedWork {
    id: string;
    Title: string;
    BodyOfWork_Name?: string;
    Year?: string;
    Material?: string;
    Size?: string;
    Size_inches?: string;
    Collection?: string;
    Status?: string;
    Primary_Image?: string;
    Detail_Image?: string;
    Detail_Image_2?: string;
    Context_Image?: string;
    Feature?: boolean;
    BodyOfWork?: string[];
    Edition?: string;
    SortNumber?: number;
    Series_Name?: string;
}

const slugify = (text: string) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const mapCategory = (record: DbCategory): MappedCategory => ({
    id: record.id,
    Name: record.Name || 'Untitled',
    Slug: record.Slug || slugify(record.Name || ''),
    BodyOfWorks: record.BODY ? record.BODY.split(',').map(s => s.trim()) : undefined,
});

const mapBodyOfWork = (record: DbBodyOfWork): MappedBodyOfWork => ({
    id: record.id,
    Name: record.Name_Series || 'Untitled Body of Work',
    Slug: slugify(record.Name_Series || ''),
    Description: record.Description_Series,
    Category: record.Category ? record.Category.split(',').map(s => s.trim()) : undefined,
    isSerie: record.IS_SERIE,
    SortNumber: record.SortNumber,
});

const mapWork = (record: DbWork): MappedWork => ({
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
    BodyOfWork: record.BODY ? record.BODY.split(',').map(s => s.trim()) : undefined,
    Edition: record.Edition,
    SortNumber: record.SortNumber,
    Series_Name: record.Series_Name,
});

export const getCategories = async () => {
    const { data } = await supabase.from('Categories').select('*');
    return (data || []).map(mapCategory);
};

export const getBodyOfWorks = async () => {
    const { data } = await supabase.from('BodyOfWorks').select('*').order('SortNumber', { ascending: true });
    return (data || []).map(mapBodyOfWork);
};

export const getFeaturedWorks = async () => {
    const { data } = await supabase.from('Works').select('*').eq('Feature', true).or('view_web.eq.true,view_web.is.null').order('SortNumber', { ascending: true });
    return (data || []).map(mapWork);
};

export const getBodyOfWorkWorks = async (bodyOfWorkName: string) => {
    const { data } = await supabase.from('Works').select('*').ilike('BODY', `%${bodyOfWorkName}%`).or('view_web.eq.true,view_web.is.null').order('SortNumber', { ascending: true });
    return (data || []).map(mapWork);
};

export const getCategoryBySlug = async (slug: string) => {
    const { data } = await supabase.from('Categories').select('*').eq('Slug', slug).limit(1).single();
    if (!data) return null;
    return mapCategory(data);
};

export const getBodyOfWorkBySlug = async (slug: string) => {
    const allBodyOfWorks = await getBodyOfWorks();
    return allBodyOfWorks.find(s => s.Slug === slug) || null;
};

export const getBodyOfWorksByCategory = async (categoryName: string) => {
    const { data } = await supabase.from('BodyOfWorks').select('*').ilike('Category', `%${categoryName}%`);
    return (data || []).map(mapBodyOfWork);
};

export const getWorkById = async (id: string) => {
    const { data } = await supabase.from('Works').select('*').eq('id', id).or('view_web.eq.true,view_web.is.null').single();
    if (!data) return null;
    return mapWork(data);
};

export const getWorks = async () => {
    const { data } = await supabase.from('Works').select('*').or('view_web.eq.true,view_web.is.null').order('SortNumber', { ascending: true });
    return (data || []).map(mapWork);
};

export const getWorkBySlug = async () => {
    return null; // Left exactly as previous implementation
};

export type { MappedWork as Work, MappedBodyOfWork as BodyOfWork, MappedCategory as Category };
