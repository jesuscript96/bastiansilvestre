import { createClient } from '@supabase/supabase-js';
import { ShowroomWork } from './showroom';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface PrivateKey {
    id: string;
    key: string;
    name: string;
    created_at: string;
}

export interface AdminWork {
    id: string;
    Title: string;
    Primary_Image?: string;
    year?: string;
    Name_Body_from_body?: string;
    SortNumber?: number;
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

export const validatePrivateKey = async (key: string): Promise<PrivateKey | null> => {
    const { data } = await supabase
        .from('private_showroom_keys')
        .select('*')
        .eq('key', key)
        .single();
    return data || null;
};

export const getWorksForKey = async (keyId: string): Promise<ShowroomWork[]> => {
    const { data: keyWorks } = await supabase
        .from('private_showroom_key_works')
        .select('work_id')
        .eq('key_id', keyId);

    if (!keyWorks || keyWorks.length === 0) return [];

    const workIds = keyWorks.map((kw: { work_id: string }) => kw.work_id);
    const { data: works } = await supabase
        .from('Works')
        .select('*')
        .in('id', workIds)
        .order('SortNumber', { ascending: true });

    return (works || []).map(mapShowroomWork);
};

export const getAllPrivateKeys = async (): Promise<PrivateKey[]> => {
    const { data } = await supabase
        .from('private_showroom_keys')
        .select('*')
        .order('created_at', { ascending: false });
    return data || [];
};

export const createPrivateKey = async (key: string, name: string): Promise<PrivateKey | null> => {
    const { data } = await supabase
        .from('private_showroom_keys')
        .insert({ key, name })
        .select()
        .single();
    return data || null;
};

export const updatePrivateKey = async (id: string, key: string, name: string): Promise<void> => {
    await supabase
        .from('private_showroom_keys')
        .update({ key, name })
        .eq('id', id);
};

export const deletePrivateKey = async (id: string): Promise<void> => {
    await supabase.from('private_showroom_key_works').delete().eq('key_id', id);
    await supabase.from('private_showroom_keys').delete().eq('id', id);
};

export const setWorksForKey = async (keyId: string, workIds: string[]): Promise<void> => {
    await supabase.from('private_showroom_key_works').delete().eq('key_id', keyId);
    if (workIds.length > 0) {
        await supabase.from('private_showroom_key_works').insert(
            workIds.map(work_id => ({ key_id: keyId, work_id }))
        );
    }
};

export const getWorkIdsForKey = async (keyId: string): Promise<string[]> => {
    const { data } = await supabase
        .from('private_showroom_key_works')
        .select('work_id')
        .eq('key_id', keyId);
    return (data || []).map((kw: { work_id: string }) => kw.work_id);
};

export const getKeyWorkCounts = async (keyIds: string[]): Promise<Record<string, number>> => {
    if (keyIds.length === 0) return {};
    const { data } = await supabase
        .from('private_showroom_key_works')
        .select('key_id')
        .in('key_id', keyIds);

    const counts: Record<string, number> = {};
    (data || []).forEach((row: { key_id: string }) => {
        counts[row.key_id] = (counts[row.key_id] || 0) + 1;
    });
    return counts;
};

export const getAllWorksForAdmin = async (): Promise<AdminWork[]> => {
    const { data } = await supabase
        .from('Works')
        .select('id, Title, Primary_Image, year, Name_Body_from_body, SortNumber')
        .order('SortNumber', { ascending: true });
    return data || [];
};
