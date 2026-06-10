'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use service role key to bypass RLS for private showroom
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function getWorksForKeyServer(keyId: string) {
    const { data: keyWorks } = await supabaseAdmin
        .from('private_showroom_key_works')
        .select('work_id')
        .eq('key_id', keyId);

    if (!keyWorks || keyWorks.length === 0) return [];

    const workIds = keyWorks.map((kw: { work_id: string }) => kw.work_id);
    const { data: works } = await supabaseAdmin
        .from('Works')
        .select('*')
        .in('id', workIds)
        .order('SortNumber', { ascending: true });

    return works || [];
}

export async function getAllWorksForAdminServer() {
    const { data } = await supabaseAdmin
        .from('Works')
        .select('*')
        .order('SortNumber', { ascending: true });
    return data || [];
}

export async function verifyAdminKey(inputKey: string): Promise<boolean> {
    const adminKey = process.env.SHOWROOM_ADMIN_KEY || process.env.NEXT_PUBLIC_SHOWROOM_ADMIN_KEY || '';
    if (!adminKey) return false;

    // Remove any surrounding quotes that might have been added in env files
    const cleanAdminKey = adminKey.replace(/^["']|["']$/g, '');
    const cleanInputKey = inputKey.replace(/^["']|["']$/g, '');

    return cleanInputKey === cleanAdminKey;
}

