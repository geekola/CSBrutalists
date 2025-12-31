/*
  # Fix RLS Policies for Project Images

  1. Changes
    - Drop the restrictive service_role policy
    - Add policies allowing authenticated users to manage project images
    - Keep public read access for viewing images

  2. Security
    - Authenticated users can insert, update, and delete project images
    - Public users can only view project images
    - This allows admins to upload and manage images from the admin panel
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can manage project images" ON project_images;
DROP POLICY IF EXISTS "Anyone can view project images" ON project_images;

-- Public can view all images
CREATE POLICY "Anyone can view project images"
  ON project_images FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated users can insert project images"
  ON project_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update images
CREATE POLICY "Authenticated users can update project images"
  ON project_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete images
CREATE POLICY "Authenticated users can delete project images"
  ON project_images FOR DELETE
  TO authenticated
  USING (true);
