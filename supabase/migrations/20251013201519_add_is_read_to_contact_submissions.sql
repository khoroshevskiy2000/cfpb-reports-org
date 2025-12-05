/*
  # Add read status and improve RLS for contact_submissions

  1. Changes
    - Add `is_read` column (boolean) to track read/unread status
    - Update RLS policies to ensure admins can update submissions

  2. Security
    - Add policy for admins to update submissions (mark as read)
    - Maintain existing SELECT policy for authenticated users

  3. Notes
    - Default value for is_read is false (unread)
    - This enables tracking of unread contact submissions
*/

-- Add is_read column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'is_read'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN is_read boolean DEFAULT false;
  END IF;
END $$;

-- Drop existing policy if exists and recreate
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;

-- Policy: Admins can view all submissions
CREATE POLICY "Admins can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admins can update submissions (mark as read)
CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);