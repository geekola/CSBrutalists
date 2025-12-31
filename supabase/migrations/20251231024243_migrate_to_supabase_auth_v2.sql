/*
  # Migrate to Supabase Auth

  1. Changes
    - Drop custom users table (no longer needed)
    - Update RLS policies on portfolio_items and resume_content
    - Allow authenticated users to manage portfolio data
    - Keep public read access for all content

  2. Security Updates
    - `portfolio_items`: Authenticated users can INSERT, UPDATE, DELETE
    - `resume_content`: Authenticated users can INSERT, UPDATE, DELETE
    - Public users can still SELECT (read) all content
    - project_images and seo_settings already have correct policies

  3. Important Notes
    - This migration switches from custom auth to Supabase Auth
    - Admin users must be created in Supabase Auth (Authentication > Users)
    - All policies now check for 'authenticated' role from Supabase Auth
*/

-- Drop the old custom users table
DROP TABLE IF EXISTS users CASCADE;

-- Update portfolio_items policies
DROP POLICY IF EXISTS "Disable all modifications" ON portfolio_items;

CREATE POLICY "Authenticated users can insert portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (true);

-- Update resume_content policies
DROP POLICY IF EXISTS "Disable all modifications on resume" ON resume_content;

CREATE POLICY "Authenticated users can insert resume content"
  ON resume_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update resume content"
  ON resume_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete resume content"
  ON resume_content FOR DELETE
  TO authenticated
  USING (true);

-- Update page_metadata policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'page_metadata') THEN
    -- Drop old restrictive policies if they exist
    DROP POLICY IF EXISTS "Only admins can modify page metadata" ON page_metadata;
    
    -- Add new authenticated user policies if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'page_metadata' 
      AND policyname = 'Authenticated users can insert page metadata'
    ) THEN
      CREATE POLICY "Authenticated users can insert page metadata"
        ON page_metadata FOR INSERT
        TO authenticated
        WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'page_metadata' 
      AND policyname = 'Authenticated users can update page metadata'
    ) THEN
      CREATE POLICY "Authenticated users can update page metadata"
        ON page_metadata FOR UPDATE
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'page_metadata' 
      AND policyname = 'Authenticated users can delete page metadata'
    ) THEN
      CREATE POLICY "Authenticated users can delete page metadata"
        ON page_metadata FOR DELETE
        TO authenticated
        USING (true);
    END IF;
  END IF;
END $$;
