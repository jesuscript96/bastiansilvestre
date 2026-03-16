import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('BodyOfWorks').select('*');
  console.log("BodyOfWorks:", data);
  const { data: data2 } = await supabase.from('Categories').select('*');
  console.log("Categories:", data2);
  const { data: data3 } = await supabase.from('Works').select('*').limit(2);
  console.log("Works:", data3);
}

test();
