// Archivo: src/app/page.tsx

import { supabase } from "@/lib/supabaseClient";
import DashboardClient from "./DashboardClient"; // Importamos el componente de cliente

// Esta página ahora es un Server Component, obtiene datos antes de enviarlos al navegador
export default async function DashboardPage() {
  
  // Obtenemos todos los informes de la base de datos
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .order('last_searched_at', { ascending: false });

  if (error) {
    console.error("Error fetching reports from Supabase:", error);
    // En caso de error, pasamos un array vacío al cliente
    return <DashboardClient initialReports={[]} />;
  }

  // Pasamos los datos obtenidos al componente de cliente para que los renderice
  return <DashboardClient initialReports={reports || []} />;
}