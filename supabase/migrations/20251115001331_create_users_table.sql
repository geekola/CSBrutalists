/*
  # Create authentication users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique) - for login
      - `password_hash` (text) - bcrypt hashed password
      - `created_at` (timestamp)
      - `is_active` (boolean) - to enable/disable access
  
  2. Security
    - Enable RLS on `users` table
    - Public read access to check username exists (for registration validation)
    - No direct user access to password hashes
    - Only backend can modify user data

  3. Notes
    - This is a simple authentication table for access control
    - Passwords must be hashed before insertion (bcrypt)
    - Consider the users you want to give access to and their credentials
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disable direct user access"
  ON users
  FOR ALL
  TO public
  USING (false);
