import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadCSV(filePath, tableName, mappingFn) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true // Strip BOM so the first column parses correctly
    });

    console.log(`Deleting existing records in ${tableName}...`);
    // Delete all existing records first to avoid duplicates
    await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const mappedRecords = records.map(mappingFn);

    console.log(`Inserting ${mappedRecords.length} records into ${tableName}...`);
    const { data, error } = await supabase.from(tableName).insert(mappedRecords).select();

    if (error) {
        console.error(`Error inserting into ${tableName}:`, error);
    } else {
        console.log(`Successfully inserted into ${tableName}`);
    }
}

async function run() {
    // 1. Categories
    await uploadCSV('./public/CATEGORIES-Grid view.csv', 'Categories', (r) => ({
        Name: r.Name || null,
        Slug: r.Slug || null,
        Description: r.Description || null,
        BODY: r.BODY || null,
        WORKS: r.WORKS || null,
    }));

    // 2. BodyOfWorks
    await uploadCSV('./public/BODY_OF_WORKS-Grid view.csv', 'BodyOfWorks', (r) => ({
        Name_Series: r.Name_Series || null,
        Category: r.Category || null,
        Description_Series: r.Description_Series || null,
        Year: r.Year || null,
        WORKS: r.WORKS || null,
        IS_SERIE: r.IS_SERIE === 'checked' || r.IS_SERIE === 'true'
    }));

    // 3. Works
    await uploadCSV('./public/WORKS-Grid view.csv', 'Works', (r) => ({
        Title: r.Title || null,
        BODY: r.BODY || null,
        Category: r.Category || null,
        Name_Body_from_body: r['Name_Body (from body)'] || null,
        Primary_Image: r.Primary_Image || null,
        Detail_Image: r.Detail_Image || null,
        Detail_Image_2: r.Detail_Image_2 || null,
        Context_Image: r.Context_Image || null,
        material: r.material || null,
        Size: r.Size || null,
        year: r.year || null,
        Estado: r.Estado || null,
        collection: r.collection || null,
        Feature: r.Feature === 'checked' || r.Feature === 'true',
        Edition: r.Edition || null
    }));
}

run();
