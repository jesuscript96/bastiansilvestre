import fs from 'fs';
import { parse } from 'csv-parse/sync';

const fileContent = fs.readFileSync('./public/WORKS-Grid view.csv', 'utf-8');
const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
});

console.log("Keys in first record:", Object.keys(records[0]));
