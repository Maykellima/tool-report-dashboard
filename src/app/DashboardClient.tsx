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
  LayoutGrid,
  List,
  FileText,
  DollarSign,
  BookOpen,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  const [view, setView] = useState("grid")
  
  const [toolReports] = useState<ToolReport[]>(initialReports)

  const filteredAndSortedTools = useMemo(() => {
    const filtered = toolReports.filter((tool) => tool.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "recent") {
      filtered.sort(
        (a, b) => new Date(b.last_searched_at || 0).getTime() - new Date(a.last_searched_at || 0).getTime(),
      );
    }
    return filtered;
  }, [searchTerm, sortBy, toolReports]);

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
          <div className="flex items-center gap-4">
             <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)} defaultValue="grid">
              <ToggleGroupItem value="grid" aria-label="Toggle grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="Toggle list view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
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
      </div>

      {/* Conditional View: Grid or List */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSortedTools.map((tool) => (
            <Card
              key={tool.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              onClick={() => setSelectedTool(tool)}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900 dark:text-slate-100 text-xl flex-1">{tool.name}</CardTitle>
                <div className="flex flex-wrap gap-1 pt-2">
                  {/* REGLA 1: Se muestran TODAS las categorías, más pequeñas y con color azul */}
                  {tool.categories.map((category) => (
                    <Badge key={category} className="text-[10px] px-1.5 py-0.5 font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-grow pt-0">
                <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3">
                  {tool.short_description}
                </CardDescription>
              </CardContent>

              {/* REGLA 2: Se mantiene Consistency y Updated en la card */}
              <div className="px-6 pb-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
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
      ) : (
        // La vista de lista se mantiene igual pero con el color de badge actualizado
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTools.map((tool) => (
                <TableRow key={tool.id} className="cursor-pointer" onClick={() => setSelectedTool(tool)}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tool.categories.map((category) => (
                        <Badge key={category} className="text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(tool.last_searched_at || 0).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* REGLA POPUP 1: Dialog ahora es más ancho (60vw), con scroll y texto de 14px (text-sm) */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="w-[60vw] max-w-none max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 text-sm">
          {selectedTool && (
            <div className="text-slate-600 dark:text-slate-400">
              <DialogHeader className="pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">{selectedTool.name}</DialogTitle>
                <DialogDescription className="text-base pt-2">{selectedTool.short_description}</DialogDescription>
                 <Button variant="outline" className="w-fit mt-4 bg-transparent" onClick={() => window.open(selectedTool.official_url, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Official Website
                </Button>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pros */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" /> Pros
                    </h3>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                      {selectedTool.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                    </ul>
                  </div>
                  {/* Cons */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" /> Cons
                    </h3>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                      {selectedTool.cons.map((con, index) => <li key={index}>{con}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800" />
                
                {/* REGLA POPUP 2: TODOS los campos están presentes */}
                {/* Key Features */}
                {selectedTool.key_features && selectedTool.key_features.length > 0 && (
                  <div className="space-y-3">
                     <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-slate-500" /> Key Features
                    </h3>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                      {selectedTool.key_features.map((feature, index) => <li key={index}>{feature}</li>)}
                    </ul>
                  </div>
                )}
                
                {/* Use Case */}
                {selectedTool.use_case && (
                  <>
                    <div className="border-t border-slate-200 dark:border-slate-800" />
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-slate-500" /> Use Case
                      </h3>
                      <p>{selectedTool.use_case}</p>
                    </div>
                  </>
                )}

                {/* Pricing */}
                {selectedTool.pricing && (
                  <>
                    <div className="border-t border-slate-200 dark:border-slate-800" />
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-slate-500" /> Pricing
                      </h3>
                      <p>{selectedTool.pricing}</p>
                    </div>
                  </>
                )}

                {/* Alternatives */}
                {selectedTool.alternatives && selectedTool.alternatives.length > 0 && (
                  <>
                    <div className="border-t border-slate-200 dark:border-slate-800" />
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Alternatives</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedTool.alternatives.map((alt, index) => (
                          <Button key={index} variant="outline" className="justify-start h-auto p-3 bg-transparent" onClick={() => window.open(alt.url, "_blank")}>
                            <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{alt.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Consulted Sources */}
                {selectedTool.consulted_sources && selectedTool.consulted_sources.length > 0 && (
                   <>
                    <div className="border-t border-slate-200 dark:border-slate-800" />
                    <div className="space-y-3">
                       <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-slate-500" /> Consulted Sources
                      </h3>
                      <div className="flex flex-col items-start gap-2">
                        {selectedTool.consulted_sources.map((source, index) => {
                          const match = source.match(/<(.+?)\|(.+?)>/);
                          if (match) {
                            const [, url, title] = match;
                            return (
                               <Button key={index} variant="link" className="h-auto p-0 text-slate-500 dark:text-blue-400" onClick={() => window.open(url, "_blank")}>
                                {title}
                              </Button>
                            )
                          }
                          return (
                            <Button key={index} variant="link" className="h-auto p-0 text-slate-500 dark:text-blue-400" onClick={() => window.open(source, "_blank")}>
                              {source}
                            </Button>
                          );
                        })}
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