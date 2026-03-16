-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Categories Table
create table public."Categories" (
  id uuid primary key default uuid_generate_v4(),
  "Name" text,
  "Slug" text,
  "Description" text,
  "BODY" text,
  "WORKS" text
);

-- 2. Create BodyOfWorks Table
create table public."BodyOfWorks" (
  id uuid primary key default uuid_generate_v4(),
  "Name_Series" text,
  "Category" text,
  "Description_Series" text,
  "Year" text,
  "WORKS" text,
  "IS_SERIE" boolean default false
);

-- 3. Create Works Table
create table public."Works" (
  id uuid primary key default uuid_generate_v4(),
  "Title" text,
  "BODY" text,
  "Category" text,
  "Name_Body_from_body" text,
  "Primary_Image" text,
  "Detail_Image" text,
  "Detail_Image_2" text,
  "Context_Image" text,
  "material" text,
  "Size" text,
  "year" text,
  "Estado" text,
  "collection" text,
  "Feature" boolean default false,
  "Edition" text
);
