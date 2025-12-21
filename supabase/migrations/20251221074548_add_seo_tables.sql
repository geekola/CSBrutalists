/*
  # Add SEO Tables and Fields

  ## Overview
  This migration creates comprehensive SEO management tables for local and general search engine optimization.
  Focused on Los Angeles local SEO and industry keywords from resume content.

  ## New Tables
  
  ### `seo_settings`
  Global site-wide SEO configuration including:
  - Site metadata (title, description, keywords)
  - Social media tags (Open Graph, Twitter Cards)
  - Local business information (name, location, service areas)
  - Analytics tracking codes
  - Contact information
  
  ### `page_seo`
  Per-page SEO overrides for different sections:
  - Custom titles and descriptions per page
  - Keywords specific to each section
  - Canonical URLs
  - Social sharing images

  ## Modified Tables
  
  ### `portfolio_items`
  Added SEO fields:
  - `slug` - URL-friendly identifier for clean URLs
  - `meta_description` - Custom description for project pages
  - `keywords` - Array of relevant keywords
  
  ## Security
  - Enable RLS on all new tables
  - Public read access for SEO data (needed for frontend rendering)
  - Modifications require authentication

  ## Default Data
  Pre-populated with Los Angeles-focused SEO content based on resume:
  - Brand Strategy consultant
  - AR/AI Product Development
  - Los Angeles and Southern California service areas
  - Professional experience and competencies
*/

-- Create seo_settings table for global site configuration
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text DEFAULT 'CS Brutalists',
  site_tagline text DEFAULT 'Brand Strategy & Innovation Leader',
  meta_description text DEFAULT 'Los Angeles based brand strategist and innovation leader specializing in AR/AI product development, integrated brand strategy, and digital media.',
  meta_keywords text DEFAULT 'brand strategy, Los Angeles, AR/AI development, augmented reality, innovation consultant, brand management, digital media, Southern California, business development, audience engagement',
  author_name text DEFAULT 'C Scott',
  business_name text DEFAULT 'C Scott Consulting Group',
  business_type text DEFAULT 'ProfessionalService',
  location_city text DEFAULT 'Los Angeles',
  location_state text DEFAULT 'CA',
  location_country text DEFAULT 'United States',
  service_areas text DEFAULT 'Los Angeles, Santa Monica, Beverly Hills, Culver City, West Hollywood, Southern California',
  phone text,
  email text,
  latitude numeric DEFAULT 34.0522,
  longitude numeric DEFAULT -118.2437,
  og_image text,
  og_type text DEFAULT 'website',
  twitter_handle text,
  google_analytics_id text,
  google_search_console_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create page_seo table for per-page overrides
CREATE TABLE IF NOT EXISTS page_seo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_description text NOT NULL,
  keywords text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add SEO fields to portfolio_items if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolio_items' AND column_name = 'slug'
  ) THEN
    ALTER TABLE portfolio_items ADD COLUMN slug text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolio_items' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE portfolio_items ADD COLUMN meta_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolio_items' AND column_name = 'keywords'
  ) THEN
    ALTER TABLE portfolio_items ADD COLUMN keywords text;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;

-- Allow public read access to SEO settings (needed for meta tags)
CREATE POLICY "Anyone can read SEO settings"
  ON seo_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read page SEO"
  ON page_seo FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can modify SEO settings
CREATE POLICY "Authenticated users can update SEO settings"
  ON seo_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert SEO settings"
  ON seo_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update page SEO"
  ON page_seo FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert page SEO"
  ON page_seo FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete page SEO"
  ON page_seo FOR DELETE
  TO authenticated
  USING (true);

-- Insert default SEO settings
INSERT INTO seo_settings (
  site_title,
  site_tagline,
  meta_description,
  meta_keywords,
  author_name,
  business_name,
  location_city,
  service_areas
) VALUES (
  'CS Brutalists',
  'Brand Strategy & Innovation Leader | Los Angeles',
  'Los Angeles based brand strategist and innovation leader with 20+ years experience. Specializing in AR/AI product development, integrated brand strategy, digital media, and audience engagement for the next generation.',
  'Los Angeles brand strategist, LA innovation consultant, Southern California AR/AI expert, augmented reality SaaS, brand management Los Angeles, digital media strategy, business development consultant, audience engagement, integrated brand strategy, B2B client acquisition',
  'C Scott',
  'C Scott Consulting Group',
  'Los Angeles',
  'Los Angeles, Santa Monica, Beverly Hills, Culver City, West Hollywood, Pasadena, Long Beach, Burbank, Glendale, Southern California'
);

-- Insert page-specific SEO data
INSERT INTO page_seo (page_key, title, meta_description, keywords) VALUES
(
  'home',
  'C Scott - Brand Strategist & Innovation Leader | Los Angeles, CA',
  'Entrepreneurial brand strategist in Los Angeles with 20+ years pioneering AR/AI SaaS and audience engagement. Expert in brand management, business development, and integrated digital media strategy.',
  'Los Angeles brand strategist, LA brand consultant, Southern California innovation leader, AR/AI product development, audience engagement expert, business development Los Angeles'
),
(
  'portfolio',
  'Portfolio - Brand Strategy & Media Projects | C Scott | Los Angeles',
  'View innovative brand strategy, media, and digital projects from Los Angeles-based consultant C Scott. Featuring AR/AI development, live events, and integrated brand campaigns.',
  'brand strategy portfolio, Los Angeles media projects, AR/AI case studies, brand management examples, digital campaigns, live events Los Angeles'
),
(
  'resume',
  'Experience & Expertise | Brand Strategy Consultant | Los Angeles',
  'Professional experience of C Scott - Los Angeles brand strategist specializing in AR/AI product development, integrated brand strategy, digital paid media, and cross-functional leadership.',
  'brand strategist resume, Los Angeles consultant experience, AR/AI expertise, digital media professional, innovation leader credentials'
),
(
  'contact',
  'Get in Touch | Los Angeles Brand Strategy Consultant | C Scott',
  'Contact C Scott for brand strategy, AR/AI product development, and digital media consulting services in Los Angeles and Southern California. Available for consulting engagements.',
  'contact Los Angeles brand strategist, hire brand consultant, AR/AI consulting, Southern California brand strategy services'
);
