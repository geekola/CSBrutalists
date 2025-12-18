/*
  # Add project descriptions and image gallery support

  1. New Tables
    - `project_images`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to portfolio_items)
      - `image_data` (bytea) - binary image data
      - `image_name` (text) - original filename
      - `image_type` (text) - MIME type (image/jpeg, image/png, etc)
      - `order` (integer) - display order within project
      - `created_at` (timestamp)

  2. Modified Tables
    - `portfolio_items`
      - Add `description` (text) - project description/overview
      - Add `featured_image_id` (uuid) - reference to featured image

  3. Security
    - Enable RLS on `project_images` table
    - Create policies for public read access
    - Disable direct modifications from public

  4. Notes
    - Images are stored as base64 in bytea for simplicity
    - Multiple images per project for gallery
    - Featured image displayed in portfolio grid
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolio_items' AND column_name = 'description'
  ) THEN
    ALTER TABLE portfolio_items ADD COLUMN description text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolio_items' AND column_name = 'featured_image_id'
  ) THEN
    ALTER TABLE portfolio_items ADD COLUMN featured_image_id uuid;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
  image_data bytea NOT NULL,
  image_name text NOT NULL,
  image_type text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read project images"
  ON project_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Disable all modifications on project images"
  ON project_images FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);
