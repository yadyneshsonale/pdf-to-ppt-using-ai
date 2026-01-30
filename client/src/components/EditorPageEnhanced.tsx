import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Presentation, 
  Download, 
  Share2, 
  Play, 
  Plus, 
  Trash2, 
  Type, 
  ChevronLeft,
  ChevronRight,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Home,
  Move,
  FileText,
  ChevronDown,
  Loader2,
  Image,
  Video,
  Square,
  Circle,
  Triangle,
  Save,
  X,
  ArrowLeft,
  Grid3X3,
  Check,
  Undo2,
  Redo2
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type { Slide as ApiSlide } from "../services/api";
import { savePpt } from "../services/auth";
import PptxGenJS from "pptxgenjs";

// Element within a slide
interface SlideElement {
  id: string;
  type: 'title' | 'subtitle' | 'body' | 'caption' | 'image' | 'video' | 'table' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  // Media properties
  src?: string;
  // Table properties
  tableData?: string[][];
  tableRows?: number;
  tableCols?: number;
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'triangle';
  fillColor?: string;
  strokeColor?: string;
}

// Alias for backward compatibility
type TextElement = SlideElement;

// Slide with multiple text elements
interface Slide {
  id: string;
  layout: 'title' | 'title-content' | 'two-column' | 'image-text' | 'blank';
  elements: TextElement[];
  backgroundColor: string;
  backgroundGradient?: string;
}

interface EditorPageProps {
  onBack?: () => void;
  // Accept any slide format - normalizeSlides handles both API and internal formats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialSlides?: ApiSlide[] | Slide[] | any[];
  jobId?: string;
  pdfPath?: string;
  title?: string;
  selectedTemplate?: string | null;
}

