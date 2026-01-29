import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Search, 
  Layout, 
  Lock,
  Crown,
  Eye,
  Check,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface Template {
  id: string;
  name: string;
  category: "Business" | "Creative" | "Technology" | "Education" | "Minimal";
  description: string;
  isPremium: boolean;
  tags: string[];
  layouts: string[];
  gradient: string;
  accentColor: string;
}

const TEMPLATES: Template[] = [
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    category: "Business",
    description: "Clean and professional design perfect for business presentations",
    isPremium: false,
    tags: ["Business", "Clean", "Professional"],
    layouts: ["Title Slide", "Content", "Two Column", "Image Focus"],
    gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)",
    accentColor: "#3b82f6"
  },
  {
    id: "executive-gold",
    name: "Executive Gold",
    category: "Business",
    description: "Sophisticated dark theme with gold accents for executive presentations",
    isPremium: true,
    tags: ["Executive", "Dark", "Gold"],
    layouts: ["Title Slide", "Content", "Quote", "Data Visualization"],
    gradient: "linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)",
    accentColor: "#fbbf24"
  },
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    category: "Creative",
    description: "Vibrant purple-pink gradients for creative presentations",
    isPremium: false,
    tags: ["Creative", "Colorful", "Modern"],
    layouts: ["Title Slide", "Showcase", "Portfolio", "Contact"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    accentColor: "#a855f7"
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    category: "Technology",
    description: "Modern grid design with cyan accents for tech pitches",
    isPremium: false,
    tags: ["Tech", "Grid", "Cyan"],
    layouts: ["Title Slide", "Features", "Metrics", "Team"],
    gradient: "linear-gradient(180deg, #0f172a 0%, #030712 100%)",
    accentColor: "#22d3ee"
  },
  {
    id: "clean-minimal",
    name: "Clean Minimal",
    category: "Minimal",
    description: "Ultra-clean white design that lets content shine",
    isPremium: false,
    tags: ["White", "Clean", "Simple"],
    layouts: ["Title Slide", "Content", "Image", "Comparison"],
    gradient: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    accentColor: "#3b82f6"
  },
  {
    id: "nature-green",
    name: "Nature Green",
    category: "Creative",
    description: "Organic design with natural green tones",
    isPremium: false,
    tags: ["Nature", "Green", "Organic"],
    layouts: ["Title Slide", "Content", "Gallery", "Impact"],
    gradient: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)",
    accentColor: "#22c55e"
  },
  {
    id: "academic-classic",
    name: "Academic Classic",
    category: "Education",
    description: "Elegant design ideal for thesis and research presentations",
    isPremium: false,
    tags: ["Academic", "Research", "Thesis"],
    layouts: ["Title", "Abstract", "Methods", "Results", "Conclusion"],
    gradient: "linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)",
    accentColor: "#818cf8"
  },
  {
    id: "sunset-warm",
    name: "Sunset Warm",
    category: "Creative",
    description: "Warm orange tones with dramatic lighting effect",
    isPremium: true,
    tags: ["Warm", "Orange", "Creative"],
    layouts: ["Title Slide", "Content", "Quote", "Gallery"],
    gradient: "linear-gradient(135deg, #7c2d12 0%, #1c1917 60%, #1c1917 100%)",
    accentColor: "#f97316"
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    category: "Creative",
    description: "Calm ocean-inspired blues for peaceful presentations",
    isPremium: false,
    tags: ["Ocean", "Blue", "Calm"],
    layouts: ["Title Slide", "Content", "Stats", "Contact"],
    gradient: "linear-gradient(180deg, #0c4a6e 0%, #082f49 60%, #0c4a6e 100%)",
    accentColor: "#0ea5e9"
  },
  {
    id: "professional-gray",
    name: "Professional Gray",
    category: "Business",
    description: "Neutral gray tones for corporate settings",
    isPremium: false,
    tags: ["Gray", "Neutral", "Corporate"],
    layouts: ["Title Slide", "Content", "Data", "Summary"],
    gradient: "linear-gradient(135deg, #27272a 0%, #18181b 100%)",
    accentColor: "#71717a"
  }
];

interface TemplatesGalleryProps {
  onBack: () => void;
  onSelectTemplate: (templateId: string) => void;
  onUpgrade: () => void;
}

