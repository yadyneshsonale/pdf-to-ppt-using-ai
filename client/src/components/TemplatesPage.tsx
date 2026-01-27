import { motion } from "motion/react";
import { 
  ChevronLeft, 
  Search, 
  Layout, 
  Check, 
  Star, 
  Sparkles,
  Zap,
  Clock,
  Globe
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Template {
  id: string;
  name: string;
  category: "Professional" | "Academic" | "Modern" | "Minimal";
  preview: string;
  isPremium: boolean;
  tags: string[];
}

const TEMPLATES: Template[] = [
  {
    id: "1",
    name: "Futuristic Research",
    category: "Professional",
    preview: "https://images.unsplash.com/photo-1586381317467-392e3a1ba577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBzbGlkZSUyMHRlbXBsYXRlJTIwZGVzaWduJTIwcHJvZmVzc2lvbmFsJTIwZnV0dXJpc3RpY3xlbnwxfHx8fDE3Njk1MTgxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isPremium: true,
    tags: ["High-Tech", "AI", "Blue"]
  },
  {
    id: "2",
    name: "Clean Academic",
    category: "Academic",
    preview: "https://images.unsplash.com/photo-1717994818193-266ff93e3396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcHJlc2VudGF0aW9uJTIwc2xpZGUlMjBsYXlvdXR8ZW58MXx8fHwxNzY5NTE4MTI0fDA",
    isPremium: false,
    tags: ["Thesis", "White", "Clear"]
  },
  {
    id: "3",
    name: "Midnight Boardroom",
    category: "Modern",
    preview: "https://images.unsplash.com/photo-1582406592664-24b0c8705265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwdGhlbWUlMjBwcmVzZW50YXRpb24lMjBkZXNpZ258ZW58MXx8fHwxNzY5NTE4MTI1fDA",
    isPremium: true,
    tags: ["Dark", "Executive", "Gold"]
  },
  {
    id: "4",
    name: "Scientific Abstract",
    category: "Academic",
    preview: "https://images.unsplash.com/photo-1569000972143-d9f60420a1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpZmljJTIwcmVzZWFyY2glMjBwb3N0ZXIlMjBiYWNrZ3JvdW5kJTIwYmx1ZXxlbnwxfHx8fDE3Njk1MTgxMjd8MA",
    isPremium: false,
    tags: ["Biology", "Chemistry", "Gradient"]
  },
  {
    id: "5",
    name: "Minimalist Grid",
    category: "Minimal",
    preview: "https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isPremium: false,
    tags: ["White", "Structure", "Flat"]
  },
  {
    id: "6",
    name: "Neo-Digital",
    category: "Modern",
    preview: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isPremium: true,
    tags: ["Cyberpunk", "Neon", "Glow"]
  }
];

interface TemplatesPageProps {
  onBack: () => void;
  onSelect: (templateId: string) => void;
}

export function TemplatesPage({ onBack, onSelect }: TemplatesPageProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const categories = ["All", "Professional", "Academic", "Modern", "Minimal"];

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Upload
            </button>
            <h1 className="text-4xl font-bold tracking-tight">Choose a Template</h1>
            <p className="text-slate-400 max-w-lg">
              Select the perfect design style for your research paper. Our AI will adapt your content to fit the template's structure.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search templates..."
                className="pl-10 bg-white/5 border-white/10 w-full sm:w-64 focus-visible:ring-primary-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              className="bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90"
              disabled={!selectedId}
              onClick={() => selectedId && onSelect(selectedId)}
            >
              Continue with Template
            </Button>
          </div>
        </header>

        {/* Filters and Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat 
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-400" />
              <span>AI Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-400" />
              <span>5min Creation</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Web & PDF Ready</span>
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`overflow-hidden bg-white/5 border-2 transition-all duration-300 cursor-pointer group ${
                  selectedId === template.id 
                    ? "border-primary-500 ring-4 ring-primary-500/10" 
                    : "border-white/10 hover:border-white/20"
                }`}
                onClick={() => setSelectedId(template.id)}
              >
                <div className="relative aspect-video">
                  <ImageWithFallback 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60" />
                  
                  {template.isPremium && (
                    <Badge className="absolute top-4 right-4 bg-amber-500 text-white border-none">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Premium
                    </Badge>
                  )}
                  
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    selectedId === template.id ? "opacity-100" : "opacity-0"
                  }`}>
                    <div className="p-3 bg-primary-500 rounded-full shadow-xl">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                      {template.name}
                    </h3>
                    <span className="text-xs text-slate-500 uppercase tracking-widest">{template.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="px-6 pb-6 pt-0 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                        <Layout className="w-3 h-3 text-slate-500" />
                      </div>
                    ))}
                    <span className="ml-4 text-xs text-slate-500 flex items-center">
                      +12 layouts
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary-400 hover:text-primary-300 hover:bg-primary-500/10"
                  >
                    Preview
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
            <Button 
              variant="outline" 
              className="mt-6 border-white/10 hover:bg-white/5"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
