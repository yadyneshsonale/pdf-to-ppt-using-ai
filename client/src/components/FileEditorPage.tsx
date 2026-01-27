import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  Download,
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Lock,
  Crown,
  Sparkles,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LayoutTemplate,
  X,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

// Types
interface SlideElement {
  id: string;
  type: "text" | "image" | "shape" | "table" | "chart" | "icon";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  color?: string;
  backgroundColor?: string;
  shapeType?: "rectangle" | "circle" | "triangle" | "line";
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  padding?: number;
  tableData?: string[][];
  chartType?: "bar" | "pie" | "line";
  iconName?: string;
}

interface Slide {
  id: string;
  elements: SlideElement[];
  backgroundColor: string;
  backgroundImage?: string;
  backgroundGradient?: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  price?: number;
  thumbnail: string;
  colors: string[];
  slides: Slide[];
}

interface FileEditorPageProps {
  onBack: () => void;
}

// Sample templates with realistic PowerPoint-like layouts
const templates: Template[] = [
  {
    id: "t1",
    name: "Corporate Blue",
    category: "Business",
    isPremium: false,
    thumbnail: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
    colors: ["#1e3a5f", "#2d5a87", "#ffffff"],
    slides: [
      {
        id: "s1",
        backgroundColor: "#1e3a5f",
        backgroundGradient: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
        elements: [
          // Decorative sidebar
          { id: "e0", type: "shape", x: 0, y: 0, width: 15, height: 450, backgroundColor: "#f59e0b", shapeType: "rectangle" },
          // Title box with background
          { id: "e1", type: "shape", x: 60, y: 120, width: 680, height: 120, backgroundColor: "rgba(255,255,255,0.1)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e2", type: "text", x: 80, y: 140, width: 640, height: 50, content: "BUSINESS STRATEGY", fontSize: 42, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e3", type: "text", x: 80, y: 195, width: 640, height: 30, content: "Q4 2024 Planning & Growth Initiatives", fontSize: 20, color: "#94a3b8", textAlign: "left" },
          // Bottom info boxes
          { id: "e4", type: "shape", x: 60, y: 300, width: 200, height: 100, backgroundColor: "rgba(245,158,11,0.2)", shapeType: "rectangle", borderRadius: 8 },
          { id: "e5", type: "text", x: 70, y: 320, width: 180, height: 20, content: "PRESENTER", fontSize: 12, color: "#f59e0b", textAlign: "left" },
          { id: "e6", type: "text", x: 70, y: 345, width: 180, height: 25, content: "John Smith", fontSize: 18, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e7", type: "shape", x: 280, y: 300, width: 200, height: 100, backgroundColor: "rgba(245,158,11,0.2)", shapeType: "rectangle", borderRadius: 8 },
          { id: "e8", type: "text", x: 290, y: 320, width: 180, height: 20, content: "DATE", fontSize: 12, color: "#f59e0b", textAlign: "left" },
          { id: "e9", type: "text", x: 290, y: 345, width: 180, height: 25, content: "January 2026", fontSize: 18, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
        ],
      },
      {
        id: "s2",
        backgroundColor: "#ffffff",
        elements: [
          // Header bar
          { id: "e0", type: "shape", x: 0, y: 0, width: 800, height: 60, backgroundColor: "#1e3a5f", shapeType: "rectangle" },
          { id: "e1", type: "text", x: 30, y: 15, width: 300, height: 35, content: "Agenda", fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          // Agenda items with icons
          { id: "e2", type: "shape", x: 40, y: 90, width: 8, height: 8, backgroundColor: "#f59e0b", shapeType: "circle" },
          { id: "e3", type: "text", x: 60, y: 80, width: 700, height: 30, content: "Market Analysis & Current Position", fontSize: 20, color: "#1e3a5f", textAlign: "left" },
          { id: "e4", type: "shape", x: 40, y: 140, width: 8, height: 8, backgroundColor: "#f59e0b", shapeType: "circle" },
          { id: "e5", type: "text", x: 60, y: 130, width: 700, height: 30, content: "Strategic Objectives for 2026", fontSize: 20, color: "#1e3a5f", textAlign: "left" },
          { id: "e6", type: "shape", x: 40, y: 190, width: 8, height: 8, backgroundColor: "#f59e0b", shapeType: "circle" },
          { id: "e7", type: "text", x: 60, y: 180, width: 700, height: 30, content: "Key Performance Indicators", fontSize: 20, color: "#1e3a5f", textAlign: "left" },
          { id: "e8", type: "shape", x: 40, y: 240, width: 8, height: 8, backgroundColor: "#f59e0b", shapeType: "circle" },
          { id: "e9", type: "text", x: 60, y: 230, width: 700, height: 30, content: "Resource Allocation & Timeline", fontSize: 20, color: "#1e3a5f", textAlign: "left" },
          // Bottom accent
          { id: "e10", type: "shape", x: 0, y: 435, width: 800, height: 15, backgroundColor: "#f59e0b", shapeType: "rectangle" },
        ],
      },
      {
        id: "s3",
        backgroundColor: "#ffffff",
        elements: [
          // Header
          { id: "e0", type: "shape", x: 0, y: 0, width: 800, height: 60, backgroundColor: "#1e3a5f", shapeType: "rectangle" },
          { id: "e1", type: "text", x: 30, y: 15, width: 400, height: 35, content: "Key Metrics", fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          // Metric cards
          { id: "e2", type: "shape", x: 40, y: 90, width: 170, height: 120, backgroundColor: "#1e3a5f", shapeType: "rectangle", borderRadius: 8 },
          { id: "e3", type: "text", x: 50, y: 110, width: 150, height: 40, content: "$2.4M", fontSize: 32, fontWeight: "bold", color: "#f59e0b", textAlign: "center" },
          { id: "e4", type: "text", x: 50, y: 155, width: 150, height: 20, content: "Revenue", fontSize: 14, color: "#94a3b8", textAlign: "center" },
          { id: "e5", type: "shape", x: 230, y: 90, width: 170, height: 120, backgroundColor: "#1e3a5f", shapeType: "rectangle", borderRadius: 8 },
          { id: "e6", type: "text", x: 240, y: 110, width: 150, height: 40, content: "+34%", fontSize: 32, fontWeight: "bold", color: "#22c55e", textAlign: "center" },
          { id: "e7", type: "text", x: 240, y: 155, width: 150, height: 20, content: "Growth", fontSize: 14, color: "#94a3b8", textAlign: "center" },
          { id: "e8", type: "shape", x: 420, y: 90, width: 170, height: 120, backgroundColor: "#1e3a5f", shapeType: "rectangle", borderRadius: 8 },
          { id: "e9", type: "text", x: 430, y: 110, width: 150, height: 40, content: "1,247", fontSize: 32, fontWeight: "bold", color: "#f59e0b", textAlign: "center" },
          { id: "e10", type: "text", x: 430, y: 155, width: 150, height: 20, content: "New Clients", fontSize: 14, color: "#94a3b8", textAlign: "center" },
          { id: "e11", type: "shape", x: 610, y: 90, width: 170, height: 120, backgroundColor: "#1e3a5f", shapeType: "rectangle", borderRadius: 8 },
          { id: "e12", type: "text", x: 620, y: 110, width: 150, height: 40, content: "98%", fontSize: 32, fontWeight: "bold", color: "#22c55e", textAlign: "center" },
          { id: "e13", type: "text", x: 620, y: 155, width: 150, height: 20, content: "Satisfaction", fontSize: 14, color: "#94a3b8", textAlign: "center" },
          // Chart placeholder
          { id: "e14", type: "shape", x: 40, y: 240, width: 720, height: 180, backgroundColor: "#f1f5f9", shapeType: "rectangle", borderRadius: 8 },
          { id: "e15", type: "text", x: 40, y: 310, width: 720, height: 30, content: "📊 Revenue Growth Chart", fontSize: 18, color: "#64748b", textAlign: "center" },
          // Bottom accent
          { id: "e16", type: "shape", x: 0, y: 435, width: 800, height: 15, backgroundColor: "#f59e0b", shapeType: "rectangle" },
        ],
      },
    ],
  },
  {
    id: "t2",
    name: "Executive Dark",
    category: "Business",
    isPremium: true,
    price: 4.99,
    thumbnail: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
    colors: ["#0f0f0f", "#6366f1", "#ffffff"],
    slides: [
      {
        id: "s1",
        backgroundColor: "#0f0f0f",
        backgroundGradient: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
        elements: [
          // Accent lines
          { id: "e0", type: "shape", x: 50, y: 100, width: 100, height: 4, backgroundColor: "#6366f1", shapeType: "rectangle" },
          // Main title with glass effect background
          { id: "e1", type: "shape", x: 50, y: 130, width: 500, height: 140, backgroundColor: "rgba(99,102,241,0.1)", shapeType: "rectangle", borderRadius: 16, borderColor: "rgba(99,102,241,0.3)", borderWidth: 1 },
          { id: "e2", type: "text", x: 70, y: 150, width: 460, height: 60, content: "Annual Report", fontSize: 48, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e3", type: "text", x: 70, y: 215, width: 460, height: 30, content: "Financial Year 2025-2026", fontSize: 22, color: "#a5b4fc", textAlign: "left" },
          // Stats row
          { id: "e4", type: "shape", x: 50, y: 320, width: 150, height: 80, backgroundColor: "rgba(255,255,255,0.05)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e5", type: "text", x: 60, y: 335, width: 130, height: 30, content: "$12.5B", fontSize: 24, fontWeight: "bold", color: "#6366f1", textAlign: "center" },
          { id: "e6", type: "text", x: 60, y: 365, width: 130, height: 20, content: "Total Revenue", fontSize: 11, color: "#94a3b8", textAlign: "center" },
          { id: "e7", type: "shape", x: 220, y: 320, width: 150, height: 80, backgroundColor: "rgba(255,255,255,0.05)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e8", type: "text", x: 230, y: 335, width: 130, height: 30, content: "+28%", fontSize: 24, fontWeight: "bold", color: "#22c55e", textAlign: "center" },
          { id: "e9", type: "text", x: 230, y: 365, width: 130, height: 20, content: "YoY Growth", fontSize: 11, color: "#94a3b8", textAlign: "center" },
          { id: "e10", type: "shape", x: 390, y: 320, width: 150, height: 80, backgroundColor: "rgba(255,255,255,0.05)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e11", type: "text", x: 400, y: 335, width: 130, height: 30, content: "50+", fontSize: 24, fontWeight: "bold", color: "#6366f1", textAlign: "center" },
          { id: "e12", type: "text", x: 400, y: 365, width: 130, height: 20, content: "Countries", fontSize: 11, color: "#94a3b8", textAlign: "center" },
          // Side decoration
          { id: "e13", type: "shape", x: 650, y: 80, width: 120, height: 120, backgroundColor: "rgba(99,102,241,0.2)", shapeType: "circle" },
          { id: "e14", type: "shape", x: 700, y: 180, width: 80, height: 80, backgroundColor: "rgba(99,102,241,0.1)", shapeType: "circle" },
        ],
      },
      {
        id: "s2",
        backgroundColor: "#0f0f0f",
        elements: [
          // Header
          { id: "e0", type: "text", x: 50, y: 30, width: 400, height: 40, content: "Financial Overview", fontSize: 32, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e1", type: "shape", x: 50, y: 75, width: 60, height: 3, backgroundColor: "#6366f1", shapeType: "rectangle" },
          // Table-like structure
          { id: "e2", type: "shape", x: 50, y: 100, width: 700, height: 40, backgroundColor: "#6366f1", shapeType: "rectangle", borderRadius: 8 },
          { id: "e3", type: "text", x: 70, y: 110, width: 150, height: 25, content: "Category", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e4", type: "text", x: 250, y: 110, width: 150, height: 25, content: "Q3 2025", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
          { id: "e5", type: "text", x: 420, y: 110, width: 150, height: 25, content: "Q4 2025", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
          { id: "e6", type: "text", x: 590, y: 110, width: 150, height: 25, content: "Change", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
          // Table rows
          { id: "e7", type: "shape", x: 50, y: 145, width: 700, height: 45, backgroundColor: "rgba(255,255,255,0.05)", shapeType: "rectangle" },
          { id: "e8", type: "text", x: 70, y: 155, width: 150, height: 25, content: "Revenue", fontSize: 14, color: "#ffffff", textAlign: "left" },
          { id: "e9", type: "text", x: 250, y: 155, width: 150, height: 25, content: "$2.8M", fontSize: 14, color: "#a5b4fc", textAlign: "center" },
          { id: "e10", type: "text", x: 420, y: 155, width: 150, height: 25, content: "$3.2M", fontSize: 14, color: "#a5b4fc", textAlign: "center" },
          { id: "e11", type: "text", x: 590, y: 155, width: 150, height: 25, content: "+14.3%", fontSize: 14, fontWeight: "bold", color: "#22c55e", textAlign: "center" },
          { id: "e12", type: "shape", x: 50, y: 195, width: 700, height: 45, backgroundColor: "rgba(255,255,255,0.02)", shapeType: "rectangle" },
          { id: "e13", type: "text", x: 70, y: 205, width: 150, height: 25, content: "Expenses", fontSize: 14, color: "#ffffff", textAlign: "left" },
          { id: "e14", type: "text", x: 250, y: 205, width: 150, height: 25, content: "$1.9M", fontSize: 14, color: "#a5b4fc", textAlign: "center" },
          { id: "e15", type: "text", x: 420, y: 205, width: 150, height: 25, content: "$1.8M", fontSize: 14, color: "#a5b4fc", textAlign: "center" },
          { id: "e16", type: "text", x: 590, y: 205, width: 150, height: 25, content: "-5.3%", fontSize: 14, fontWeight: "bold", color: "#22c55e", textAlign: "center" },
          { id: "e17", type: "shape", x: 50, y: 245, width: 700, height: 45, backgroundColor: "rgba(255,255,255,0.05)", shapeType: "rectangle" },
          { id: "e18", type: "text", x: 70, y: 255, width: 150, height: 25, content: "Net Profit", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e19", type: "text", x: 250, y: 255, width: 150, height: 25, content: "$0.9M", fontSize: 14, color: "#a5b4fc", textAlign: "center" },
          { id: "e20", type: "text", x: 420, y: 255, width: 150, height: 25, content: "$1.4M", fontSize: 14, color: "#a5b4fc", textAlign: "center" },
          { id: "e21", type: "text", x: 590, y: 255, width: 150, height: 25, content: "+55.6%", fontSize: 14, fontWeight: "bold", color: "#22c55e", textAlign: "center" },
          // Chart area
          { id: "e22", type: "shape", x: 50, y: 320, width: 340, height: 110, backgroundColor: "rgba(99,102,241,0.1)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e23", type: "text", x: 60, y: 335, width: 320, height: 20, content: "Revenue Trend", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e24", type: "text", x: 60, y: 370, width: 320, height: 40, content: "📈", fontSize: 40, color: "#6366f1", textAlign: "center" },
          { id: "e25", type: "shape", x: 410, y: 320, width: 340, height: 110, backgroundColor: "rgba(34,197,94,0.1)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e26", type: "text", x: 420, y: 335, width: 320, height: 20, content: "Profit Margin", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e27", type: "text", x: 420, y: 370, width: 320, height: 40, content: "📊", fontSize: 40, color: "#22c55e", textAlign: "center" },
        ],
      },
    ],
  },
  {
    id: "t3",
    name: "Creative Gradient",
    category: "Creative",
    isPremium: true,
    price: 5.99,
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    colors: ["#667eea", "#764ba2", "#f093fb"],
    slides: [
      {
        id: "s1",
        backgroundColor: "#667eea",
        backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        elements: [
          // Decorative circles
          { id: "e0", type: "shape", x: -50, y: -50, width: 200, height: 200, backgroundColor: "rgba(255,255,255,0.1)", shapeType: "circle" },
          { id: "e1", type: "shape", x: 650, y: 300, width: 180, height: 180, backgroundColor: "rgba(255,255,255,0.08)", shapeType: "circle" },
          { id: "e2", type: "shape", x: 700, y: 50, width: 100, height: 100, backgroundColor: "rgba(255,255,255,0.05)", shapeType: "circle" },
          // Main content box
          { id: "e3", type: "shape", x: 80, y: 100, width: 450, height: 250, backgroundColor: "rgba(255,255,255,0.15)", shapeType: "rectangle", borderRadius: 24 },
          { id: "e4", type: "text", x: 100, y: 130, width: 410, height: 20, content: "✨ CREATIVE WORKSHOP", fontSize: 14, fontWeight: "bold", color: "rgba(255,255,255,0.8)", textAlign: "left" },
          { id: "e5", type: "text", x: 100, y: 160, width: 410, height: 60, content: "Design Thinking", fontSize: 48, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e6", type: "text", x: 100, y: 230, width: 410, height: 50, content: "Innovative approaches to problem solving and creative ideation", fontSize: 16, color: "rgba(255,255,255,0.9)", textAlign: "left" },
          { id: "e7", type: "shape", x: 100, y: 300, width: 140, height: 40, backgroundColor: "#ffffff", shapeType: "rectangle", borderRadius: 20 },
          { id: "e8", type: "text", x: 100, y: 308, width: 140, height: 25, content: "Get Started →", fontSize: 14, fontWeight: "bold", color: "#764ba2", textAlign: "center" },
        ],
      },
      {
        id: "s2",
        backgroundColor: "#1a1a2e",
        elements: [
          // Header with gradient accent
          { id: "e0", type: "shape", x: 0, y: 0, width: 800, height: 80, backgroundColor: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", shapeType: "rectangle" },
          { id: "e1", type: "text", x: 40, y: 25, width: 400, height: 35, content: "Our Process", fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          // Process cards
          { id: "e2", type: "shape", x: 40, y: 110, width: 170, height: 160, backgroundColor: "rgba(102,126,234,0.2)", shapeType: "rectangle", borderRadius: 16 },
          { id: "e3", type: "text", x: 50, y: 125, width: 150, height: 40, content: "01", fontSize: 36, fontWeight: "bold", color: "#667eea", textAlign: "left" },
          { id: "e4", type: "text", x: 50, y: 175, width: 150, height: 25, content: "Research", fontSize: 18, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e5", type: "text", x: 50, y: 205, width: 150, height: 50, content: "Deep dive into user needs", fontSize: 12, color: "#94a3b8", textAlign: "left" },
          { id: "e6", type: "shape", x: 230, y: 110, width: 170, height: 160, backgroundColor: "rgba(118,75,162,0.2)", shapeType: "rectangle", borderRadius: 16 },
          { id: "e7", type: "text", x: 240, y: 125, width: 150, height: 40, content: "02", fontSize: 36, fontWeight: "bold", color: "#764ba2", textAlign: "left" },
          { id: "e8", type: "text", x: 240, y: 175, width: 150, height: 25, content: "Ideate", fontSize: 18, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e9", type: "text", x: 240, y: 205, width: 150, height: 50, content: "Generate creative solutions", fontSize: 12, color: "#94a3b8", textAlign: "left" },
          { id: "e10", type: "shape", x: 420, y: 110, width: 170, height: 160, backgroundColor: "rgba(240,147,251,0.2)", shapeType: "rectangle", borderRadius: 16 },
          { id: "e11", type: "text", x: 430, y: 125, width: 150, height: 40, content: "03", fontSize: 36, fontWeight: "bold", color: "#f093fb", textAlign: "left" },
          { id: "e12", type: "text", x: 430, y: 175, width: 150, height: 25, content: "Prototype", fontSize: 18, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e13", type: "text", x: 430, y: 205, width: 150, height: 50, content: "Build and test concepts", fontSize: 12, color: "#94a3b8", textAlign: "left" },
          { id: "e14", type: "shape", x: 610, y: 110, width: 170, height: 160, backgroundColor: "rgba(102,126,234,0.2)", shapeType: "rectangle", borderRadius: 16 },
          { id: "e15", type: "text", x: 620, y: 125, width: 150, height: 40, content: "04", fontSize: 36, fontWeight: "bold", color: "#667eea", textAlign: "left" },
          { id: "e16", type: "text", x: 620, y: 175, width: 150, height: 25, content: "Launch", fontSize: 18, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e17", type: "text", x: 620, y: 205, width: 150, height: 50, content: "Deploy to production", fontSize: 12, color: "#94a3b8", textAlign: "left" },
          // Bottom quote
          { id: "e18", type: "shape", x: 40, y: 310, width: 720, height: 100, backgroundColor: "rgba(255,255,255,0.05)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e19", type: "text", x: 60, y: 340, width: 680, height: 50, content: '"Creativity is intelligence having fun." - Albert Einstein', fontSize: 18, color: "#a5b4fc", textAlign: "center" },
        ],
      },
    ],
  },
  {
    id: "t4",
    name: "Tech Startup",
    category: "Business",
    isPremium: true,
    price: 6.99,
    thumbnail: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
    colors: ["#0a0a0a", "#10b981", "#ffffff"],
    slides: [
      {
        id: "s1",
        backgroundColor: "#0a0a0a",
        elements: [
          // Grid pattern suggestion
          { id: "e0", type: "shape", x: 0, y: 0, width: 800, height: 450, backgroundColor: "rgba(16,185,129,0.03)", shapeType: "rectangle" },
          // Logo/brand area
          { id: "e1", type: "shape", x: 50, y: 40, width: 50, height: 50, backgroundColor: "#10b981", shapeType: "rectangle", borderRadius: 12 },
          { id: "e2", type: "text", x: 115, y: 50, width: 200, height: 30, content: "TechFlow", fontSize: 24, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          // Main headline
          { id: "e3", type: "text", x: 50, y: 140, width: 700, height: 70, content: "Revolutionizing", fontSize: 56, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e4", type: "text", x: 50, y: 210, width: 700, height: 70, content: "the Future", fontSize: 56, fontWeight: "bold", color: "#10b981", textAlign: "left" },
          // Tagline
          { id: "e5", type: "text", x: 50, y: 290, width: 500, height: 30, content: "AI-Powered Solutions for Modern Enterprises", fontSize: 18, color: "#6b7280", textAlign: "left" },
          // CTA buttons
          { id: "e6", type: "shape", x: 50, y: 350, width: 150, height: 45, backgroundColor: "#10b981", shapeType: "rectangle", borderRadius: 8 },
          { id: "e7", type: "text", x: 50, y: 360, width: 150, height: 25, content: "Learn More", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
          { id: "e8", type: "shape", x: 220, y: 350, width: 150, height: 45, backgroundColor: "transparent", shapeType: "rectangle", borderRadius: 8, borderColor: "#10b981", borderWidth: 2 },
          { id: "e9", type: "text", x: 220, y: 360, width: 150, height: 25, content: "Watch Demo", fontSize: 14, fontWeight: "bold", color: "#10b981", textAlign: "center" },
          // Side graphic
          { id: "e10", type: "shape", x: 580, y: 100, width: 180, height: 180, backgroundColor: "rgba(16,185,129,0.1)", shapeType: "circle" },
          { id: "e11", type: "shape", x: 620, y: 140, width: 100, height: 100, backgroundColor: "rgba(16,185,129,0.2)", shapeType: "circle" },
          { id: "e12", type: "text", x: 620, y: 170, width: 100, height: 40, content: "🚀", fontSize: 40, textAlign: "center" },
        ],
      },
      {
        id: "s2",
        backgroundColor: "#0a0a0a",
        elements: [
          // Section header
          { id: "e0", type: "text", x: 50, y: 30, width: 300, height: 20, content: "OUR SOLUTION", fontSize: 12, fontWeight: "bold", color: "#10b981", textAlign: "left" },
          { id: "e1", type: "text", x: 50, y: 55, width: 700, height: 45, content: "How It Works", fontSize: 36, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          // Feature cards
          { id: "e2", type: "shape", x: 50, y: 120, width: 220, height: 150, backgroundColor: "#111111", shapeType: "rectangle", borderRadius: 16, borderColor: "rgba(16,185,129,0.3)", borderWidth: 1 },
          { id: "e3", type: "text", x: 70, y: 140, width: 40, height: 40, content: "⚡", fontSize: 32, textAlign: "left" },
          { id: "e4", type: "text", x: 70, y: 185, width: 180, height: 25, content: "Lightning Fast", fontSize: 16, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e5", type: "text", x: 70, y: 215, width: 180, height: 40, content: "Process data in milliseconds", fontSize: 12, color: "#6b7280", textAlign: "left" },
          { id: "e6", type: "shape", x: 290, y: 120, width: 220, height: 150, backgroundColor: "#111111", shapeType: "rectangle", borderRadius: 16, borderColor: "rgba(16,185,129,0.3)", borderWidth: 1 },
          { id: "e7", type: "text", x: 310, y: 140, width: 40, height: 40, content: "🔒", fontSize: 32, textAlign: "left" },
          { id: "e8", type: "text", x: 310, y: 185, width: 180, height: 25, content: "Secure by Design", fontSize: 16, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e9", type: "text", x: 310, y: 215, width: 180, height: 40, content: "Enterprise-grade security", fontSize: 12, color: "#6b7280", textAlign: "left" },
          { id: "e10", type: "shape", x: 530, y: 120, width: 220, height: 150, backgroundColor: "#111111", shapeType: "rectangle", borderRadius: 16, borderColor: "rgba(16,185,129,0.3)", borderWidth: 1 },
          { id: "e11", type: "text", x: 550, y: 140, width: 40, height: 40, content: "📊", fontSize: 32, textAlign: "left" },
          { id: "e12", type: "text", x: 550, y: 185, width: 180, height: 25, content: "Smart Analytics", fontSize: 16, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e13", type: "text", x: 550, y: 215, width: 180, height: 40, content: "AI-powered insights", fontSize: 12, color: "#6b7280", textAlign: "left" },
          // Stats section
          { id: "e14", type: "shape", x: 50, y: 300, width: 700, height: 120, backgroundColor: "rgba(16,185,129,0.1)", shapeType: "rectangle", borderRadius: 16 },
          { id: "e15", type: "text", x: 100, y: 330, width: 130, height: 35, content: "99.9%", fontSize: 28, fontWeight: "bold", color: "#10b981", textAlign: "center" },
          { id: "e16", type: "text", x: 100, y: 365, width: 130, height: 20, content: "Uptime", fontSize: 12, color: "#6b7280", textAlign: "center" },
          { id: "e17", type: "text", x: 280, y: 330, width: 130, height: 35, content: "500K+", fontSize: 28, fontWeight: "bold", color: "#10b981", textAlign: "center" },
          { id: "e18", type: "text", x: 280, y: 365, width: 130, height: 20, content: "Users", fontSize: 12, color: "#6b7280", textAlign: "center" },
          { id: "e19", type: "text", x: 460, y: 330, width: 130, height: 35, content: "150+", fontSize: 28, fontWeight: "bold", color: "#10b981", textAlign: "center" },
          { id: "e20", type: "text", x: 460, y: 365, width: 130, height: 20, content: "Countries", fontSize: 12, color: "#6b7280", textAlign: "center" },
          { id: "e21", type: "text", x: 620, y: 330, width: 130, height: 35, content: "24/7", fontSize: 28, fontWeight: "bold", color: "#10b981", textAlign: "center" },
          { id: "e22", type: "text", x: 620, y: 365, width: 130, height: 20, content: "Support", fontSize: 12, color: "#6b7280", textAlign: "center" },
        ],
      },
    ],
  },
  {
    id: "t5",
    name: "Nature & Earth",
    category: "Nature",
    isPremium: false,
    thumbnail: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    colors: ["#134e5e", "#71b280", "#ffffff"],
    slides: [
      {
        id: "s1",
        backgroundColor: "#134e5e",
        backgroundGradient: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        elements: [
          // Decorative leaves/nature elements
          { id: "e0", type: "shape", x: -30, y: -30, width: 150, height: 150, backgroundColor: "rgba(113,178,128,0.3)", shapeType: "circle" },
          { id: "e1", type: "shape", x: 680, y: 320, width: 180, height: 180, backgroundColor: "rgba(113,178,128,0.2)", shapeType: "circle" },
          // Main content card
          { id: "e2", type: "shape", x: 50, y: 80, width: 450, height: 290, backgroundColor: "rgba(255,255,255,0.1)", shapeType: "rectangle", borderRadius: 20 },
          { id: "e3", type: "text", x: 80, y: 110, width: 390, height: 30, content: "🌿 SUSTAINABILITY REPORT", fontSize: 14, fontWeight: "bold", color: "#a7f3d0", textAlign: "left" },
          { id: "e4", type: "text", x: 80, y: 150, width: 390, height: 50, content: "Our Green", fontSize: 44, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e5", type: "text", x: 80, y: 200, width: 390, height: 50, content: "Initiative", fontSize: 44, fontWeight: "bold", color: "#a7f3d0", textAlign: "left" },
          { id: "e6", type: "text", x: 80, y: 270, width: 390, height: 60, content: "Building a sustainable future through innovation and responsibility", fontSize: 16, color: "rgba(255,255,255,0.8)", textAlign: "left" },
          // Stats on the right
          { id: "e7", type: "shape", x: 550, y: 100, width: 200, height: 80, backgroundColor: "rgba(255,255,255,0.15)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e8", type: "text", x: 560, y: 115, width: 180, height: 35, content: "-40%", fontSize: 28, fontWeight: "bold", color: "#a7f3d0", textAlign: "center" },
          { id: "e9", type: "text", x: 560, y: 150, width: 180, height: 20, content: "Carbon Footprint", fontSize: 12, color: "#ffffff", textAlign: "center" },
          { id: "e10", type: "shape", x: 550, y: 195, width: 200, height: 80, backgroundColor: "rgba(255,255,255,0.15)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e11", type: "text", x: 560, y: 210, width: 180, height: 35, content: "100%", fontSize: 28, fontWeight: "bold", color: "#a7f3d0", textAlign: "center" },
          { id: "e12", type: "text", x: 560, y: 245, width: 180, height: 20, content: "Renewable Energy", fontSize: 12, color: "#ffffff", textAlign: "center" },
        ],
      },
    ],
  },
  {
    id: "t6",
    name: "Minimalist White",
    category: "Minimal",
    isPremium: false,
    thumbnail: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    colors: ["#ffffff", "#0f172a", "#6366f1"],
    slides: [
      {
        id: "s1",
        backgroundColor: "#ffffff",
        elements: [
          // Accent shape
          { id: "e0", type: "shape", x: 0, y: 0, width: 300, height: 450, backgroundColor: "#f1f5f9", shapeType: "rectangle" },
          { id: "e1", type: "shape", x: 0, y: 180, width: 8, height: 90, backgroundColor: "#6366f1", shapeType: "rectangle" },
          // Content
          { id: "e2", type: "text", x: 350, y: 120, width: 400, height: 30, content: "COMPANY NAME", fontSize: 14, fontWeight: "bold", color: "#6366f1", textAlign: "left" },
          { id: "e3", type: "text", x: 350, y: 160, width: 400, height: 60, content: "Simple.", fontSize: 52, fontWeight: "bold", color: "#0f172a", textAlign: "left" },
          { id: "e4", type: "text", x: 350, y: 220, width: 400, height: 60, content: "Elegant.", fontSize: 52, fontWeight: "bold", color: "#0f172a", textAlign: "left" },
          { id: "e5", type: "text", x: 350, y: 280, width: 400, height: 60, content: "Effective.", fontSize: 52, fontWeight: "bold", color: "#6366f1", textAlign: "left" },
          { id: "e6", type: "text", x: 350, y: 360, width: 400, height: 25, content: "Presentation Design 2026", fontSize: 16, color: "#64748b", textAlign: "left" },
          // Left side content
          { id: "e7", type: "text", x: 40, y: 350, width: 220, height: 20, content: "www.company.com", fontSize: 12, color: "#64748b", textAlign: "left" },
        ],
      },
      {
        id: "s2",
        backgroundColor: "#ffffff",
        elements: [
          // Header line
          { id: "e0", type: "shape", x: 50, y: 50, width: 60, height: 4, backgroundColor: "#6366f1", shapeType: "rectangle" },
          { id: "e1", type: "text", x: 50, y: 70, width: 400, height: 40, content: "Our Services", fontSize: 32, fontWeight: "bold", color: "#0f172a", textAlign: "left" },
          // Service cards
          { id: "e2", type: "shape", x: 50, y: 130, width: 220, height: 140, backgroundColor: "#f8fafc", shapeType: "rectangle", borderRadius: 12 },
          { id: "e3", type: "text", x: 70, y: 150, width: 180, height: 25, content: "01", fontSize: 20, fontWeight: "bold", color: "#6366f1", textAlign: "left" },
          { id: "e4", type: "text", x: 70, y: 180, width: 180, height: 25, content: "Strategy", fontSize: 18, fontWeight: "bold", color: "#0f172a", textAlign: "left" },
          { id: "e5", type: "text", x: 70, y: 210, width: 180, height: 40, content: "Data-driven planning", fontSize: 12, color: "#64748b", textAlign: "left" },
          { id: "e6", type: "shape", x: 290, y: 130, width: 220, height: 140, backgroundColor: "#f8fafc", shapeType: "rectangle", borderRadius: 12 },
          { id: "e7", type: "text", x: 310, y: 150, width: 180, height: 25, content: "02", fontSize: 20, fontWeight: "bold", color: "#6366f1", textAlign: "left" },
          { id: "e8", type: "text", x: 310, y: 180, width: 180, height: 25, content: "Design", fontSize: 18, fontWeight: "bold", color: "#0f172a", textAlign: "left" },
          { id: "e9", type: "text", x: 310, y: 210, width: 180, height: 40, content: "Beautiful interfaces", fontSize: 12, color: "#64748b", textAlign: "left" },
          { id: "e10", type: "shape", x: 530, y: 130, width: 220, height: 140, backgroundColor: "#f8fafc", shapeType: "rectangle", borderRadius: 12 },
          { id: "e11", type: "text", x: 550, y: 150, width: 180, height: 25, content: "03", fontSize: 20, fontWeight: "bold", color: "#6366f1", textAlign: "left" },
          { id: "e12", type: "text", x: 550, y: 180, width: 180, height: 25, content: "Development", fontSize: 18, fontWeight: "bold", color: "#0f172a", textAlign: "left" },
          { id: "e13", type: "text", x: 550, y: 210, width: 180, height: 40, content: "Robust solutions", fontSize: 12, color: "#64748b", textAlign: "left" },
          // Bottom section
          { id: "e14", type: "shape", x: 50, y: 300, width: 700, height: 100, backgroundColor: "#0f172a", shapeType: "rectangle", borderRadius: 12 },
          { id: "e15", type: "text", x: 70, y: 330, width: 500, height: 25, content: "Ready to start your project?", fontSize: 20, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          { id: "e16", type: "text", x: 70, y: 360, width: 400, height: 20, content: "Let's discuss your needs", fontSize: 14, color: "#94a3b8", textAlign: "left" },
          { id: "e17", type: "shape", x: 600, y: 325, width: 120, height: 40, backgroundColor: "#6366f1", shapeType: "rectangle", borderRadius: 8 },
          { id: "e18", type: "text", x: 600, y: 335, width: 120, height: 20, content: "Contact Us", fontSize: 14, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
        ],
      },
    ],
  },
  {
    id: "t7",
    name: "Neon Cyber",
    category: "Creative",
    isPremium: true,
    price: 7.99,
    thumbnail: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)",
    colors: ["#0a0a0a", "#ff00ff", "#00ffff"],
    slides: [
      {
        id: "s1",
        backgroundColor: "#0a0a0a",
        elements: [
          // Neon glow effects
          { id: "e0", type: "shape", x: 350, y: 150, width: 100, height: 100, backgroundColor: "rgba(255,0,255,0.15)", shapeType: "circle" },
          { id: "e1", type: "shape", x: 370, y: 170, width: 60, height: 60, backgroundColor: "rgba(255,0,255,0.3)", shapeType: "circle" },
          // Grid lines (simulated)
          { id: "e2", type: "shape", x: 0, y: 225, width: 800, height: 1, backgroundColor: "rgba(0,255,255,0.1)", shapeType: "rectangle" },
          { id: "e3", type: "shape", x: 400, y: 0, width: 1, height: 450, backgroundColor: "rgba(255,0,255,0.1)", shapeType: "rectangle" },
          // Main title
          { id: "e4", type: "text", x: 50, y: 160, width: 700, height: 70, content: "CYBER", fontSize: 72, fontWeight: "bold", color: "#ff00ff", textAlign: "center" },
          { id: "e5", type: "text", x: 50, y: 230, width: 700, height: 70, content: "FUTURE", fontSize: 72, fontWeight: "bold", color: "#00ffff", textAlign: "center" },
          // Subtitle with border
          { id: "e6", type: "shape", x: 200, y: 320, width: 400, height: 50, backgroundColor: "transparent", shapeType: "rectangle", borderColor: "#ff00ff", borderWidth: 2 },
          { id: "e7", type: "text", x: 200, y: 332, width: 400, height: 30, content: "DIGITAL CONFERENCE 2026", fontSize: 16, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
          // Corner decorations
          { id: "e8", type: "shape", x: 20, y: 20, width: 60, height: 2, backgroundColor: "#00ffff", shapeType: "rectangle" },
          { id: "e9", type: "shape", x: 20, y: 20, width: 2, height: 60, backgroundColor: "#00ffff", shapeType: "rectangle" },
          { id: "e10", type: "shape", x: 720, y: 388, width: 60, height: 2, backgroundColor: "#ff00ff", shapeType: "rectangle" },
          { id: "e11", type: "shape", x: 778, y: 330, width: 2, height: 60, backgroundColor: "#ff00ff", shapeType: "rectangle" },
        ],
      },
    ],
  },
  {
    id: "t8",
    name: "Academic",
    category: "Education",
    isPremium: false,
    thumbnail: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    colors: ["#1e40af", "#3b82f6", "#ffffff"],
    slides: [
      {
        id: "s1",
        backgroundColor: "#1e40af",
        backgroundGradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
        elements: [
          // University/academic style header
          { id: "e0", type: "shape", x: 300, y: 30, width: 200, height: 80, backgroundColor: "rgba(255,255,255,0.1)", shapeType: "rectangle", borderRadius: 8 },
          { id: "e1", type: "text", x: 300, y: 50, width: 200, height: 40, content: "🎓", fontSize: 40, textAlign: "center" },
          // Main title
          { id: "e2", type: "text", x: 50, y: 140, width: 700, height: 50, content: "Research Presentation", fontSize: 40, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
          // Subtitle with underline
          { id: "e3", type: "shape", x: 300, y: 200, width: 200, height: 3, backgroundColor: "#fbbf24", shapeType: "rectangle" },
          { id: "e4", type: "text", x: 50, y: 220, width: 700, height: 35, content: "Understanding Machine Learning Algorithms", fontSize: 22, color: "#bfdbfe", textAlign: "center" },
          // Author info card
          { id: "e5", type: "shape", x: 200, y: 290, width: 400, height: 100, backgroundColor: "rgba(255,255,255,0.1)", shapeType: "rectangle", borderRadius: 12 },
          { id: "e6", type: "text", x: 220, y: 310, width: 360, height: 25, content: "Dr. Jane Smith, PhD", fontSize: 18, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
          { id: "e7", type: "text", x: 220, y: 340, width: 360, height: 20, content: "Department of Computer Science", fontSize: 14, color: "#bfdbfe", textAlign: "center" },
          { id: "e8", type: "text", x: 220, y: 365, width: 360, height: 20, content: "Stanford University", fontSize: 14, color: "#93c5fd", textAlign: "center" },
        ],
      },
      {
        id: "s2",
        backgroundColor: "#ffffff",
        elements: [
          // Header
          { id: "e0", type: "shape", x: 0, y: 0, width: 800, height: 70, backgroundColor: "#1e40af", shapeType: "rectangle" },
          { id: "e1", type: "text", x: 30, y: 20, width: 400, height: 35, content: "Methodology", fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "left" },
          // Content sections
          { id: "e2", type: "shape", x: 30, y: 90, width: 350, height: 160, backgroundColor: "#eff6ff", shapeType: "rectangle", borderRadius: 12 },
          { id: "e3", type: "text", x: 50, y: 105, width: 310, height: 25, content: "Data Collection", fontSize: 18, fontWeight: "bold", color: "#1e40af", textAlign: "left" },
          { id: "e4", type: "text", x: 50, y: 135, width: 310, height: 100, content: "• Survey of 1,000 participants\n• Cross-sectional study design\n• Validated questionnaires\n• Random sampling method", fontSize: 13, color: "#374151", textAlign: "left" },
          { id: "e5", type: "shape", x: 410, y: 90, width: 350, height: 160, backgroundColor: "#eff6ff", shapeType: "rectangle", borderRadius: 12 },
          { id: "e6", type: "text", x: 430, y: 105, width: 310, height: 25, content: "Analysis", fontSize: 18, fontWeight: "bold", color: "#1e40af", textAlign: "left" },
          { id: "e7", type: "text", x: 430, y: 135, width: 310, height: 100, content: "• Statistical analysis (SPSS)\n• Machine learning models\n• Cross-validation\n• Significance testing (p<0.05)", fontSize: 13, color: "#374151", textAlign: "left" },
          // Results preview
          { id: "e8", type: "shape", x: 30, y: 270, width: 730, height: 150, backgroundColor: "#fef3c7", shapeType: "rectangle", borderRadius: 12 },
          { id: "e9", type: "text", x: 50, y: 290, width: 200, height: 25, content: "📊 Key Findings", fontSize: 18, fontWeight: "bold", color: "#92400e", textAlign: "left" },
          { id: "e10", type: "text", x: 50, y: 330, width: 690, height: 70, content: "Our analysis revealed a significant correlation (r=0.78, p<0.001) between the proposed algorithm and improved accuracy rates. The model achieved 94.5% accuracy on the test dataset.", fontSize: 14, color: "#78350f", textAlign: "left" },
        ],
      },
    ],
  },
];

export function FileEditorPage({ onBack }: FileEditorPageProps) {
  const [view, setView] = useState<"templates" | "editor">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "free" | "premium">("all");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [templateToPurchase, setTemplateToPurchase] = useState<Template | null>(null);
  const [isPresenting, setIsPresenting] = useState(false);

  const categories = ["all", ...new Set(templates.map(t => t.category))];

  const filteredTemplates = templates.filter(t => {
    const categoryMatch = filterCategory === "all" || t.category === filterCategory;
    const typeMatch = filterType === "all" || (filterType === "free" ? !t.isPremium : t.isPremium);
    return categoryMatch && typeMatch;
  });

  const handleSelectTemplate = (template: Template) => {
    if (template.isPremium) {
      setTemplateToPurchase(template);
      setShowPurchaseModal(true);
    } else {
      applyTemplate(template);
    }
  };

  const applyTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setSlides(JSON.parse(JSON.stringify(template.slides)));
    setCurrentSlideIndex(0);
    setView("editor");
  };

  const handlePurchase = () => {
    if (templateToPurchase) {
      applyTemplate(templateToPurchase);
      setShowPurchaseModal(false);
      setTemplateToPurchase(null);
    }
  };

  const currentSlide = slides[currentSlideIndex];

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      backgroundColor: selectedTemplate?.colors[0] || "#1a1a2e",
      elements: [],
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
  };

  const addElement = (type: SlideElement["type"], shapeType?: SlideElement["shapeType"]) => {
    const newElement: SlideElement = {
      id: `el-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === "text" ? 400 : 150,
      height: type === "text" ? 60 : 150,
      content: type === "text" ? "Click to edit text" : undefined,
      fontSize: 24,
      color: "#ffffff",
      backgroundColor: type === "shape" ? "#667eea" : undefined,
      shapeType,
    };

    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].elements.push(newElement);
    setSlides(updatedSlides);
    setSelectedElement(newElement.id);
  };

  const updateElement = (elementId: string, updates: Partial<SlideElement>) => {
    const updatedSlides = [...slides];
    const element = updatedSlides[currentSlideIndex].elements.find(e => e.id === elementId);
    if (element) {
      Object.assign(element, updates);
      setSlides(updatedSlides);
    }
  };

  const deleteElement = (elementId: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].elements = updatedSlides[currentSlideIndex].elements.filter(
      e => e.id !== elementId
    );
    setSlides(updatedSlides);
    setSelectedElement(null);
  };

  const getSelectedElementData = () => {
    if (!selectedElement || !currentSlide) return null;
    return currentSlide.elements.find(e => e.id === selectedElement);
  };

  // Template Gallery View
  if (view === "templates") {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                    <LayoutTemplate className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Presentation Templates</h1>
                    <p className="text-sm text-slate-400">Choose a template to get started</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSlides([{
                    id: "slide-1",
                    backgroundColor: "#1a1a2e",
                    elements: [
                      { id: "e1", type: "text", x: 50, y: 180, width: 700, height: 80, content: "Your Title Here", fontSize: 48, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
                    ],
                  }]);
                  setView("editor");
                }}
                className="bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" /> Blank Presentation
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Category:</span>
              <div className="flex gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                      filterCategory === cat
                        ? "bg-primary-500 text-white"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filterType === "all"
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("free")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                  filterType === "free"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Sparkles className="w-3 h-3" /> Free
              </button>
              <button
                onClick={() => setFilterType("premium")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                  filterType === "premium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Crown className="w-3 h-3" /> Premium
              </button>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900/50">
                  {/* Thumbnail */}
                  <div
                    className="aspect-video relative"
                    style={{ background: template.thumbnail }}
                  >
                    {/* Premium Badge */}
                    {template.isPremium && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/90 rounded-lg text-xs font-semibold text-yellow-900">
                        <Crown className="w-3 h-3" />
                        ${template.price}
                      </div>
                    )}
                    {!template.isPremium && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-green-500/90 rounded-lg text-xs font-semibold text-green-900">
                        <Sparkles className="w-3 h-3" />
                        Free
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {template.isPremium ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500 rounded-lg text-yellow-900 font-semibold">
                          <Lock className="w-4 h-4" /> Purchase
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-slate-900 font-semibold">
                          <Zap className="w-4 h-4" /> Use Template
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{template.category}</span>
                      <div className="flex gap-1">
                        {template.colors.slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Purchase Modal */}
        <AnimatePresence>
          {showPurchaseModal && templateToPurchase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setShowPurchaseModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Purchase Template</h2>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div
                  className="aspect-video rounded-xl mb-4"
                  style={{ background: templateToPurchase.thumbnail }}
                />

                <h3 className="text-lg font-semibold mb-2">{templateToPurchase.name}</h3>
                <p className="text-slate-400 mb-6">
                  Get access to this premium template with professional designs and layouts.
                </p>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-6">
                  <span className="text-slate-300">One-time purchase</span>
                  <span className="text-2xl font-bold text-yellow-400">${templateToPurchase.price}</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20"
                    onClick={() => setShowPurchaseModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold"
                    onClick={handlePurchase}
                  >
                    <Crown className="w-4 h-4 mr-2" /> Purchase
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Presentation Mode
  if (isPresenting && currentSlide) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ 
          backgroundColor: currentSlide.backgroundColor,
          background: currentSlide.backgroundGradient || currentSlide.backgroundColor,
        }}
        onClick={() => {
          if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
          } else {
            setIsPresenting(false);
          }
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPresenting(false);
          }}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="w-full max-w-5xl aspect-video relative overflow-hidden">
          {currentSlide.elements.map(element => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${(element.x / 800) * 100}%`,
                top: `${(element.y / 450) * 100}%`,
                width: `${(element.width / 800) * 100}%`,
                height: `${(element.height / 450) * 100}%`,
              }}
            >
              {element.type === "text" && (
                <div
                  style={{
                    fontSize: `${element.fontSize! * 1.5}px`,
                    fontWeight: element.fontWeight,
                    color: element.color,
                    textAlign: element.textAlign,
                    width: "100%",
                    height: "100%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {element.content}
                </div>
              )}
              {element.type === "shape" && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: element.backgroundColor,
                    borderRadius: element.shapeType === "circle" ? "50%" : (element.borderRadius ? `${element.borderRadius * 1.5}px` : "0"),
                    border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || "transparent"}` : "none",
                    opacity: element.opacity,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-lg text-white text-sm">
          Slide {currentSlideIndex + 1} of {slides.length} · Click to advance
        </div>
      </div>
    );
  }

  // Editor View
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Slides Panel */}
      <aside className="w-56 flex flex-col border-r border-white/10 bg-slate-900/50">
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={() => setView("templates")}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">Slides</span>
          <button
            onClick={addSlide}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                  currentSlideIndex === index
                    ? "border-primary-500"
                    : "border-transparent hover:border-white/20"
                }`}
                onClick={() => setCurrentSlideIndex(index)}
              >
                <div
                  className="aspect-video p-2 relative overflow-hidden"
                  style={{ 
                    backgroundColor: slide.backgroundColor,
                    background: slide.backgroundGradient || slide.backgroundColor,
                  }}
                >
                  {/* Mini preview of elements */}
                  {slide.elements.slice(0, 5).map(el => (
                    <div
                      key={el.id}
                      className="absolute"
                      style={{
                        left: `${(el.x / 800) * 100}%`,
                        top: `${(el.y / 450) * 100}%`,
                        width: `${(el.width / 800) * 100}%`,
                        height: `${(el.height / 450) * 100}%`,
                      }}
                    >
                      {el.type === "text" && (
                        <div 
                          className="text-[4px] truncate overflow-hidden"
                          style={{ color: el.color }}
                        >
                          {el.content?.slice(0, 15)}
                        </div>
                      )}
                      {el.type === "shape" && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: el.backgroundColor,
                            borderRadius: el.shapeType === "circle" ? "50%" : (el.borderRadius ? `${el.borderRadius / 4}px` : "0"),
                            opacity: el.opacity || 1,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-1 left-1 text-[10px] text-white/50">
                  {index + 1}
                </div>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(index);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Editor */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <header className="h-12 border-b border-white/10 bg-slate-900/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/10"
              onClick={() => addElement("text")}
            >
              <Type className="w-4 h-4 mr-1" /> Text
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/10"
              onClick={() => addElement("image")}
            >
              <ImageIcon className="w-4 h-4 mr-1" /> Image
            </Button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/10 px-2"
              onClick={() => addElement("shape", "rectangle")}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/10 px-2"
              onClick={() => addElement("shape", "circle")}
            >
              <Circle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/10 px-2"
              onClick={() => addElement("shape", "line")}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/10"
              onClick={() => setIsPresenting(true)}
            >
              <Play className="w-4 h-4 mr-1" /> Present
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary-500 to-accent-500"
            >
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-slate-900/30 p-8 overflow-auto">
          {currentSlide && (
            <div
              className="relative shadow-2xl overflow-hidden"
              style={{
                width: "800px",
                height: "450px",
                backgroundColor: currentSlide.backgroundColor,
                background: currentSlide.backgroundGradient || currentSlide.backgroundColor,
              }}
              onClick={() => setSelectedElement(null)}
            >
              {currentSlide.elements.map(element => (
                <div
                  key={element.id}
                  className={`absolute cursor-move ${
                    selectedElement === element.id ? "ring-2 ring-primary-500" : ""
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement(element.id);
                  }}
                >
                  {element.type === "text" && (
                    <textarea
                      value={element.content}
                      onChange={(e) => updateElement(element.id, { content: e.target.value })}
                      className="w-full h-full bg-transparent border-none resize-none focus:outline-none"
                      style={{
                        fontSize: element.fontSize,
                        fontWeight: element.fontWeight,
                        color: element.color,
                        textAlign: element.textAlign,
                        whiteSpace: "pre-wrap",
                      }}
                    />
                  )}
                  {element.type === "shape" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: element.backgroundColor,
                        borderRadius: element.shapeType === "circle" ? "50%" : (element.borderRadius ? `${element.borderRadius}px` : "0"),
                        border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || "transparent"}` : "none",
                        opacity: element.opacity,
                      }}
                    />
                  )}
                  {element.type === "image" && (
                    <div className="w-full h-full bg-slate-700/50 flex items-center justify-center border-2 border-dashed border-white/20 rounded">
                      <ImageIcon className="w-8 h-8 text-slate-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="h-12 border-t border-white/10 bg-slate-900/50 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-400">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={currentSlideIndex === slides.length - 1}
            onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>

      {/* Properties Panel */}
      {selectedElement && getSelectedElementData() && (
        <aside className="w-64 border-l border-white/10 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Properties</h3>
            <button
              onClick={() => deleteElement(selectedElement)}
              className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {getSelectedElementData()?.type === "text" && (
            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={getSelectedElementData()?.fontSize || 24}
                  onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-slate-500">{getSelectedElementData()?.fontSize}px</span>
              </div>

              {/* Font Style */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Style</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateElement(selectedElement, { 
                      fontWeight: getSelectedElementData()?.fontWeight === "bold" ? "normal" : "bold" 
                    })}
                    className={`p-2 rounded ${getSelectedElementData()?.fontWeight === "bold" ? "bg-primary-500" : "bg-white/10"}`}
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/10 rounded">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/10 rounded">
                    <Underline className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alignment */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Alignment</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateElement(selectedElement, { textAlign: "left" })}
                    className={`p-2 rounded ${getSelectedElementData()?.textAlign === "left" ? "bg-primary-500" : "bg-white/10"}`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateElement(selectedElement, { textAlign: "center" })}
                    className={`p-2 rounded ${getSelectedElementData()?.textAlign === "center" ? "bg-primary-500" : "bg-white/10"}`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateElement(selectedElement, { textAlign: "right" })}
                    className={`p-2 rounded ${getSelectedElementData()?.textAlign === "right" ? "bg-primary-500" : "bg-white/10"}`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Text Color</label>
                <div className="flex gap-2">
                  {["#ffffff", "#000000", "#e94560", "#667eea", "#4facfe", "#71b280"].map(color => (
                    <button
                      key={color}
                      onClick={() => updateElement(selectedElement, { color })}
                      className={`w-6 h-6 rounded-full border-2 ${getSelectedElementData()?.color === color ? "border-primary-500" : "border-white/20"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {getSelectedElementData()?.type === "shape" && (
            <div className="space-y-4">
              {/* Background Color */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fill Color</label>
                <div className="flex flex-wrap gap-2">
                  {["#667eea", "#e94560", "#4facfe", "#71b280", "#fa709a", "#fee140", "#ffffff", "#000000"].map(color => (
                    <button
                      key={color}
                      onClick={() => updateElement(selectedElement, { backgroundColor: color })}
                      className={`w-6 h-6 rounded-full border-2 ${getSelectedElementData()?.backgroundColor === color ? "border-primary-500" : "border-white/20"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
