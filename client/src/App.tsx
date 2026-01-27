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
import type { GenerateResponse, Slide } from "./services/api";

type Page = "landing" | "signin" | "signup" | "templates" | "editor" | "files";

interface PresentationData {
  jobId: string;
  slides: Slide[];
  pdfPath: string;
  texPath: string;
  title: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentPage("editor");
  };

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

  const handleLogout = () => {
    setPresentationData(null);
    setIsLoggedIn(false);
    setCurrentPage("landing");
  };

  const handleSignIn = () => {
    setIsLoggedIn(true);
    setCurrentPage("landing");
  };

  const handleSignUp = () => {
    setIsLoggedIn(true);
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

  if (currentPage === "files") {
    return (
      <FileEditorPage onBack={() => setCurrentPage("landing")} />
    );
  }

  if (currentPage === "templates") {
    return (
      <TemplatesPage 
        onBack={() => setCurrentPage("landing")}
        onSelect={handleTemplateSelect}
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
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        onGetStarted={handleGetStarted} 
        onSignIn={() => setCurrentPage("signin")}
        onFiles={() => setCurrentPage("files")}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <Hero onUploadComplete={handleUploadComplete} />
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
