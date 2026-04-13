import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface ShowroomWork {
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
    work_id?: string;
    view_showroom?: boolean;
    work_price?: string;
    payment_link?: string;
}

const mapShowroomWork = (record: any): ShowroomWork => ({
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
});

export const getShowroomWorks = async () => {
    const { data } = await supabase
        .from('Works')
        .select('*')
        .eq('view_showroom', true)
        .order('SortNumber', { ascending: true });
    
    return (data || []).map(mapShowroomWork);
};
