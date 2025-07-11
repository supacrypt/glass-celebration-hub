-- Fix content_blocks table unique constraint for ON CONFLICT clauses
-- This resolves the "no unique or exclusion constraint matching" error

-- Add unique constraint to content_blocks table
ALTER TABLE content_blocks 
ADD CONSTRAINT content_blocks_section_type_title_key 
UNIQUE (section, type, title);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_content_blocks_section_type_title 
ON content_blocks (section, type, title);