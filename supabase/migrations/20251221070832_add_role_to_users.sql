/*
  # Add role column to users table

  1. Changes
    - Add `role` column to `users` table
      - Type: text with check constraint
      - Values: 'admin' or 'viewer'
      - Default: 'viewer'
      - Not null
  
  2. Notes
    - All existing users will default to 'viewer' role
    - Role determines access level: admin can edit, viewer can only view
    - This enables role-based access control for the portfolio
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'viewer' NOT NULL;
    
    ALTER TABLE users ADD CONSTRAINT users_role_check 
      CHECK (role IN ('admin', 'viewer'));
  END IF;
END $$;