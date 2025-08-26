import { createClient } from '@supabase/supabase-js'

// Lee las variables de entorno que configuramos en el archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Crea y exporta el cliente de Supabase para poder usarlo en toda la aplicación
export const supabase = createClient(supabaseUrl, supabaseAnonKey)