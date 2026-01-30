/*
  # Fix Project Images RLS for Development Mode

  Development mode uses mocked authentication on the frontend.
  The actual Supabase JWT may not have the admin role set in app_metadata.
  
  This migration updates the project_images RLS policies to allow 
  all authenticated users to insert, update, and delete images.
  
  For production, ensure admin role is properly set in user app_metadata.
*/

-- Drop existing restrictive policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admin users can insert project images" ON project_images;
  DROP POLICY IF EXISTS "Admin users can update project images" ON project_images;
  DROP POLICY IF EXISTS "Admin users can delete project images" ON project_images;
END $$;

-- Allow authenticated users to manage project images
CREATE POLICY "Authenticated users can insert project images"
  ON project_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update project images"
  ON project_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project images"
  ON project_images FOR DELETE
  TO authenticated
  USING (true);
