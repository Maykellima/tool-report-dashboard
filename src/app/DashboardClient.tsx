// Archivo: src/app/DashboardClient.tsx

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  ExternalLink,
  Users,
  Wrench,
  Calendar,
  TrendingUp,
  Globe,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  BookOpen
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ToolReport {
  id: string
  name: string
  official_url: string
  short_description: string
  categories: string[]
  target_audience: string[]
  key_features: string[]
  pros: string[]
  cons: string[]
  use_case?: string
  pricing?: string
  alternatives?: Array<{ url: string; name: string }>
  created_at?: string
  last_searched_at?: string
  consistency_web_vs_users?: number
  consulted_sources?: string[]
}

export default function DashboardClient({ initialReports }: { initialReports: ToolReport[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedTool, setSelectedTool] = useState<ToolReport | null>(null)
  
  const [toolReports] = useState<ToolReport[]>(initialReports)

  const filteredAndSortedTools = useMemo(() => {
    const filtered = toolReports.filter((tool) => tool.name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "recent") {
      filtered.sort(
        (a, b) => new Date(b.last_searched_at || 0).getTime() - new Date(a.last_searched_at || 0).getTime(),
      )
    }
    return filtered
  }, [searchTerm, sortBy, toolReports])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">Tool Report Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search tools by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CAMBIO: ajustado a 4 columnas en pantallas grandes (lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAndSortedTools.map((tool) => (
          <Card
            key={tool.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            onClick={() => setSelectedTool(tool)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-slate-900 dark:text-slate-100 text-xl flex-1">{tool.name}</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <a href={tool.official_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="h-4 w-4 text-slate-500" />
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                <Badge className="text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                  {tool.categories[0]}
                </Badge>
                {tool.categories.length > 1 && (
                   <Badge variant="outline" className="text-xs text-slate-500 dark:text-slate-400">
                    +{tool.categories.length - 1} more
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-grow pt-0">
              <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                {tool.short_description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-lg mx-auto bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
          {selectedTool && (
            <>
              <DialogHeader className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">{selectedTool.name}</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400 text-base pt-2">{selectedTool.short_description}</DialogDescription>
                <Button variant="outline" className="w-fit mt-4 mx-auto bg-transparent" onClick={() => window.open(selectedTool.official_url, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Official Website
                </Button>
              </DialogHeader>

              <div className="space-y-6 pt-6 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Pros</h3>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-400">
                      {selectedTool.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-500" /> Cons</h3>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-400">
                      {selectedTool.cons.map((con, index) => <li key={index}>{con}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><Wrench className="h-5 w-5 text-slate-500" /> Key Features</h3>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-400">
                    {selectedTool.key_features.map((feature, index) => <li key={index}>{feature}</li>)}
                  </ul>
                </div>

                {/* CAMBIO: Añadida comprobación de seguridad para 'alternatives' */}
                {selectedTool.alternatives && selectedTool.alternatives.length > 0 && (
                  <>
                    <div className="border-t border-slate-200 dark:border-slate-800" />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><Globe className="h-5 w-5 text-slate-500" /> Alternatives</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedTool.alternatives.map((alt, index) => (
                          <Button key={index} variant="outline" className="justify-start h-auto p-2 bg-transparent text-xs" onClick={() => window.open(alt.url, "_blank")}>
                            <ExternalLink className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{alt.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}