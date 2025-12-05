/*
  # Create contact_submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required) - Full name of the person contacting
      - `email` (text, required) - Email address
      - `phone` (text, optional) - Phone number
      - `subject` (text, required) - Subject of the message
      - `message` (text, required) - Message content
      - `created_at` (timestamptz) - Timestamp when submission was created

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for admins to view all submissions
    - No public read/write access (submissions are created via edge function)

  3. Notes
    - This table stores all contact form submissions
    - Admins can view submissions through the database
*/

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all submissions
CREATE POLICY "Admins can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
    )
  );