/*
  # Fix Security Issues

  ## Overview
  This migration addresses multiple security vulnerabilities identified in the database audit:
  
  ## Changes

  ### 1. Add Missing Index
  - Add index on `project_images.project_id` foreign key for improved query performance
  
  ### 2. Fix Overly Permissive RLS Policies
  Replace policies that use `USING (true)` with proper admin role checks.
  Only users with admin role in their JWT app_metadata can modify data.
  
  ## Modified Tables and Policies
  
  ### `portfolio_items`
  - ✓ Keep public read access
  - ✓ Restrict INSERT/UPDATE/DELETE to admin users only
  
  ### `resume_content`
  - ✓ Keep public read access
  - ✓ Restrict INSERT/UPDATE/DELETE to admin users only
  
  ### `project_images`
  - ✓ Add index on project_id foreign key
  - ✓ Keep public read access
  - ✓ Restrict INSERT/UPDATE/DELETE to admin users only
  
  ### `page_seo`
  - ✓ Keep public read access
  - ✓ Restrict INSERT/UPDATE/DELETE to admin users only
  
  ### `seo_settings`
  - ✓ Keep public read access
  - ✓ Restrict INSERT/UPDATE to admin users only
  
  ## Security Notes
  - Admin role must be set in Supabase Auth user's app_metadata: {"role": "admin"}
  - All policies now check: (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  - This ensures only designated admin users can modify data
  - Public users retain read-only access to all content
  
  ## Important: Auth DB Connection Strategy
  NOTE: The Auth DB Connection Strategy should be changed from fixed (10 connections) 
  to percentage-based in the Supabase Dashboard under Settings > Database > Connection Pooling.
  This cannot be configured via SQL migration.
*/

-- ============================================================================
-- 1. ADD MISSING INDEX
-- ============================================================================

-- Add index on project_images foreign key for better query performance
CREATE INDEX IF NOT EXISTS idx_project_images_project_id 
  ON project_images(project_id);

-- ============================================================================
-- 2. FIX portfolio_items POLICIES
-- ============================================================================

-- Drop existing policies and recreate with proper restrictions
DO $$
BEGIN
  -- Drop all existing modification policies
  DROP POLICY IF EXISTS "Authenticated users can insert portfolio items" ON portfolio_items;
  DROP POLICY IF EXISTS "Authenticated users can update portfolio items" ON portfolio_items;
  DROP POLICY IF EXISTS "Authenticated users can delete portfolio items" ON portfolio_items;
  DROP POLICY IF EXISTS "Admin users can insert portfolio items" ON portfolio_items;
  DROP POLICY IF EXISTS "Admin users can update portfolio items" ON portfolio_items;
  DROP POLICY IF EXISTS "Admin users can delete portfolio items" ON portfolio_items;
END $$;

-- Create restrictive admin-only policies
CREATE POLICY "Admin users can insert portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can update portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can delete portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================================
-- 3. FIX resume_content POLICIES
-- ============================================================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can insert resume content" ON resume_content;
  DROP POLICY IF EXISTS "Authenticated users can update resume content" ON resume_content;
  DROP POLICY IF EXISTS "Authenticated users can delete resume content" ON resume_content;
  DROP POLICY IF EXISTS "Admin users can insert resume content" ON resume_content;
  DROP POLICY IF EXISTS "Admin users can update resume content" ON resume_content;
  DROP POLICY IF EXISTS "Admin users can delete resume content" ON resume_content;
END $$;

CREATE POLICY "Admin users can insert resume content"
  ON resume_content FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can update resume content"
  ON resume_content FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can delete resume content"
  ON resume_content FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================================
-- 4. FIX project_images POLICIES
-- ============================================================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can insert project images" ON project_images;
  DROP POLICY IF EXISTS "Authenticated users can update project images" ON project_images;
  DROP POLICY IF EXISTS "Authenticated users can delete project images" ON project_images;
  DROP POLICY IF EXISTS "Admin users can insert project images" ON project_images;
  DROP POLICY IF EXISTS "Admin users can update project images" ON project_images;
  DROP POLICY IF EXISTS "Admin users can delete project images" ON project_images;
  DROP POLICY IF EXISTS "Disable all modifications on project images" ON project_images;
END $$;

CREATE POLICY "Admin users can insert project images"
  ON project_images FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can update project images"
  ON project_images FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can delete project images"
  ON project_images FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================================
-- 5. FIX page_seo POLICIES
-- ============================================================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can insert page SEO" ON page_seo;
  DROP POLICY IF EXISTS "Authenticated users can update page SEO" ON page_seo;
  DROP POLICY IF EXISTS "Authenticated users can delete page SEO" ON page_seo;
  DROP POLICY IF EXISTS "Admin users can insert page SEO" ON page_seo;
  DROP POLICY IF EXISTS "Admin users can update page SEO" ON page_seo;
  DROP POLICY IF EXISTS "Admin users can delete page SEO" ON page_seo;
END $$;

CREATE POLICY "Admin users can insert page SEO"
  ON page_seo FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can update page SEO"
  ON page_seo FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can delete page SEO"
  ON page_seo FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================================
-- 6. FIX seo_settings POLICIES
-- ============================================================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can insert SEO settings" ON seo_settings;
  DROP POLICY IF EXISTS "Authenticated users can update SEO settings" ON seo_settings;
  DROP POLICY IF EXISTS "Admin users can insert SEO settings" ON seo_settings;
  DROP POLICY IF EXISTS "Admin users can update SEO settings" ON seo_settings;
END $$;

CREATE POLICY "Admin users can insert SEO settings"
  ON seo_settings FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can update SEO settings"
  ON seo_settings FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
