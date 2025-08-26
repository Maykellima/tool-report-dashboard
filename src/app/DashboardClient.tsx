// Archivo: src/app/DashboardClient.tsx

"use client"

import { useState, useMemo } from "react"
import {
  Search,
  ExternalLink,
  Users,
  CheckCircle,
  XCircle,
  Wrench,
  Calendar,
  Globe,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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

const getCategoryColor = (category: string) => {
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  ];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length] || "bg-slate-100 text-slate-700";
}

export default function DashboardClient({ initialReports }: { initialReports: ToolReport[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedTool, setSelectedTool] = useState<ToolReport | null>(null)
  
  const [toolReports] = useState<ToolReport[]>(initialReports)

  const filteredAndSortedTools = useMemo(() => {
    // CAMBIO: 'let' corregido a 'const'
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTools.map((tool) => (
          <Card
            key={tool.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            onClick={() => setSelectedTool(tool)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-slate-900 dark:text-slate-100 text-xl flex-1">{tool.name}</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); window.open(tool.official_url, "_blank") }}>
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {tool.categories.map((category) => (
                  <Badge key={category} className={`text-xs font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="flex-grow pt-0">
              <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                {tool.short_description}
              </CardDescription>
            </CardContent>

            <div className="px-6 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
               {tool.consistency_web_vs_users != null && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <TrendingUp className="h-4 w-4 flex-shrink-0" />
                  <span>Consistency: {tool.consistency_web_vs_users}%</span>
                </div>
              )}
              {tool.last_searched_at && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>Updated: {new Date(tool.last_searched_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
          {selectedTool && (
            <>
              <DialogHeader className="pb-4">
                <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">{selectedTool.name}</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400 text-base pt-2">
                  {selectedTool.short_description}
                </DialogDescription>
                 <Button variant="outline" className="w-fit mt-4 bg-transparent" onClick={() => window.open(selectedTool.official_url, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Official Website
                </Button>
              </DialogHeader>

              <div className="space-y-6">
                <div className="border-t border-slate-200 dark:border-slate-800" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pros */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500" /> Pros
                    </h3>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600 dark:text-slate-400">
                      {selectedTool.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                    </ul>
                  </div>
                  {/* Cons */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <XCircle className="h-6 w-6 text-red-500" /> Cons
                    </h3>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600 dark:text-slate-400">
                      {selectedTool.cons.map((con, index) => <li key={index}>{con}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800" />
                
                {/* Key Features */}
                <div className="space-y-3">
                   <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Wrench className="h-6 w-6 text-slate-500" /> Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600 dark:text-slate-400">
                    {selectedTool.key_features.map((feature, index) => <li key={index}>{feature}</li>)}
                  </ul>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* Target Audience */}
                 <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Users className="h-6 w-6 text-slate-500" /> Target Audience
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTool.target_audience.map((audience) => (
                      <Badge key={audience} variant="secondary">{audience}</Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* Alternatives */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Alternatives</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTool.alternatives.map((alt, index) => (
                      <Button key={index} variant="outline" className="justify-start h-auto p-3 bg-transparent" onClick={() => window.open(alt.url, "_blank")}>
                        <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{alt.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}