-- Update Works table
ALTER TABLE public."Works" 
ADD COLUMN IF NOT EXISTS "SortNumber" INT4,
ADD COLUMN IF NOT EXISTS "Series_Name" TEXT;

-- Update BodyOfWorks table
ALTER TABLE public."BodyOfWorks" 
ADD COLUMN IF NOT EXISTS "SortNumber" INT4;
