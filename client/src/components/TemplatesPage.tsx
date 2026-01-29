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
  Globe,
  Loader2,
  Lock,
  Crown
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { generatePresentation, type GenerateProgress, type GenerateResponse, ApiError } from "../services/api";

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
    id: "corporate-blue",
    name: "Corporate Blue",
    category: "Professional",
    preview: "https://images.unsplash.com/photo-1586381317467-392e3a1ba577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBzbGlkZSUyMHRlbXBsYXRlJTIwZGVzaWduJTIwcHJvZmVzc2lvbmFsJTIwZnV0dXJpc3RpY3xlbnwxfHx8fDE3Njk1MTgxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isPremium: false,
    tags: ["Business", "Clean", "Blue"]
  },
  {
    id: "executive-dark",
    name: "Executive Dark",
    category: "Professional",
    preview: "https://images.unsplash.com/photo-1582406592664-24b0c8705265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwdGhlbWUlMjBwcmVzZW50YXRpb24lMjBkZXNpZ258ZW58MXx8fHwxNzY5NTE4MTI1fDA",
    isPremium: true,
    tags: ["Dark", "Executive", "Gold"]
  },
  {
    id: "academic",
    name: "Clean Academic",
    category: "Academic",
    preview: "https://images.unsplash.com/photo-1717994818193-266ff93e3396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcHJlc2VudGF0aW9uJTIwc2xpZGUlMjBsYXlvdXR8ZW58MXx8fHwxNzY5NTE4MTI0fDA",
    isPremium: false,
    tags: ["Thesis", "White", "Clear"]
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    category: "Modern",
    preview: "https://images.unsplash.com/photo-1569000972143-d9f60420a1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpZmljJTIwcmVzZWFyY2glMjBwb3N0ZXIlMjBiYWNrZ3JvdW5kJTIwYmx1ZXxlbnwxfHx8fDE3Njk1MTgxMjd8MA",
    isPremium: false,
    tags: ["Tech", "Gradient", "Modern"]
  },
  {
    id: "minimalist-white",
    name: "Minimalist White",
    category: "Minimal",
    preview: "https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isPremium: false,
    tags: ["White", "Structure", "Flat"]
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    category: "Modern",
    preview: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isPremium: true,
    tags: ["Cyberpunk", "Neon", "Glow"]
  },
  {
    id: "nature-earth",
    name: "Nature & Earth",
    category: "Professional",
    preview: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isPremium: false,
    tags: ["Nature", "Green", "Organic"]
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    category: "Modern",
    preview: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isPremium: true,
    tags: ["Creative", "Colorful", "Gradient"]
  }
];

interface UploadData {
  file: File;
  title: string;
}

interface TemplatesPageProps {
  onBack: () => void;
  onSelect: (templateId: string) => void;
  uploadData?: UploadData | null;
  onGenerationComplete?: (response: GenerateResponse, title: string, templateId: string) => void;
}

export function TemplatesPage({ onBack, onSelect, uploadData, onGenerationComplete }: TemplatesPageProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerateProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = ["All", "Professional", "Academic", "Modern", "Minimal"];

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateWithTemplate = async () => {
    if (!selectedId || !uploadData || !onGenerationComplete) return;

    const template = TEMPLATES.find(t => t.id === selectedId);
    if (template?.isPremium) {
      // Show premium modal or redirect to payment
      setError("This is a premium template. Please upgrade your plan to use it.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress({ status: 'uploading', message: 'Starting generation...', progress: 0 });

    try {
      const response = await generatePresentation(
        uploadData.file,
        uploadData.title,
        (progressUpdate) => setProgress(progressUpdate)
      );

      setIsGenerating(false);
      onGenerationComplete(response, uploadData.title, selectedId);

    } catch (err) {
      setIsGenerating(false);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Generation Progress Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 p-8 rounded-2xl border border-white/10 max-w-md w-full mx-4 text-center"
            >
              <Loader2 className="w-16 h-16 animate-spin text-primary-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Generating Presentation</h3>
              <p className="text-slate-400 mb-6">{progress?.message || "Processing your document..."}</p>
              <div className="w-full bg-white/10 rounded-full h-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress?.progress || 0}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-4">{progress?.progress || 0}% complete</p>
            </motion.div>
          </div>
        )}

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
              disabled={isGenerating}
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Upload
            </button>
            <h1 className="text-4xl font-bold tracking-tight">Template Selection</h1>
            <p className="text-slate-400 max-w-lg">
              Choose a presentation template. Free templates are ready to use. Premium templates require an upgrade.
            </p>
            {uploadData && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-primary-300">
                  Ready to generate: <strong>{uploadData.title}</strong> ({uploadData.file.name})
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search templates..."
                className="pl-10 bg-white/5 border-white/10 w-full sm:w-64 focus-visible:ring-primary-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <Button 
              className="bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 disabled:opacity-50"
              disabled={!selectedId || isGenerating || !uploadData}
              onClick={handleGenerateWithTemplate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use Template
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center justify-between"
          >
            <p className="text-red-200">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              ✕
            </button>
          </motion.div>
        )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    : template.isPremium 
                      ? "border-amber-500/30 hover:border-amber-500/50"
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
                  
                  {template.isPremium ? (
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg">
                        <Crown className="w-3 h-3 mr-1 fill-current" /> Premium
                      </Badge>
                    </div>
                  ) : (
                    <Badge className="absolute top-4 right-4 bg-emerald-500/80 text-white border-none">
                      Free
                    </Badge>
                  )}
                  
                  {/* Selection indicator */}
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
