import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Pricing } from "./components/Pricing";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";
import { EditorPage } from "./components/EditorPage";
import { TemplatesPage } from "./components/TemplatesPage";
import { SignInPage } from "./components/SignInPage";
import { SignUpPage } from "./components/SignUpPage";
import { FileEditorPage } from "./components/FileEditorPage";
import { UserDashboard } from "./components/UserDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { GenerateResponse, Slide } from "./services/api";

type Page = "landing" | "signin" | "signup" | "templates" | "editor" | "files" | "dashboard" | "admin";

interface PresentationData {
  jobId: string;
  slides: Slide[];
  pdfPath: string;
  texPath: string;
  title: string;
}

// Store uploaded file data to pass between pages
interface UploadData {
  file: File;
  title: string;
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const handleSelectPlan = (plan: string) => {
    if (plan === "Free") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert(`Redirecting to ${plan} plan checkout...`);
    }
  };

  const handleGetStarted = () => {
    if (currentPage === "landing") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage("landing");
    }
  };

  // New flow: Upload -> Templates -> API -> Editor
  const handleFileUpload = (file: File, title: string) => {
    setUploadData({ file, title });
    setCurrentPage("templates");
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Template selection now handled by TemplatesPage which will call API
  };

  const handleGenerationComplete = (response: GenerateResponse, title: string, templateId: string) => {
    setPresentationData({
      jobId: response.job_id,
      slides: response.slides,
      pdfPath: response.pdf_path,
      texPath: response.tex_path,
      title,
    });
    setSelectedTemplate(templateId);
    setCurrentPage("editor");
  };

  // Legacy handler kept for compatibility
  const handleUploadComplete = (response: GenerateResponse, title: string) => {
    setPresentationData({
      jobId: response.job_id,
      slides: response.slides,
      pdfPath: response.pdf_path,
      texPath: response.tex_path,
      title,
    });
    setCurrentPage("editor");
  };

  const handleLogout = async () => {
    await logout();
    setPresentationData(null);
    setCurrentPage("landing");
  };

  const handleSignIn = () => {
    setCurrentPage("landing");
  };

  const handleSignUp = () => {
    setCurrentPage("landing");
  };

  if (currentPage === "signin") {
    return (
      <SignInPage 
        onBack={() => setCurrentPage("landing")} 
        onSignIn={handleSignIn}
        onSignUp={() => setCurrentPage("signup")}
      />
    );
  }

  if (currentPage === "signup") {
    return (
      <SignUpPage 
        onBack={() => setCurrentPage("landing")} 
        onSignUp={handleSignUp}
        onSignIn={() => setCurrentPage("signin")}
      />
    );
  }

  if (currentPage === "dashboard") {
    if (!isAuthenticated) {
      setCurrentPage("signin");
      return null;
    }
    return (
      <UserDashboard 
        onBack={() => setCurrentPage("landing")}
        onEditPpt={(pptId) => {
          // TODO: Load PPT data and navigate to editor
          console.log('Edit PPT:', pptId);
        }}
      />
    );
  }

  if (currentPage === "admin") {
    if (!isAuthenticated || !isAdmin) {
      setCurrentPage("landing");
      return null;
    }
    return (
      <AdminDashboard onBack={() => setCurrentPage("landing")} />
    );
  }

  if (currentPage === "files") {
    return (
      <FileEditorPage onBack={() => setCurrentPage("landing")} />
    );
  }

  if (currentPage === "templates") {
    return (
      <TemplatesPage 
        onBack={() => {
          setUploadData(null);
          setCurrentPage("landing");
        }}
        onSelect={handleTemplateSelect}
        uploadData={uploadData}
        onGenerationComplete={handleGenerationComplete}
      />
    );
  }

  if (currentPage === "editor") {
    return (
      <EditorPage 
        onLogout={handleLogout}
        initialSlides={presentationData?.slides}
        jobId={presentationData?.jobId}
        pdfPath={presentationData?.pdfPath}
        title={presentationData?.title}
        selectedTemplate={selectedTemplate}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        onGetStarted={handleGetStarted} 
        onSignIn={() => setCurrentPage("signin")}
        onFiles={() => setCurrentPage("files")}
        onDashboard={() => setCurrentPage("dashboard")}
        onAdmin={() => setCurrentPage("admin")}
        isLoggedIn={isAuthenticated}
        isAdmin={isAdmin}
        userName={user?.name || user?.email}
        onLogout={handleLogout}
      />
      <Hero onFileUpload={handleFileUpload} />
      <div id="features">
        <Features />
      </div>
      <HowItWorks />
      <Pricing onSelectPlan={handleSelectPlan} />
      <div id="testimonials">
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