export function TemplatesGallery({ onBack, onSelectTemplate, onUpgrade }: TemplatesGalleryProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories = ["All", "Business", "Creative", "Technology", "Education", "Minimal"];

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-white/10" />
              <h1 className="text-xl font-bold">Template Gallery</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="pl-10 w-64 bg-white/5 border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Professional Templates
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates.
            Each template includes multiple slide layouts to create stunning presentations.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-primary-500/50 transition-all duration-300"
            >
              {/* Preview Image */}
              <div className="relative aspect-video overflow-hidden" style={{ background: template.gradient }}>
                {/* Decorative elements */}
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
                    </>
                  )}
                </div>
                
                {/* Sample content preview */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none z-10">
                  <div className="text-left">
                    <div 
                      className="text-sm font-bold mb-1 truncate" 
                      style={{ color: template.id === 'clean-minimal' ? '#0f172a' : '#ffffff' }}
                    >
                      {template.name}
                    </div>
                    <div 
                      className="text-xs opacity-60 truncate"
                      style={{ color: template.id === 'clean-minimal' ? '#475569' : '#ffffff' }}
                    >
                      {template.category} Template
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <div 
                        key={i} 
                        className="h-[4px] rounded-full flex-1 opacity-30"
                        style={{ background: template.accentColor }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500/90 rounded-full">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Premium</span>
                  </div>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewTemplate(template)}
                    className="bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => template.isPremium ? onUpgrade() : onSelectTemplate(template.id)}
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    {template.isPremium ? (
                      <>
                        <Lock className="w-4 h-4 mr-1" />
                        Upgrade
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Use Template
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{template.name}</h3>
                    <p className="text-sm text-slate-400">{template.category}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/5 text-slate-400 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <Layout className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setPreviewTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{previewTemplate.name}</h2>
                <p className="text-slate-400">{previewTemplate.category} Template</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="aspect-video rounded-lg overflow-hidden mb-6 relative" style={{ background: previewTemplate.gradient }}>
                {/* Decorative elements for modal preview */}
                <div className="absolute inset-0 pointer-events-none">
                  {previewTemplate.id === 'corporate-blue' && (
                    <>
                      <div className="absolute top-[10%] right-[5%] w-[40%] h-[50%] rounded-full opacity-10" style={{ background: previewTemplate.accentColor }} />
                      <div className="absolute bottom-[10%] left-[5%] w-[25%] h-[40%] rounded-full opacity-10" style={{ background: previewTemplate.accentColor }} />
                    </>
                  )}
                  {previewTemplate.id === 'executive-gold' && (
                    <>
                      <div className="absolute bottom-[8%] left-[5%] right-[5%] h-[3px] opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${previewTemplate.accentColor}, transparent)` }} />
                      <div className="absolute top-[5%] right-[15%] w-[2px] h-[25%] opacity-30" style={{ background: previewTemplate.accentColor }} />
                    </>
                  )}
                  {previewTemplate.id === 'modern-gradient' && (
                    <>
                      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[80%] rounded-full opacity-20" style={{ background: previewTemplate.accentColor }} />
                      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full opacity-15" style={{ background: '#ec4899' }} />
                    </>
                  )}
                  {previewTemplate.id === 'tech-startup' && (
                    <>
                      <div className="absolute inset-0 opacity-10" style={{ 
                        backgroundImage: `linear-gradient(${previewTemplate.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${previewTemplate.accentColor} 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                      }} />
                      <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] rounded-full opacity-10" style={{ background: previewTemplate.accentColor }} />
                    </>
                  )}
                  {previewTemplate.id === 'clean-minimal' && (
                    <div className="absolute top-0 left-0 w-[3%] h-full" style={{ background: previewTemplate.accentColor }} />
                  )}
                  {previewTemplate.id === 'nature-green' && (
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full opacity-15" style={{ background: previewTemplate.accentColor }} />
                  )}
                  {previewTemplate.id === 'academic-classic' && (
                    <div className="absolute inset-[5%] border opacity-20 rounded-lg" style={{ borderColor: previewTemplate.accentColor }} />
                  )}
                  {previewTemplate.id === 'sunset-warm' && (
                    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[90%] rounded-full opacity-25" style={{ background: previewTemplate.accentColor }} />
                  )}
                  {previewTemplate.id === 'ocean-blue' && (
                    <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[45%] rounded-full opacity-10" style={{ background: previewTemplate.accentColor }} />
                  )}
                  {previewTemplate.id === 'professional-gray' && (
                    <div className="absolute bottom-0 left-0 right-0 h-[12%]" style={{ background: '#27272a' }} />
                  )}
                </div>
                
                {/* Sample content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-10">
                  <div className="text-left">
                    <div 
                      className="text-2xl font-bold mb-2" 
                      style={{ color: previewTemplate.id === 'clean-minimal' ? '#0f172a' : '#ffffff' }}
                    >
                      {previewTemplate.name}
                    </div>
                    <div 
                      className="text-sm opacity-70"
                      style={{ color: previewTemplate.id === 'clean-minimal' ? '#475569' : '#ffffff' }}
                    >
                      {previewTemplate.description}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1,2,3,4].map(i => (
                      <div 
                        key={i} 
                        className="h-2 rounded-full flex-1 opacity-30"
                        style={{ background: previewTemplate.accentColor }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-slate-300 mb-6">{previewTemplate.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  Included Layouts
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {previewTemplate.layouts.map((layout) => (
                    <div
                      key={layout}
                      className="p-3 bg-white/5 rounded-lg text-center text-sm text-slate-300"
                    >
                      {layout}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {previewTemplate.tags.map((tag) => (
                  <Badge key={tag} className="bg-primary-500/20 text-primary-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setPreviewTemplate(null)}
                className="bg-white/5 border-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (previewTemplate.isPremium) {
                    onUpgrade();
                  } else {
                    onSelectTemplate(previewTemplate.id);
                  }
                  setPreviewTemplate(null);
                }}
                className="bg-gradient-to-r from-primary-500 to-accent-500"
              >
                {previewTemplate.isPremium ? (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Use
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Use This Template
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
