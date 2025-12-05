/*
  # Create cases table for client information

  1. New Tables
    - `cases`
      - `id` (uuid, primary key)
      - `case_number` (text, unique) - Case ID number for lookup
      - `status` (text) - Active/Blocked/Pending/On Hold/Received
      - `full_name` (text) - Client's full name
      - `id_number` (text) - Client's ID number
      - `email` (text) - Client's email address
      - `phone_number` (text) - Client's phone number
      - `date_of_birth` (date) - Client's date of birth
      - `country` (text) - Client's country
      - `total_retrieved_amount` (numeric) - Amount retrieved
      - `transaction_id` (text) - Transaction ID
      - `platform` (text) - Platform used
      - `payment_required` (numeric) - Payment amount required
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `cases` table
    - Add policy for public read access by case number
*/

CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  full_name text NOT NULL,
  id_number text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  date_of_birth date,
  country text NOT NULL,
  total_retrieved_amount numeric(10, 2) DEFAULT 0,
  transaction_id text,
  platform text,
  payment_required numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view case by case number"
  ON cases
  FOR SELECT
  TO anon, authenticated
  USING (true);