// Professional template themes with backgrounds and decorative elements
const templateThemes: Record<string, {
  name: string;
  background: string;
  gradient: string;
  titleColor: string;
  bodyColor: string;
  accentColor: string;
  decorativeElements?: string; // SVG decorations
  category: string;
}> = {
  "corporate-blue": {
    name: "Corporate Blue",
    category: "Business",
    background: "#0a1628",
    gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)",
    titleColor: "#ffffff",
    bodyColor: "#94a3b8",
    accentColor: "#3b82f6",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="corp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.05" />
          </linearGradient>
        </defs>
        <circle cx="90%" cy="20%" r="200" fill="url(#corp-grad)" />
        <circle cx="10%" cy="80%" r="150" fill="url(#corp-grad)" />
        <path d="M0,100 Q50,50 100,100 L100,0 L0,0 Z" fill="#3b82f6" fill-opacity="0.05" transform="scale(10,6)" />
      </svg>
    `
  },
  "executive-gold": {
    name: "Executive Gold",
    category: "Business",
    background: "#0c0a09",
    gradient: "linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)",
    titleColor: "#fbbf24",
    bodyColor: "#d6d3d1",
    accentColor: "#f59e0b",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gold-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:0" />
            <stop offset="50%" style="stop-color:#fbbf24;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:0" />
          </linearGradient>
        </defs>
        <rect x="5%" y="88%" width="90%" height="2" fill="url(#gold-line)" />
        <rect x="70%" y="5%" width="2" height="25%" fill="#fbbf24" fill-opacity="0.3" />
        <rect x="75%" y="5%" width="2" height="15%" fill="#fbbf24" fill-opacity="0.2" />
        <circle cx="95%" cy="8%" r="60" fill="#fbbf24" fill-opacity="0.05" />
      </svg>
    `
  },
  "modern-gradient": {
    name: "Modern Gradient",
    category: "Creative",
    background: "#0f0f23",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    titleColor: "#ffffff",
    bodyColor: "#e2e8f0",
    accentColor: "#a855f7",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="mod-blob1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#a855f7;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#a855f7;stop-opacity:0" />
          </radialGradient>
          <radialGradient id="mod-blob2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ec4899;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#ec4899;stop-opacity:0" />
          </radialGradient>
        </defs>
        <ellipse cx="85%" cy="25%" rx="250" ry="200" fill="url(#mod-blob1)" />
        <ellipse cx="15%" cy="75%" rx="200" ry="180" fill="url(#mod-blob2)" />
        <circle cx="50%" cy="90%" r="300" fill="#3b82f6" fill-opacity="0.08" />
      </svg>
    `
  },
  "tech-startup": {
    name: "Tech Startup",
    category: "Technology",
    background: "#030712",
    gradient: "linear-gradient(180deg, #0f172a 0%, #030712 100%)",
    titleColor: "#22d3ee",
    bodyColor: "#94a3b8",
    accentColor: "#06b6d4",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" stroke-width="0.5" stroke-opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="80%" cy="30%" r="180" fill="#22d3ee" fill-opacity="0.05" />
        <circle cx="20%" cy="70%" r="120" fill="#06b6d4" fill-opacity="0.05" />
        <line x1="0" y1="85%" x2="30%" y2="85%" stroke="#22d3ee" stroke-width="3" stroke-opacity="0.3" />
      </svg>
    `
  },
  "clean-minimal": {
    name: "Clean Minimal",
    category: "Minimal",
    background: "#ffffff",
    gradient: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    titleColor: "#0f172a",
    bodyColor: "#475569",
    accentColor: "#3b82f6",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="8" height="100%" fill="#3b82f6" />
        <circle cx="95%" cy="10%" r="80" fill="#3b82f6" fill-opacity="0.05" />
        <circle cx="92%" cy="15%" r="40" fill="#3b82f6" fill-opacity="0.08" />
      </svg>
    `
  },
  "nature-green": {
    name: "Nature Green",
    category: "Creative",
    background: "#052e16",
    gradient: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)",
    titleColor: "#86efac",
    bodyColor: "#bbf7d0",
    accentColor: "#22c55e",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="leaf-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#22c55e;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#22c55e;stop-opacity:0" />
          </radialGradient>
        </defs>
        <ellipse cx="90%" cy="85%" rx="300" ry="200" fill="url(#leaf-glow)" />
        <path d="M 0 100 Q 25 80 50 100 T 100 100 L 100 120 L 0 120 Z" fill="#22c55e" fill-opacity="0.1" transform="scale(10, 5) translate(0, -2)" />
      </svg>
    `
  },
  "academic-classic": {
    name: "Academic Classic",
    category: "Education",
    background: "#1e1b4b",
    gradient: "linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)",
    titleColor: "#e0e7ff",
    bodyColor: "#c7d2fe",
    accentColor: "#818cf8",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <rect x="3%" y="3%" width="94%" height="94%" fill="none" stroke="#818cf8" stroke-width="1" stroke-opacity="0.2" rx="8" />
        <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#818cf8" stroke-width="0.5" stroke-opacity="0.1" rx="6" />
        <circle cx="8%" cy="8%" r="30" fill="#818cf8" fill-opacity="0.1" />
        <circle cx="92%" cy="92%" r="30" fill="#818cf8" fill-opacity="0.1" />
      </svg>
    `
  },
  "sunset-warm": {
    name: "Sunset Warm",
    category: "Creative",
    background: "#1c1917",
    gradient: "linear-gradient(135deg, #7c2d12 0%, #1c1917 60%, #1c1917 100%)",
    titleColor: "#fed7aa",
    bodyColor: "#d6d3d1",
    accentColor: "#f97316",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="sun-glow" cx="0%" cy="0%" r="70%">
            <stop offset="0%" style="stop-color:#f97316;stop-opacity:0.3" />
            <stop offset="50%" style="stop-color:#ea580c;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#f97316;stop-opacity:0" />
          </radialGradient>
        </defs>
        <ellipse cx="0%" cy="0%" rx="600" ry="400" fill="url(#sun-glow)" />
        <circle cx="5%" cy="5%" r="100" fill="#f97316" fill-opacity="0.15" />
      </svg>
    `
  },
  "ocean-blue": {
    name: "Ocean Blue",
    category: "Creative",
    background: "#082f49",
    gradient: "linear-gradient(180deg, #0c4a6e 0%, #082f49 60%, #0c4a6e 100%)",
    titleColor: "#7dd3fc",
    bodyColor: "#bae6fd",
    accentColor: "#0ea5e9",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:0" />
          </linearGradient>
        </defs>
        <path d="M0,80 C150,120 350,40 500,80 C650,120 850,40 1000,80 L1000,0 L0,0 Z" fill="url(#wave-grad)" transform="scale(1, 0.5)" />
        <ellipse cx="85%" cy="75%" rx="200" ry="150" fill="#0ea5e9" fill-opacity="0.08" />
      </svg>
    `
  },
  "professional-gray": {
    name: "Professional Gray",
    category: "Business",
    background: "#18181b",
    gradient: "linear-gradient(135deg, #27272a 0%, #18181b 100%)",
    titleColor: "#fafafa",
    bodyColor: "#a1a1aa",
    accentColor: "#71717a",
    decorativeElements: `
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="92%" width="100%" height="8%" fill="#27272a" />
        <line x1="5%" y1="95%" x2="25%" y2="95%" stroke="#71717a" stroke-width="2" />
        <rect x="85%" y="5%" width="10%" height="3" fill="#52525b" fill-opacity="0.5" />
        <rect x="85%" y="9%" width="7%" height="3" fill="#52525b" fill-opacity="0.3" />
      </svg>
    `
  }
};

const fontFamilies = [
  { name: 'Sans Serif', value: 'Inter, system-ui, sans-serif' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Mono', value: 'JetBrains Mono, monospace' },
  { name: 'Display', value: 'Poppins, sans-serif' },
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

/**
 * Check if slides are already in internal editor format (have elements array)
 */
/**
 * Check if slides are already in internal editor format (have elements array with actual elements)
 * API-normalized slides have empty elements array, so we need to check for elements with content
 */
function isInternalSlideFormat(slides: unknown[]): slides is Slide[] {
  if (!slides || slides.length === 0) return false;
  const firstSlide = slides[0] as Record<string, unknown>;
  const elements = firstSlide?.elements;
  // Check if elements is an array with at least one element (not just empty array)
  const hasElements = Array.isArray(elements) && elements.length > 0;
  console.log('isInternalSlideFormat check:', { hasElements, elementsLength: Array.isArray(elements) ? elements.length : 'not array', firstSlide });
  return hasElements;
}

/**
 * Convert API slides to editor format with text elements
 * Also handles already-normalized slides (from saved projects)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSlides(apiSlides?: any[], templateId?: string | null): Slide[] {
  const theme = templateThemes[templateId || 'corporate-blue'] || templateThemes['corporate-blue'];
  
  console.log('normalizeSlides called with:', { 
    slidesCount: apiSlides?.length, 
    templateId,
    firstSlide: apiSlides?.[0]
  });
  
  if (!apiSlides || apiSlides.length === 0) {
    console.log('No slides provided, creating default slide');
    return [{
      id: 'slide-1',
      layout: 'title',
      backgroundColor: theme.background,
      backgroundGradient: theme.gradient,
      elements: [
        {
          id: 'title-1',
          type: 'title',
          content: 'Your Presentation Title',
          x: 10,
          y: 35,
          width: 80,
          height: 15,
          fontSize: 48,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 'bold',
          fontStyle: 'normal',
          textAlign: 'center',
          color: theme.titleColor
        },
        {
          id: 'subtitle-1',
          type: 'subtitle',
          content: 'Click to add subtitle',
          x: 15,
          y: 55,
          width: 70,
          height: 8,
          fontSize: 24,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'center',
          color: theme.bodyColor
        }
      ]
    }];
  }

  // If slides are already in internal format (from saved project), use them directly
  if (isInternalSlideFormat(apiSlides)) {
    console.log('Using internal format slides directly');
    return apiSlides;
  }

  console.log('Converting API slides to internal format');
  // Convert API slides to internal format
  // Handle both new format (slide_title) and legacy format (title)
  return apiSlides.map((slide: any, index: number) => {
    // Handle both slide_title (new API format) and title (legacy format)
    const slideTitle = slide.slide_title || slide.title || `Slide ${index + 1}`;
    // Handle both paper_title (snake_case) and paperTitle (camelCase)
    const paperTitle = slide.paper_title || slide.paperTitle;
    const authors = slide.authors;
    const content = slide.content || 'Add your content here...';

    console.log(`Processing slide ${index + 1}:`, { slideTitle, content: content.substring(0, 50) });

    return {
      id: slide.id || `slide-${index + 1}`,
      layout: (index === 0 ? 'title' : 'title-content') as Slide['layout'],
      backgroundColor: theme.background,
      backgroundGradient: theme.gradient,
      elements: [
        {
          id: `title-${index + 1}`,
          type: 'title' as const,
          content: slideTitle,
          x: 5,
          y: 5,
          width: 90,
          height: 12,
          fontSize: index === 0 ? 42 : 32,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 'bold' as const,
          fontStyle: 'normal' as const,
          textAlign: (index === 0 ? 'center' : 'left') as TextElement['textAlign'],
          color: theme.titleColor
        },
        ...(paperTitle && index === 0 ? [{
          id: `paper-title-${index + 1}`,
          type: 'subtitle' as const,
          content: paperTitle,
          x: 10,
          y: 45,
          width: 80,
          height: 8,
          fontSize: 20,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 'normal' as const,
          fontStyle: 'normal' as const,
          textAlign: 'center' as const,
          color: theme.bodyColor
        }] : []),
        ...(authors && index === 0 ? [{
          id: `authors-${index + 1}`,
          type: 'caption' as const,
          content: authors,
          x: 10,
          y: 55,
          width: 80,
          height: 6,
          fontSize: 16,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 'normal' as const,
          fontStyle: 'italic' as const,
          textAlign: 'center' as const,
          color: theme.bodyColor
        }] : []),
        {
          id: `body-${index + 1}`,
          type: 'body' as const,
          content: content,
          x: 5,
          y: index === 0 ? 65 : 18,
          width: 90,
          height: index === 0 ? 30 : 75,
          fontSize: 16,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 'normal' as const,
          fontStyle: 'normal' as const,
          textAlign: 'left' as const,
          color: theme.bodyColor
        }
      ]
    };
  });
}

export function EditorPageEnhanced({ 
  onBack,
  initialSlides, 
  // jobId and pdfPath available for future use 
  title, 
  selectedTemplate 
}: EditorPageProps) {
  const [slides, setSlides] = useState<Slide[]>(() => normalizeSlides(initialSlides, selectedTemplate));
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [presentationTitle, setPresentationTitle] = useState(title || "Untitled Presentation");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(selectedTemplate || 'corporate-blue');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // Undo/Redo history
  const [history, setHistory] = useState<Slide[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);
  
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const themeSelectorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Track slide changes for undo/redo
  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    
    // Add current state to history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(slides)));
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [slides]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSlides(JSON.parse(JSON.stringify(history[newIndex])));
    }
  }, [historyIndex, history]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSlides(JSON.parse(JSON.stringify(history[newIndex])));
    }
  }, [historyIndex, history]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
      if (themeSelectorRef.current && !themeSelectorRef.current.contains(event.target as Node)) {
        setShowThemeSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts for delete/backspace
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElementId) {
        event.preventDefault();
        deleteElement();
      }
      
      // Undo: Ctrl+Z or Cmd+Z
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      
      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y
      if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        redo();
      }
      
      // Escape to exit presentation mode
      if (event.key === 'Escape' && isPresentationMode) {
        setIsPresentationMode(false);
      }
      
      // Arrow keys for slide navigation in presentation mode
      if (isPresentationMode) {
        if (event.key === 'ArrowRight' || event.key === ' ') {
          event.preventDefault();
          if (activeSlideIndex < slides.length - 1) {
            setActiveSlideIndex(i => i + 1);
          }
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          if (activeSlideIndex > 0) {
            setActiveSlideIndex(i => i - 1);
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, isPresentationMode, activeSlideIndex, slides.length]);
  const activeSlide = slides[activeSlideIndex];
  const selectedElement = activeSlide?.elements.find(el => el.id === selectedElementId);
  const theme = templateThemes[currentTheme] || templateThemes['corporate-blue'];

  // Apply theme to all slides
  const applyTheme = useCallback((themeId: string) => {
    const newTheme = templateThemes[themeId];
    if (!newTheme) return;
    
    setCurrentTheme(themeId);
    setSlides(prev => prev.map(slide => ({
      ...slide,
      backgroundColor: newTheme.background,
      backgroundGradient: newTheme.gradient,
      elements: slide.elements.map(el => ({
        ...el,
        color: el.type === 'title' ? newTheme.titleColor : newTheme.bodyColor
      }))
    })));
    setShowThemeSelector(false);
  }, []);

  // Save project to backend database
  const saveProject = useCallback(async () => {
    setIsSaving(true);
    try {
      const projectData = {
        title: presentationTitle,
        slideJson: {
          slides,
          theme: currentTheme,
          savedAt: new Date().toISOString()
        },
        templateId: currentTheme,
      };
      await savePpt(projectData);
      setSaveMessage('Saved!');
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (error) {
      console.error('Error saving project:', error);
      setSaveMessage('Failed to save');
      setTimeout(() => setSaveMessage(null), 2000);
    } finally {
      setIsSaving(false);
    }
  }, [presentationTitle, slides, currentTheme]);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newElement: SlideElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        content: '',
        src: imageUrl,
        x: 20,
        y: 30,
        width: 40,
        height: 40,
        fontSize: 16,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'center',
        color: theme.bodyColor
      };
      setSlides(prev => prev.map((slide, idx) => 
        idx === activeSlideIndex 
          ? { ...slide, elements: [...slide.elements, newElement] }
          : slide
      ));
      setSelectedElementId(newElement.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [activeSlideIndex, theme]);

  // Handle video upload
  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const videoUrl = URL.createObjectURL(file);
    const newElement: SlideElement = {
      id: `video-${Date.now()}`,
      type: 'video',
      content: '',
      src: videoUrl,
      x: 20,
      y: 30,
      width: 50,
      height: 40,
      fontSize: 16,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      color: theme.bodyColor
    };
    setSlides(prev => prev.map((slide, idx) => 
      idx === activeSlideIndex 
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    ));
    setSelectedElementId(newElement.id);
    e.target.value = '';
  }, [activeSlideIndex, theme]);

  // Add table element
  const addTable = useCallback((rows: number = 3, cols: number = 3) => {
    const tableData = Array(rows).fill(null).map(() => Array(cols).fill(''));
    const newElement: SlideElement = {
      id: `table-${Date.now()}`,
      type: 'table',
      content: '',
      x: 15,
      y: 30,
      width: 70,
      height: 40,
      fontSize: 14,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      color: theme.bodyColor,
      tableData,
      tableRows: rows,
      tableCols: cols
    };
    setSlides(prev => prev.map((slide, idx) => 
      idx === activeSlideIndex 
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    ));
    setSelectedElementId(newElement.id);
  }, [activeSlideIndex, theme]);

  // Add shape element
  const addShape = useCallback((shapeType: 'rectangle' | 'circle' | 'triangle') => {
    const newElement: SlideElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      content: '',
      x: 30,
      y: 30,
      width: 20,
      height: 20,
      fontSize: 16,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      color: theme.bodyColor,
      shapeType,
      fillColor: theme.accentColor,
      strokeColor: theme.titleColor
    };
    setSlides(prev => prev.map((slide, idx) => 
      idx === activeSlideIndex 
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    ));
    setSelectedElementId(newElement.id);
  }, [activeSlideIndex, theme]);

  // Update table cell
  const updateTableCell = useCallback((elementId: string, rowIndex: number, colIndex: number, value: string) => {
    setSlides(prev => prev.map((slide, idx) => 
      idx === activeSlideIndex 
        ? {
            ...slide,
            elements: slide.elements.map(el => {
              if (el.id === elementId && el.tableData) {
                const newTableData = el.tableData.map((row, rIdx) => 
                  rIdx === rowIndex 
                    ? row.map((cell, cIdx) => cIdx === colIndex ? value : cell)
                    : row
                );
                return { ...el, tableData: newTableData };
              }
              return el;
            })
          }
        : slide
    ));
  }, [activeSlideIndex]);

  // Start presentation mode
  const startPresentation = useCallback(() => {
    setIsPresentationMode(true);
    // Try to go fullscreen
    document.documentElement.requestFullscreen?.().catch(() => {
      // Fullscreen might be blocked, continue anyway
    });
  }, []);

  // Exit presentation mode
  const exitPresentation = useCallback(() => {
    setIsPresentationMode(false);
    document.exitFullscreen?.().catch(() => {});
  }, []);

  // Update element property
  const updateElement = useCallback((elementId: string, updates: Partial<TextElement>) => {
    setSlides(prev => prev.map((slide, idx) => 
      idx === activeSlideIndex 
        ? {
            ...slide,
            elements: slide.elements.map(el => 
              el.id === elementId ? { ...el, ...updates } : el
            )
          }
        : slide
    ));
  }, [activeSlideIndex]);

  // Add new text element
  const addTextElement = useCallback((type: TextElement['type']) => {
    const newElement: TextElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: type === 'title' ? 'New Title' : type === 'subtitle' ? 'New Subtitle' : 'Add text here...',
      x: 10,
      y: 40,
      width: 80,
      height: type === 'title' ? 12 : type === 'body' ? 40 : 8,
      fontSize: type === 'title' ? 36 : type === 'subtitle' ? 24 : 18,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: type === 'title' ? 'bold' : 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: type === 'title' ? theme.titleColor : theme.bodyColor
    };

    setSlides(prev => prev.map((slide, idx) => 
      idx === activeSlideIndex 
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    ));
    setSelectedElementId(newElement.id);
  }, [activeSlideIndex, theme]);

  // Delete selected element
  const deleteElement = useCallback(() => {
    if (!selectedElementId) return;
    setSlides(prev => prev.map((slide, idx) => 
      idx === activeSlideIndex 
        ? { ...slide, elements: slide.elements.filter(el => el.id !== selectedElementId) }
        : slide
    ));
    setSelectedElementId(null);
  }, [activeSlideIndex, selectedElementId]);

  // Add new slide
  const addSlide = useCallback(() => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      layout: 'title-content',
      backgroundColor: theme.background,
      backgroundGradient: theme.gradient,
      elements: [
        {
          id: `title-${Date.now()}`,
          type: 'title',
          content: 'New Slide',
          x: 5,
          y: 5,
          width: 90,
          height: 12,
          fontSize: 32,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 'bold',
          fontStyle: 'normal',
          textAlign: 'left',
          color: theme.titleColor
        },
        {
          id: `body-${Date.now()}`,
          type: 'body',
          content: 'Add your content here...',
          x: 5,
          y: 20,
          width: 90,
          height: 70,
          fontSize: 18,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'left',
          color: theme.bodyColor
        }
      ]
    };
    setSlides(prev => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  }, [slides.length, theme]);

  // Delete slide
  const deleteSlide = useCallback((index: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== index));
    if (activeSlideIndex >= slides.length - 1) {
      setActiveSlideIndex(slides.length - 2);
    }
  }, [slides.length, activeSlideIndex]);

  // Handle element drag
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const element = activeSlide.elements.find(el => el.id === elementId);
      if (element) {
        const elementX = (element.x / 100) * rect.width;
        const elementY = (element.y / 100) * rect.height;
        setDragOffset({
          x: e.clientX - rect.left - elementX,
          y: e.clientY - rect.top - elementY
        });
        setIsDragging(true);
      }
    }
  }, [activeSlide]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    updateElement(selectedElementId, {
      x: Math.max(0, Math.min(95, x)),
      y: Math.max(0, Math.min(95, y))
    });
  }, [isDragging, selectedElementId, dragOffset, updateElement]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Export as PPTX using pptxgenjs
  const exportAsPptx = useCallback(async () => {
    setIsExporting(true);
    try {
      const pptx = new PptxGenJS();
      pptx.title = presentationTitle;
      pptx.author = "PaperToPPT";
      
      // Set slide size (16:9 widescreen)
      pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
      pptx.layout = 'CUSTOM';

      slides.forEach((slide) => {
        const pptSlide = pptx.addSlide();
        
        // Set background
        if (slide.backgroundGradient) {
          // Use solid color as fallback (pptxgenjs gradient support is limited)
          pptSlide.background = { color: slide.backgroundColor.replace('#', '') };
        } else {
          pptSlide.background = { color: slide.backgroundColor.replace('#', '') };
        }

        // Add decorative shapes based on template
        const templateKey = selectedTemplate || 'corporate-blue';
        if (templateKey === 'corporate-blue') {
          pptSlide.addShape('ellipse', { x: 7.5, y: 0.5, w: 2.5, h: 2, fill: { color: '3b82f6', transparency: 90 } });
          pptSlide.addShape('ellipse', { x: 0, y: 3.5, w: 2, h: 1.8, fill: { color: '3b82f6', transparency: 90 } });
        } else if (templateKey === 'executive-gold') {
          pptSlide.addShape('rect', { x: 0.5, y: 5, w: 9, h: 0.08, fill: { color: 'fbbf24', transparency: 50 } });
          pptSlide.addShape('rect', { x: 7, y: 0.3, w: 0.05, h: 1.4, fill: { color: 'fbbf24', transparency: 70 } });
          pptSlide.addShape('ellipse', { x: 8.5, y: 0.2, w: 1.2, h: 1, fill: { color: 'fbbf24', transparency: 95 } });
        } else if (templateKey === 'modern-gradient') {
          pptSlide.addShape('ellipse', { x: 6.5, y: 0, w: 4, h: 3, fill: { color: 'a855f7', transparency: 85 } });
          pptSlide.addShape('ellipse', { x: 0, y: 3, w: 3.5, h: 2.5, fill: { color: 'ec4899', transparency: 88 } });
        } else if (templateKey === 'tech-startup') {
          pptSlide.addShape('ellipse', { x: 6.5, y: 1, w: 3, h: 2.5, fill: { color: '22d3ee', transparency: 95 } });
          pptSlide.addShape('rect', { x: 0, y: 4.8, w: 3, h: 0.08, fill: { color: '22d3ee', transparency: 70 } });
        } else if (templateKey === 'clean-minimal') {
          pptSlide.addShape('rect', { x: 0, y: 0, w: 0.15, h: 5.625, fill: { color: '3b82f6' } });
          pptSlide.addShape('ellipse', { x: 8.5, y: 0.3, w: 1.5, h: 1.2, fill: { color: '3b82f6', transparency: 95 } });
        } else if (templateKey === 'nature-green') {
          pptSlide.addShape('ellipse', { x: 7, y: 3.5, w: 4, h: 3, fill: { color: '22c55e', transparency: 88 } });
        } else if (templateKey === 'academic-classic') {
          pptSlide.addShape('rect', { x: 0.3, y: 0.17, w: 9.4, h: 5.3, line: { color: '818cf8', width: 0.5, transparency: 80 }, fill: { type: 'none' } });
          pptSlide.addShape('ellipse', { x: 0.5, y: 0.3, w: 0.6, h: 0.5, fill: { color: '818cf8', transparency: 90 } });
          pptSlide.addShape('ellipse', { x: 8.9, y: 4.8, w: 0.6, h: 0.5, fill: { color: '818cf8', transparency: 90 } });
        } else if (templateKey === 'sunset-warm') {
          pptSlide.addShape('ellipse', { x: -1, y: -1, w: 5, h: 4, fill: { color: 'f97316', transparency: 75 } });
          pptSlide.addShape('ellipse', { x: 0, y: 0, w: 2, h: 1.8, fill: { color: 'f97316', transparency: 85 } });
        } else if (templateKey === 'ocean-blue') {
          pptSlide.addShape('ellipse', { x: 7, y: 3.5, w: 3.5, h: 2.5, fill: { color: '0ea5e9', transparency: 92 } });
        }

        // Add elements
        slide.elements.forEach((element) => {
          const x = (element.x / 100) * 10; // Convert % to inches
          const y = (element.y / 100) * 5.625;
          const w = (element.width / 100) * 10;
          const h = Math.max((element.height / 100) * 5.625, 0.5);

          pptSlide.addText(element.content, {
            x: x,
            y: y,
            w: w,
            h: h,
            fontSize: Math.round(element.fontSize * 0.75), // Convert px to pt
            fontFace: element.fontFamily.split(',')[0].trim(),
            color: element.color.replace('#', ''),
            bold: element.fontWeight === 'bold',
            italic: element.fontStyle === 'italic',
            align: element.textAlign,
            valign: 'top',
            wrap: true,
          });
        });
      });

      await pptx.writeFile({ fileName: `${presentationTitle.replace(/\s+/g, '_')}.pptx` });
    } catch (error) {
      console.error('Error exporting PPTX:', error);
      alert('Failed to export PPTX. Please try again.');
    } finally {
      setIsExporting(false);
      setShowExportDropdown(false);
    }
  }, [presentationTitle, slides]);

  // Export as PDF - uses browser print functionality
  const exportAsPdf = useCallback(() => {
    setIsExporting(true);
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to export PDF');
      setIsExporting(false);
      return;
    }

    const slidesHtml = slides.map((slide, index) => `
      <div class="slide" style="
        width: 100%;
        aspect-ratio: 16/9;
        background: ${slide.backgroundGradient || slide.backgroundColor};
        position: relative;
        page-break-after: always;
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
      ">
        ${theme.decorativeElements || ''}
        ${slide.elements.map(el => `
          <div style="
            position: absolute;
            left: ${el.x}%;
            top: ${el.y}%;
            width: ${el.width}%;
            min-height: ${el.height}%;
            color: ${el.color};
            font-size: ${el.fontSize}px;
            font-family: ${el.fontFamily};
            font-weight: ${el.fontWeight};
            font-style: ${el.fontStyle};
            text-align: ${el.textAlign};
            line-height: 1.4;
            white-space: pre-wrap;
            z-index: 1;
          ">${el.content.replace(/\n/g, '<br>')}</div>
        `).join('')}
        <div style="position: absolute; bottom: 10px; right: 15px; color: rgba(255,255,255,0.4); font-size: 12px;">
          ${index + 1} / ${slides.length}
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${presentationTitle}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Inter, system-ui, sans-serif;
              background: #1e293b;
              padding: 20px;
            }
            .slide {
              box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }
            @media print {
              body { background: white; padding: 0; }
              .slide { 
                box-shadow: none; 
                margin-bottom: 0;
                height: 100vh;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <div style="max-width: 1000px; margin: 0 auto;">
            ${slidesHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    setIsExporting(false);
    setShowExportDropdown(false);
  }, [presentationTitle, slides]);

  return (
    <div 
      className="flex h-screen bg-slate-950 text-white overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Sidebar - Slides Panel */}
      <aside className="w-56 flex flex-col border-r border-white/10 bg-slate-900/50">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 text-slate-400" />
              </button>
            )}
            <h2 className="font-semibold text-sm text-slate-300">Slides</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={addSlide} className="h-8 w-8 hover:bg-white/10">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-3 flex flex-col gap-3">
            {slides.map((slide, index) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setActiveSlideIndex(index);
                  setSelectedElementId(null);
                }}
                className={`group relative aspect-video rounded-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                  activeSlideIndex === index 
                    ? "border-primary-500 ring-2 ring-primary-500/30" 
                    : "border-white/10 hover:border-white/30"
                }`}
                style={{ 
                  background: slide.backgroundGradient || slide.backgroundColor 
                }}
              >
                {/* Decorative elements in thumbnail */}
                {theme.decorativeElements && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-50"
                    dangerouslySetInnerHTML={{ __html: theme.decorativeElements }}
                  />
                )}
                
                {/* Mini slide preview */}
                <div className="absolute inset-0 p-1.5 overflow-hidden">
                  {slide.elements.map(el => (
                    <div
                      key={el.id}
                      className="truncate leading-tight"
                      style={{
                        position: 'absolute',
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: `${el.width}%`,
                        color: el.color,
                        fontWeight: el.fontWeight,
                        fontSize: el.type === 'title' ? '7px' : '5px',
                        opacity: el.type === 'body' ? 0.7 : 1,
                      }}
                    >
                      {el.content.slice(0, el.type === 'title' ? 40 : 60)}
                    </div>
                  ))}
                </div>
                
                {/* Slide number badge */}
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 rounded text-[10px] font-medium">
                  {index + 1}
                </div>
                
                {/* Delete button */}
                {slides.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(index);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoUpload}
        />

        {/* Top Toolbar */}
        <header className="h-14 border-b border-white/10 bg-slate-900/30 flex items-center justify-between px-4 gap-4">
          {/* Back & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Home
            </Button>
            <div className="w-px h-6 bg-white/10" />
            <div className="p-1.5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
              <Presentation className="w-4 h-4 text-white" />
            </div>
            <Input
              value={presentationTitle}
              onChange={(e) => setPresentationTitle(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-white w-48 hover:bg-white/5 focus:bg-white/10"
            />
            <div className="w-px h-6 bg-white/10" />
            {/* Undo/Redo Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Formatting Toolbar */}
          {selectedElement && (
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button 
                onClick={() => updateElement(selectedElementId!, { 
                  fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
                })}
                className={`p-2 rounded hover:bg-white/10 ${selectedElement.fontWeight === 'bold' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                onClick={() => updateElement(selectedElementId!, { 
                  fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
                })}
                className={`p-2 rounded hover:bg-white/10 ${selectedElement.fontStyle === 'italic' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button 
                onClick={() => updateElement(selectedElementId!, { textAlign: 'left' })}
                className={`p-2 rounded hover:bg-white/10 ${selectedElement.textAlign === 'left' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => updateElement(selectedElementId!, { textAlign: 'center' })}
                className={`p-2 rounded hover:bg-white/10 ${selectedElement.textAlign === 'center' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button 
                onClick={() => updateElement(selectedElementId!, { textAlign: 'right' })}
                className={`p-2 rounded hover:bg-white/10 ${selectedElement.textAlign === 'right' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <select 
                value={selectedElement.fontSize}
                onChange={(e) => updateElement(selectedElementId!, { fontSize: Number(e.target.value) })}
                className="bg-white/10 border-none rounded px-2 py-1.5 text-sm text-white"
              >
                {fontSizes.map(size => (
                  <option key={size} value={size} className="bg-slate-800">{size}px</option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Save Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={saveProject}
              disabled={isSaving}
              className="text-slate-300 hover:bg-white/5"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saveMessage ? (
                <Check className="w-4 h-4 mr-2 text-green-400" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saveMessage || 'Save'}
            </Button>
            
            <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-white/5">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            
            {/* Export Dropdown */}
            <div ref={exportDropdownRef} className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowExportDropdown(!showExportDropdown)} 
                className="text-slate-300 hover:bg-white/5"
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
              </Button>
              
              {showExportDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button
                    onClick={exportAsPptx}
                    disabled={isExporting}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left disabled:opacity-50"
                  >
                    <Presentation className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-sm font-medium text-white">PowerPoint</p>
                      <p className="text-xs text-slate-400">.pptx file</p>
                    </div>
                  </button>
                  <div className="border-t border-white/10" />
                  <button
                    onClick={exportAsPdf}
                    disabled={isExporting}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left disabled:opacity-50"
                  >
                    <FileText className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-sm font-medium text-white">PDF Document</p>
                      <p className="text-xs text-slate-400">.pdf file</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </div>
            
            <Button 
              size="sm" 
              onClick={startPresentation}
              className="bg-primary-600 hover:bg-primary-500"
            >
              <Play className="w-4 h-4 mr-2" /> Present
            </Button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-950 p-8 flex items-center justify-center overflow-auto">
          <div
            ref={canvasRef}
            className="relative aspect-video w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden cursor-default"
            style={{ 
              background: activeSlide?.backgroundGradient || activeSlide?.backgroundColor || '#1e293b'
            }}
            onClick={() => setSelectedElementId(null)}
          >
            {/* Decorative SVG Background Elements */}
            {theme.decorativeElements && (
              <div 
                className="absolute inset-0 pointer-events-none z-0"
                dangerouslySetInnerHTML={{ __html: theme.decorativeElements }}
              />
            )}
            
            {/* Slide Elements */}
            {activeSlide?.elements.map((element) => (
              <div
                key={element.id}
                className={`absolute group cursor-move transition-shadow ${
                  selectedElementId === element.id 
                    ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-transparent' 
                    : 'hover:ring-1 hover:ring-white/30'
                }`}
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  width: `${element.width}%`,
                  minHeight: `${element.height}%`,
                  maxHeight: element.type === 'body' ? '75%' : `${element.height + 10}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle */}
                {selectedElementId === element.id && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary-500 rounded px-2 py-0.5">
                    <Move className="w-3 h-3 text-white" />
                    <span className="text-[10px] text-white font-medium">{element.type}</span>
                  </div>
                )}
                
                {/* Render based on element type */}
                {element.type === 'image' && element.src && (
                  <img 
                    src={element.src} 
                    alt="" 
                    className="w-full h-full object-contain"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(element.id);
                    }}
                  />
                )}
                
                {element.type === 'video' && element.src && (
                  <video 
                    src={element.src} 
                    controls 
                    className="w-full h-full object-contain"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(element.id);
                    }}
                  />
                )}
                
                {element.type === 'table' && element.tableData && (
                  <table 
                    className="w-full h-full border-collapse"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(element.id);
                    }}
                  >
                    <tbody>
                      {element.tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td 
                              key={colIndex}
                              className="border border-white/20 p-1"
                              style={{ color: element.color, fontSize: `${element.fontSize}px` }}
                            >
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) => updateTableCell(element.id, rowIndex, colIndex, e.target.value)}
                                className="w-full bg-transparent text-center focus:outline-none focus:bg-white/10"
                                style={{ color: element.color }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                
                {element.type === 'shape' && (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(element.id);
                    }}
                  >
                    {element.shapeType === 'rectangle' && (
                      <div 
                        className="w-full h-full rounded-lg"
                        style={{ backgroundColor: element.fillColor, border: `2px solid ${element.strokeColor}` }}
                      />
                    )}
                    {element.shapeType === 'circle' && (
                      <div 
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: element.fillColor, border: `2px solid ${element.strokeColor}` }}
                      />
                    )}
                    {element.shapeType === 'triangle' && (
                      <div 
                        className="w-0 h-0"
                        style={{ 
                          borderLeft: '50px solid transparent',
                          borderRight: '50px solid transparent',
                          borderBottom: `80px solid ${element.fillColor}`
                        }}
                      />
                    )}
                  </div>
                )}
                
                {/* Editable text area - for text elements only */}
                {['title', 'subtitle', 'body', 'caption'].includes(element.type) && (
                  <textarea
                    value={element.content}
                    onChange={(e) => updateElement(element.id, { content: e.target.value })}
                    className="w-full h-full bg-transparent resize-none focus:outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
                    style={{
                      color: element.color,
                      fontSize: `${element.fontSize}px`,
                      fontFamily: element.fontFamily,
                      fontWeight: element.fontWeight,
                      fontStyle: element.fontStyle,
                      textAlign: element.textAlign,
                      lineHeight: 1.5,
                      minHeight: element.type === 'body' ? '150px' : 'auto',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(element.id);
                    }}
                  />
                )}

                {/* Resize handles */}
                {selectedElementId === element.id && (
                  <>
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-primary-500 rounded cursor-ew-resize" />
                    <div className="absolute right-1/2 -bottom-1 translate-x-1/2 w-6 h-2 bg-primary-500 rounded cursor-ns-resize" />
                  </>
                )}
              </div>
            ))}

            {/* Branding */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                <Presentation className="w-3 h-3 text-white/60" />
              </div>
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">PaperToPPT</span>
            </div>
            
            {/* Page number */}
            <div className="absolute bottom-4 right-4 text-sm font-medium text-white/40">
              {activeSlideIndex + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <footer className="h-12 border-t border-white/10 bg-slate-900/30 flex items-center justify-center gap-4">
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

      {/* Right Sidebar - Properties Panel */}
      <aside className="w-72 border-l border-white/10 bg-slate-900/30 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold text-sm text-slate-300">
            {selectedElement ? 'Element Properties' : 'Slide Properties'}
          </h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {selectedElement ? (
              <>
                {/* Text Content */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Content</label>
                  <Textarea 
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElementId!, { content: e.target.value })}
                    rows={4}
                    className="bg-white/5 border-white/10 focus-visible:ring-primary-500 resize-none text-sm"
                  />
                </div>

                {/* Font Settings */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Typography</label>
                  <select
                    value={selectedElement.fontFamily}
                    onChange={(e) => updateElement(selectedElementId!, { fontFamily: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {fontFamilies.map(font => (
                      <option key={font.value} value={font.value} className="bg-slate-800">
                        {font.name}
                      </option>
                    ))}
                  </select>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Size</label>
                      <select
                        value={selectedElement.fontSize}
                        onChange={(e) => updateElement(selectedElementId!, { fontSize: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        {fontSizes.map(size => (
                          <option key={size} value={size} className="bg-slate-800">{size}px</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Color</label>
                      <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => updateElement(selectedElementId!, { color: e.target.value })}
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Position & Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">X (%)</label>
                      <Input
                        type="number"
                        value={Math.round(selectedElement.x)}
                        onChange={(e) => updateElement(selectedElementId!, { x: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Y (%)</label>
                      <Input
                        type="number"
                        value={Math.round(selectedElement.y)}
                        onChange={(e) => updateElement(selectedElementId!, { y: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Width (%)</label>
                      <Input
                        type="number"
                        value={Math.round(selectedElement.width)}
                        onChange={(e) => updateElement(selectedElementId!, { width: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Height (%)</label>
                      <Input
                        type="number"
                        value={Math.round(selectedElement.height)}
                        onChange={(e) => updateElement(selectedElementId!, { height: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Delete Element */}
                <Button 
                  variant="outline" 
                  onClick={deleteElement}
                  className="w-full bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Element
                </Button>
              </>
            ) : (
              <>
                {/* Add Text Elements */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Text Elements</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addTextElement('title')}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Type className="w-4 h-4 mr-2" /> Title
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addTextElement('subtitle')}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Type className="w-3 h-3 mr-2" /> Subtitle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addTextElement('body')}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <AlignLeft className="w-4 h-4 mr-2" /> Body
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addTextElement('caption')}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Type className="w-2 h-2 mr-2" /> Caption
                    </Button>
                  </div>
                </div>

                {/* Import Media */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Import Media</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Image className="w-4 h-4 mr-2" /> Image
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => videoInputRef.current?.click()}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Video className="w-4 h-4 mr-2" /> Video
                    </Button>
                  </div>
                </div>

                {/* Insert Objects */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Insert Objects</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addTable(3, 3)}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" /> Table
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addShape('rectangle')}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Square className="w-4 h-4 mr-2" /> Rectangle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addShape('circle')}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Circle className="w-4 h-4 mr-2" /> Circle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addShape('triangle')}
                      className="bg-white/5 border-white/10 justify-start"
                    >
                      <Triangle className="w-4 h-4 mr-2" /> Triangle
                    </Button>
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="space-y-3" ref={themeSelectorRef}>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Theme</label>
                  <div 
                    className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white font-medium">{theme.name}</p>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showThemeSelector ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white/20" 
                        style={{ backgroundColor: theme.titleColor }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white/20" 
                        style={{ backgroundColor: theme.bodyColor }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white/20" 
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                  </div>
                  
                  {/* Theme dropdown */}
                  <AnimatePresence>
                    {showThemeSelector && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                          {Object.entries(templateThemes).map(([id, t]) => (
                            <div
                              key={id}
                              onClick={() => applyTheme(id)}
                              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                                currentTheme === id ? 'bg-primary-500/20 border border-primary-500' : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-white">{t.name}</span>
                                <span className="text-[10px] text-slate-500">{t.category}</span>
                              </div>
                              <div className="flex gap-1 mt-1">
                                <div className="w-4 h-4 rounded" style={{ background: t.background }} />
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.titleColor }} />
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.accentColor }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Slide Info */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Slide Info</label>
                  <div className="p-3 bg-white/5 rounded-lg space-y-2">
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-500">Layout:</span> {activeSlide?.layout}
                    </p>
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-500">Elements:</span> {activeSlide?.elements.length}
                    </p>
                  </div>
                </div>

                {/* Keyboard shortcuts hint */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Shortcuts</label>
                  <div className="p-3 bg-white/5 rounded-lg space-y-1 text-xs text-slate-400">
                    <p><kbd className="px-1 py-0.5 bg-white/10 rounded">Ctrl+Z</kbd> Undo</p>
                    <p><kbd className="px-1 py-0.5 bg-white/10 rounded">Ctrl+Shift+Z</kbd> Redo</p>
                    <p><kbd className="px-1 py-0.5 bg-white/10 rounded">Backspace</kbd> Delete element</p>
                    <p><kbd className="px-1 py-0.5 bg-white/10 rounded">Esc</kbd> Exit presentation</p>
                    <p><kbd className="px-1 py-0.5 bg-white/10 rounded">←</kbd> <kbd className="px-1 py-0.5 bg-white/10 rounded">→</kbd> Navigate slides</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Presentation Mode Overlay */}
      <AnimatePresence>
        {isPresentationMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => {
              if (activeSlideIndex < slides.length - 1) {
                setActiveSlideIndex(i => i + 1);
              }
            }}
          >
            {/* Exit button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                exitPresentation();
              }}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Slide display */}
            <div
              className="relative w-full h-full max-w-[95vw] max-h-[95vh] aspect-video"
              style={{ 
                background: activeSlide?.backgroundGradient || activeSlide?.backgroundColor || '#1e293b'
              }}
            >
              {/* Decorative elements */}
              {theme.decorativeElements && (
                <div 
                  className="absolute inset-0 pointer-events-none z-0"
                  dangerouslySetInnerHTML={{ __html: theme.decorativeElements }}
                />
              )}

              {/* Slide content */}
              {activeSlide?.elements.map((element) => (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    width: `${element.width}%`,
                    minHeight: `${element.height}%`,
                  }}
                >
                  {element.type === 'image' && element.src && (
                    <img src={element.src} alt="" className="w-full h-full object-contain" />
                  )}
                  {element.type === 'video' && element.src && (
                    <video src={element.src} controls className="w-full h-full object-contain" />
                  )}
                  {element.type === 'table' && element.tableData && (
                    <table className="w-full h-full border-collapse">
                      <tbody>
                        {element.tableData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <td 
                                key={colIndex}
                                className="border border-white/20 p-2 text-center"
                                style={{ color: element.color, fontSize: `${element.fontSize * 1.5}px` }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {element.type === 'shape' && (
                    <div className="w-full h-full flex items-center justify-center">
                      {element.shapeType === 'rectangle' && (
                        <div 
                          className="w-full h-full rounded-lg"
                          style={{ backgroundColor: element.fillColor, border: `3px solid ${element.strokeColor}` }}
                        />
                      )}
                      {element.shapeType === 'circle' && (
                        <div 
                          className="w-full h-full rounded-full"
                          style={{ backgroundColor: element.fillColor, border: `3px solid ${element.strokeColor}` }}
                        />
                      )}
                      {element.shapeType === 'triangle' && (
                        <div 
                          className="w-0 h-0"
                          style={{ 
                            borderLeft: '80px solid transparent',
                            borderRight: '80px solid transparent',
                            borderBottom: `130px solid ${element.fillColor}`
                          }}
                        />
                      )}
                    </div>
                  )}
                  {['title', 'subtitle', 'body', 'caption'].includes(element.type) && (
                    <div
                      style={{
                        color: element.color,
                        fontSize: `${element.fontSize * 1.5}px`,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        fontStyle: element.fontStyle,
                        textAlign: element.textAlign,
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {element.content}
                    </div>
                  )}
                </div>
              ))}

              {/* Slide number */}
              <div className="absolute bottom-6 right-6 text-lg font-medium text-white/50">
                {activeSlideIndex + 1} / {slides.length}
              </div>
            </div>

            {/* Navigation hints */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/40 text-sm">
              <span>Click or press <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd> for next</span>
              <span>Press <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> to exit</span>
            </div>

            {/* Navigation arrows */}
            {activeSlideIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlideIndex(i => i - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            )}
            {activeSlideIndex < slides.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlideIndex(i => i + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
