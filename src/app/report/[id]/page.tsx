// Archivo: src/app/report/[id]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import {
  ExternalLink,
  Users,
  CheckCircle,
  XCircle,
  Wrench,
  Globe,
  FileText,
  DollarSign,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// Interfaz para los datos del reporte
interface ToolReport {
  id: string;
  name: string;
  official_url: string;
  short_description: string;
  categories: string[];
  target_audience: string[];
  key_features: string[];
  pros: string[];
  cons: string[];
  use_case?: string;
  pricing?: string;
  alternatives?: Array<{ url: string; name: string }>;
  consulted_sources?: string[];
}

// Función para obtener los datos de un reporte específico
async function getReport(id: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching single report:', error);
    return null;
  }
  return data;
}

// La página que muestra el detalle del reporte
export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const report = await getReport(params.id) as ToolReport | null;

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Report not found</h1>
          <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
       <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{report.name}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base pt-2">{report.short_description}</p>
          <Button variant="outline" className="w-fit mt-4 bg-transparent" onClick={() => window.open(report.official_url, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Official Website
          </Button>
        </div>

        <div className="space-y-6 pt-6 text-sm">
          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Pros</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-400">
                {report.pros.map((pro, index) => <li key={index}>{pro}</li>)}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-500" /> Cons</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-400">
                {report.cons.map((con, index) => <li key={index}>{con}</li>)}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800" />

          {/* Key Features */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><Wrench className="h-5 w-5 text-slate-500" /> Key Features</h3>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-400">
              {report.key_features.map((feature, index) => <li key={index}>{feature}</li>)}
            </ul>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800" />

          {/* Use Case */}
          {report.use_case && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><FileText className="h-5 w-5 text-slate-500" /> Use Case</h3>
              <p className="text-slate-600 dark:text-slate-400">{report.use_case}</p>
            </div>
          )}
        </div>
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-center">
             <Link href="/" className="text-blue-500 hover:underline text-sm">
                &larr; Back to Dashboard
            </Link>
        </div>
       </div>
    </main>
  );
}