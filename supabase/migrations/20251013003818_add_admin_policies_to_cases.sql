/*
  # Add Admin Policies for Cases Table

  1. Changes
    - Add INSERT policy for authenticated users to create cases
    - Add UPDATE policy for authenticated users to modify cases
    - Add DELETE policy for authenticated users to remove cases
  
  2. Security
    - All modification policies require authentication
    - Anyone can still read cases by case number (existing policy)
*/

CREATE POLICY "Authenticated users can insert cases"
  ON cases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cases"
  ON cases
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cases"
  ON cases
  FOR DELETE
  TO authenticated
  USING (true);
