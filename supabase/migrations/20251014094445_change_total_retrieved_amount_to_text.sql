/*
  # Change total_retrieved_amount to text type

  1. Changes
    - Convert `total_retrieved_amount` column from numeric to text type
    - This allows entering letters, numbers, and special characters

  2. Notes
    - Existing numeric values will be converted to text automatically
    - This provides more flexibility for entering various formats
*/

-- Change total_retrieved_amount from numeric to text
ALTER TABLE cases ALTER COLUMN total_retrieved_amount TYPE text USING total_retrieved_amount::text;