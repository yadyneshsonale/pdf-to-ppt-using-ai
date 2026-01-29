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
  category: "Business" | "Creative" | "Technology" | "Education" | "Minimal";
  preview: string;
  isPremium: boolean;
  tags: string[];
  gradient: string;
  accentColor: string;
}

const TEMPLATES: Template[] = [
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    category: "Business",
    preview: "",
    isPremium: false,
    tags: ["Business", "Clean", "Professional"],
    gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)",
    accentColor: "#3b82f6"
  },
  {
    id: "executive-gold",
    name: "Executive Gold",
    category: "Business",
    preview: "",
    isPremium: true,
    tags: ["Executive", "Dark", "Gold"],
    gradient: "linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)",
    accentColor: "#fbbf24"
  },
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    category: "Creative",
    preview: "",
    isPremium: false,
    tags: ["Creative", "Colorful", "Modern"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    accentColor: "#a855f7"
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    category: "Technology",
    preview: "",
    isPremium: false,
    tags: ["Tech", "Grid", "Cyan"],
    gradient: "linear-gradient(180deg, #0f172a 0%, #030712 100%)",
    accentColor: "#22d3ee"
  },
  {
    id: "clean-minimal",
    name: "Clean Minimal",
    category: "Minimal",
    preview: "",
    isPremium: false,
    tags: ["White", "Clean", "Simple"],
    gradient: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    accentColor: "#3b82f6"
  },
  {
    id: "nature-green",
    name: "Nature Green",
    category: "Creative",
    preview: "",
    isPremium: false,
    tags: ["Nature", "Green", "Organic"],
    gradient: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)",
    accentColor: "#22c55e"
  },
  {
    id: "academic-classic",
    name: "Academic Classic",
    category: "Education",
    preview: "",
    isPremium: false,
    tags: ["Academic", "Research", "Thesis"],
    gradient: "linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)",
    accentColor: "#818cf8"
  },
  {
    id: "sunset-warm",
    name: "Sunset Warm",
    category: "Creative",
    preview: "",
    isPremium: true,
    tags: ["Warm", "Orange", "Creative"],
    gradient: "linear-gradient(135deg, #7c2d12 0%, #1c1917 60%, #1c1917 100%)",
    accentColor: "#f97316"
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    category: "Creative",
    preview: "",
    isPremium: false,
    tags: ["Ocean", "Blue", "Calm"],
    gradient: "linear-gradient(180deg, #0c4a6e 0%, #082f49 60%, #0c4a6e 100%)",
    accentColor: "#0ea5e9"
  },
  {
    id: "professional-gray",
    name: "Professional Gray",
    category: "Business",
    preview: "",
    isPremium: false,
    tags: ["Gray", "Neutral", "Corporate"],
    gradient: "linear-gradient(135deg, #27272a 0%, #18181b 100%)",
    accentColor: "#71717a"
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

  const categories = ["All", "Business", "Creative", "Technology", "Education", "Minimal"];

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
                <div className="relative aspect-video overflow-hidden" style={{ background: template.gradient }}>
                  {/* Decorative elements based on template */}
                  <div className="absolute inset-0 pointer-events-none">
                    {template.id === 'corporate-blue' && (
                      <>
                        <div className="absolute top-[10%] right-[5%] w-[40%] h-[50%] rounded-full opacity-10" style={{ background: template.accentColor }} />
                        <div className="absolute bottom-[10%] left-[5%] w-[25%] h-[40%] rounded-full opacity-10" style={{ background: template.accentColor }} />
                      </>
                    )}
                    {template.id === 'executive-gold' && (
                      <>
                        <div className="absolute bottom-[8%] left-[5%] right-[5%] h-[3px] opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${template.accentColor}, transparent)` }} />
                        <div className="absolute top-[5%] right-[15%] w-[2px] h-[25%] opacity-30" style={{ background: template.accentColor }} />
                        <div className="absolute top-[5%] right-[10%] w-[15%] h-[12%] rounded-full opacity-10" style={{ background: template.accentColor }} />
                      </>
                    )}
                    {template.id === 'modern-gradient' && (
                      <>
                        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[80%] rounded-full opacity-20" style={{ background: template.accentColor }} />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full opacity-15" style={{ background: '#ec4899' }} />
                      </>
                    )}
                    {template.id === 'tech-startup' && (
                      <>
                        <div className="absolute inset-0 opacity-10" style={{ 
                          backgroundImage: `linear-gradient(${template.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${template.accentColor} 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }} />
                        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] rounded-full opacity-10" style={{ background: template.accentColor }} />
                        <div className="absolute bottom-[8%] left-0 w-[30%] h-[4px] opacity-30" style={{ background: template.accentColor }} />
                      </>
                    )}
                    {template.id === 'clean-minimal' && (
                      <>
                        <div className="absolute top-0 left-0 w-[3%] h-full" style={{ background: template.accentColor }} />
                        <div className="absolute top-[8%] right-[5%] w-[15%] h-[18%] rounded-full opacity-8" style={{ background: template.accentColor }} />
                      </>
                    )}
                    {template.id === 'nature-green' && (
                      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full opacity-15" style={{ background: template.accentColor }} />
                    )}
                    {template.id === 'academic-classic' && (
                      <>
                        <div className="absolute inset-[5%] border opacity-20 rounded-lg" style={{ borderColor: template.accentColor }} />
                        <div className="absolute top-[8%] left-[8%] w-[8%] h-[10%] rounded-full opacity-15" style={{ background: template.accentColor }} />
                        <div className="absolute bottom-[8%] right-[8%] w-[8%] h-[10%] rounded-full opacity-15" style={{ background: template.accentColor }} />
                      </>
                    )}
                    {template.id === 'sunset-warm' && (
                      <>
                        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[90%] rounded-full opacity-25" style={{ background: template.accentColor }} />
                        <div className="absolute top-[5%] left-[5%] w-[20%] h-[25%] rounded-full opacity-15" style={{ background: template.accentColor }} />
                      </>
                    )}
                    {template.id === 'ocean-blue' && (
                      <>
                        <div className="absolute top-[-15%] left-0 right-0 h-[40%] opacity-10" style={{ 
                          background: `linear-gradient(180deg, ${template.accentColor}, transparent)`,
                          clipPath: 'ellipse(60% 100% at 50% 0%)'
                        }} />
                        <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[45%] rounded-full opacity-10" style={{ background: template.accentColor }} />
                      </>
                    )}
                    {template.id === 'professional-gray' && (
                      <>
                        <div className="absolute bottom-0 left-0 right-0 h-[12%]" style={{ background: '#27272a' }} />
                        <div className="absolute bottom-[4%] left-[5%] w-[20%] h-[3px]" style={{ background: template.accentColor }} />
                        <div className="absolute top-[8%] right-[5%] w-[12%] h-[4px] opacity-50" style={{ background: '#52525b' }} />
                        <div className="absolute top-[15%] right-[5%] w-[8%] h-[4px] opacity-30" style={{ background: '#52525b' }} />
                      </>
                    )}
                  </div>
                  
                  {/* Sample slide content preview */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                    <div className="text-left">
                      <div 
                        className="text-[10px] font-bold mb-1 truncate" 
                        style={{ color: template.id === 'clean-minimal' ? '#0f172a' : '#ffffff' }}
                      >
                        Sample Presentation
                      </div>
                      <div 
                        className="text-[6px] opacity-60 truncate"
                        style={{ color: template.id === 'clean-minimal' ? '#475569' : '#ffffff' }}
                      >
                        Subtitle goes here
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => (
                        <div 
                          key={i} 
                          className="h-[3px] rounded-full flex-1 opacity-20"
                          style={{ background: template.accentColor }}
                        />
                      ))}
                    </div>
                  </div>
                  
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
