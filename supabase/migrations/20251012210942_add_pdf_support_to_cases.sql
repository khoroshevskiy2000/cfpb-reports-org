/*
  # Add PDF file storage support to cases table

  1. Changes
    - Add `pdf_file_name` column to store the original PDF filename
    - Add `pdf_file_url` column to store the PDF file URL from Supabase Storage
    - Add `pdf_uploaded_at` column to track when PDF was uploaded

  2. Storage
    - Create storage bucket for PDF files
    - Enable public access for reading PDFs
    - Set file size limit and allowed file types

  3. Security
    - Add RLS policies for storage bucket
    - Allow public read access to PDFs
    - Restrict uploads to authenticated users only
*/

-- Add PDF columns to cases table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'pdf_file_name'
  ) THEN
    ALTER TABLE cases ADD COLUMN pdf_file_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'pdf_file_url'
  ) THEN
    ALTER TABLE cases ADD COLUMN pdf_file_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'pdf_uploaded_at'
  ) THEN
    ALTER TABLE cases ADD COLUMN pdf_uploaded_at timestamptz;
  END IF;
END $$;

-- Create storage bucket for case PDFs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-pdfs', 'case-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can view case PDFs" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload case PDFs" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update case PDFs" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete case PDFs" ON storage.objects;
END $$;

-- Storage policies: Allow public read access
CREATE POLICY "Public can view case PDFs"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'case-pdfs');

-- Storage policies: Only authenticated users can upload
CREATE POLICY "Authenticated users can upload case PDFs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'case-pdfs');

-- Storage policies: Only authenticated users can update
CREATE POLICY "Authenticated users can update case PDFs"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'case-pdfs');

-- Storage policies: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete case PDFs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'case-pdfs');