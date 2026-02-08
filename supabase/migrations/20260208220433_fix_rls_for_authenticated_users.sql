/*
  # Fix RLS Policies for Authenticated Users

  ## Overview
  This migration updates RLS policies to allow authenticated users to manage
  content, not just admin users. This enables proper development and testing
  while still maintaining security through authentication requirements.

  ## Changes Made

  ### portfolio_items
  - Updated INSERT/UPDATE/DELETE policies to allow any authenticated user
  - Previously required admin role in JWT app_metadata

  ### resume_content
  - Updated INSERT/UPDATE/DELETE policies to allow any authenticated user
  - Previously required admin role in JWT app_metadata

  ### seo_settings
  - Updated INSERT/UPDATE policies to allow any authenticated user
  - Previously required admin role in JWT app_metadata

  ### page_seo
  - Updated INSERT/UPDATE/DELETE policies to allow any authenticated user
  - Previously required admin role in JWT app_metadata

  ## Security Notes
  - Public read access remains unchanged (anyone can view)
  - Write access now requires authentication (logged in user)
  - For production, consider adding back admin role checks
  - All tables still have RLS enabled for security
*/

-- ============================================================================
-- 1. FIX portfolio_items POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin users can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin users can update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin users can delete portfolio items" ON portfolio_items;

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

-- ============================================================================
-- 2. FIX resume_content POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin users can insert resume content" ON resume_content;
DROP POLICY IF EXISTS "Admin users can update resume content" ON resume_content;
DROP POLICY IF EXISTS "Admin users can delete resume content" ON resume_content;

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

-- ============================================================================
-- 3. FIX seo_settings POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin users can insert SEO settings" ON seo_settings;
DROP POLICY IF EXISTS "Admin users can update SEO settings" ON seo_settings;

CREATE POLICY "Authenticated users can insert SEO settings"
  ON seo_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update SEO settings"
  ON seo_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 4. FIX page_seo POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin users can insert page SEO" ON page_seo;
DROP POLICY IF EXISTS "Admin users can update page SEO" ON page_seo;
DROP POLICY IF EXISTS "Admin users can delete page SEO" ON page_seo;

CREATE POLICY "Authenticated users can insert page SEO"
  ON page_seo FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update page SEO"
  ON page_seo FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete page SEO"
  ON page_seo FOR DELETE
  TO authenticated
  USING (true);
