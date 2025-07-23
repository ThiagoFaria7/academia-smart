// supabase/client.js
import { createClient } from '@supabase/supabase-js';

// Verifique se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não definidas.");
  // Lançar um erro pode ser útil para depuração em tempo de desenvolvimento
  // throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);