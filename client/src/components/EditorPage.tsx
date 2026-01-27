import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layout, 
  Presentation, 
  Settings, 
  Download, 
  Share2, 
  Play, 
  Plus, 
  Trash2, 
  Type, 
  Image as ImageIcon, 
  Palette,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Slide {
  id: string;
  title: string;
  content: string;
  type: "title" | "content" | "image";
}

interface EditorPageProps {
  onLogout: () => void;
}

export function EditorPage({ onLogout }: EditorPageProps) {
  const [slides, setSlides] = useState<Slide[]>([
    { id: "1", title: "Introduction to Quantum Computing", content: "Understanding the fundamentals of qubits and superposition in modern research.", type: "title" },
    { id: "2", title: "Research Methodology", content: "Our team utilized a variety of testing methods including ion traps and superconducting loops to maintain coherence.", type: "content" },
    { id: "3", title: "Experimental Results", content: "The data shows a 25% increase in coherence time compared to previous industry standards.", type: "content" },
  ]);
  
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = slides[activeSlideIndex];

  const updateSlide = (field: keyof Slide, value: string) => {
    const newSlides = [...slides];
    newSlides[activeSlideIndex] = { ...activeSlide, [field]: value };
    setSlides(newSlides);
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Slide",
      content: "Add your content here...",
      type: "content"
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (activeSlideIndex >= newSlides.length) {
      setActiveSlideIndex(newSlides.length - 1);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-white/10 bg-slate-900/50">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg mb-8">
          <Presentation className="w-6 h-6 text-white" />
        </div>
        <nav className="flex flex-col gap-6">
          <button className="p-2 text-primary-400 bg-primary-400/10 rounded-lg"><Layout className="w-6 h-6" /></button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Settings className="w-6 h-6" /></button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Palette className="w-6 h-6" /></button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><User className="w-6 h-6" /></button>
        </nav>
        <div className="mt-auto">
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Slide Thumbnails Sidebar */}
      <aside className="w-64 flex flex-col border-r border-white/10 bg-slate-900/30">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Slides</h2>
          <Button variant="ghost" size="icon" onClick={addSlide} className="h-8 w-8 hover:bg-white/10">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 flex flex-col gap-4">
            {slides.map((slide, index) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSlideIndex(index)}
                className={`group relative aspect-video rounded-lg border-2 cursor-pointer transition-all duration-300 overflow-hidden bg-slate-800 ${
                  activeSlideIndex === index ? "border-primary-500 ring-2 ring-primary-500/20" : "border-white/5 hover:border-white/20"
                }`}
              >
                <div className="p-2 h-full flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500">{index + 1}</span>
                  <p className="text-[8px] font-semibold truncate text-white/80">{slide.title}</p>
                  <p className="text-[6px] line-clamp-3 text-white/40">{slide.content}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(index);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Toolbar */}
        <header className="h-14 border-b border-white/10 bg-slate-900/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400">Research Paper Project</span>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-sm font-semibold">{activeSlide.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-white/5">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-white/5">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button size="sm" className="bg-primary-600 hover:bg-primary-500">
              <Play className="w-4 h-4 mr-2" /> Present
            </Button>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Canvas Wrapper */}
          <div className="flex-1 bg-slate-950 p-12 flex items-center justify-center overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="aspect-video w-full max-w-4xl bg-white text-slate-900 shadow-2xl rounded-sm flex flex-col p-12 relative overflow-hidden"
              >
                {/* Visual accents for "futuristic" slide template */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-bl-[100px]" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent-100/50 rounded-tr-full" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-8 border-l-4 border-primary-500 pl-4">
                    {activeSlide.title}
                  </h1>
                  <div className="flex-1">
                    <p className="text-xl text-slate-600 leading-relaxed">
                      {activeSlide.content}
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-end border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                        <Presentation className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">PaperToPPT AI</span>
                    </div>
                    <span className="text-sm font-medium text-slate-400">Page {activeSlideIndex + 1}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Properties Panel */}
          <aside className="w-80 border-l border-white/10 bg-slate-900/30 p-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full bg-white/5 border border-white/10 mb-6">
                <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Slide Title</label>
                  <Input 
                    value={activeSlide.title}
                    onChange={(e) => updateSlide("title", e.target.value)}
                    className="bg-white/5 border-white/10 focus-visible:ring-primary-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Body Content</label>
                  <Textarea 
                    value={activeSlide.content}
                    onChange={(e) => updateSlide("content", e.target.value)}
                    rows={8}
                    className="bg-white/5 border-white/10 focus-visible:ring-primary-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
                    <Type className="w-4 h-4 mr-2" /> Text
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
                    <ImageIcon className="w-4 h-4 mr-2" /> Image
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="design" className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Layout Template</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Title Only", "Title & Content", "Two Columns", "Big Image"].map((layout) => (
                      <button 
                        key={layout}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 text-[10px] text-left hover:border-primary-500 transition-colors"
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Theme Colors</label>
                  <div className="flex gap-2">
                    {["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"].map((color) => (
                      <button 
                        key={color}
                        className="w-8 h-8 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </aside>
        </div>

        {/* Bottom Slide Navigator */}
        <footer className="h-12 border-t border-white/10 bg-slate-900/50 flex items-center justify-center gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={activeSlideIndex === 0}
            onClick={() => setActiveSlideIndex(i => i - 1)}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <span className="text-xs font-medium text-slate-500">
            Slide {activeSlideIndex + 1} of {slides.length}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={activeSlideIndex === slides.length - 1}
            onClick={() => setActiveSlideIndex(i => i + 1)}
            className="text-slate-400 hover:text-white"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </footer>
      </main>
    </div>
  );
}
