/*
  # Add caption and alt text fields to project images

  1. Modified Tables
    - `project_images`
      - Add `caption` (text) - user-facing image description
      - Add `alt_text` (text) - accessibility text for screen readers

  2. Notes
    - Both fields default to empty string for existing records
    - Caption is displayed to users in galleries
    - Alt text is used for accessibility purposes
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'project_images' AND column_name = 'caption'
  ) THEN
    ALTER TABLE project_images ADD COLUMN caption text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'project_images' AND column_name = 'alt_text'
  ) THEN
    ALTER TABLE project_images ADD COLUMN alt_text text DEFAULT '';
  END IF;
END $$;
