/*
  # Fix Image Data Type

  1. Changes
    - Change `image_data` column from bytea to text in `project_images` table
    - This aligns with how the application stores base64-encoded image data as strings

  2. Notes
    - Any existing data will be lost during this conversion
    - Application stores base64 strings, not binary data
    - This fixes the mismatch between database schema and application logic
*/

-- Drop and recreate the table with correct data type
DROP TABLE IF EXISTS project_images CASCADE;

CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
  image_data text NOT NULL,
  image_name text NOT NULL,
  image_type text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project images"
  ON project_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage project images"
  ON project_images FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
