/*
  # Change payment_required field to text type

  1. Changes
    - Alter the `payment_required` column in `cases` table from numeric to text type
    - This allows storing text values like "150,000 USD" or "2,500 EUR" instead of just numbers

  2. Notes
    - Existing numeric data will be automatically converted to text format
    - This change is backward compatible
*/

-- Change payment_required from numeric to text
ALTER TABLE cases 
ALTER COLUMN payment_required TYPE text 
USING payment_required::text;