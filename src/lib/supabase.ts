import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Case {
  id: string;
  case_number: string;
  status: string;
  full_name: string;
  id_number: string;
  email: string;
  phone_number: string;
  date_of_birth: string | null;
  country: string;
  total_retrieved_amount: string;
  transaction_id: string | null;
  platform: string | null;
  payment_required: string;
  pdf_file_name: string | null;
  pdf_file_url: string | null;
  pdf_uploaded_at: string | null;
  created_at: string;
  updated_at: string;
}
