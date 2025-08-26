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
  Globe,
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
  const colors = {
    "AI Research Assistant": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    Productivity: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    "Note-taking": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "Knowledge Management": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  }
  return colors[category as keyof typeof colors] || colors.default
}


export default function DashboardClient({ initialReports }: { initialReports: ToolReport[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedTool, setSelectedTool] = useState<ToolReport | null>(null)
  
  const [toolReports] = useState<ToolReport[]>(initialReports)

  const filteredAndSortedTools = useMemo(() => {
    // CAMBIO: 'let' cambiado a 'const'
    const filtered = toolReports.filter((tool) => tool.name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "recent") {
      filtered.sort(
        (a, b) => new Date(b.last_searched_at || "").getTime() - new Date(a.last_searched_at || "").getTime(),
      )
    }
    return filtered
  }, [searchTerm, sortBy, toolReports])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTools.map((tool) => (
          <Card
            key={tool.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            onClick={() => setSelectedTool(tool)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-slate-900 dark:text-slate-100 text-xl flex-1">{tool.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(tool.official_url, "_blank")
                  }}
                >
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tool.categories.slice(0, 2).map((category) => (
                  <Badge key={category} className={getCategoryColor(category) + " text-xs"}>
                    {category}
                  </Badge>
                ))}
                {tool.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs text-slate-500 dark:text-slate-400">
                    +{tool.categories.length - 2} more
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                {tool.short_description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
          {selectedTool && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-slate-900 dark:text-slate-100">{selectedTool.name}</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400 text-base">
                  {selectedTool.short_description}
                </DialogDescription>
                 <Button
                  variant="outline"
                  className="w-fit mt-4 bg-transparent"
                  onClick={() => window.open(selectedTool.official_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Official Website
                </Button>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Pros */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Pros
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {selectedTool.pros.map((pro, index) => (
                      <li key={index} className="text-slate-600 dark:text-slate-400">
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    Cons
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {selectedTool.cons.map((con, index) => (
                      <li key={index} className="text-slate-600 dark:text-slate-400">
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {selectedTool.key_features && selectedTool.key_features.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                   <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                    <Wrench className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {selectedTool.key_features.map((feature, index) => (
                       <li key={index} className="text-slate-600 dark:text-slate-400">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}