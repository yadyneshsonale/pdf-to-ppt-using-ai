import { createContext, useContext, useState, ReactNode } from 'react';
import type { Slide, GenerateResponse } from '../services/api';

interface PresentationState {
  jobId: string | null;
  slides: Slide[];
  pdfPath: string | null;
  texPath: string | null;
  title: string;
  isLoading: boolean;
  error: string | null;
}

interface PresentationContextType extends PresentationState {
  setPresentation: (response: GenerateResponse, title: string) => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  addSlide: () => void;
  deleteSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: PresentationState = {
  jobId: null,
  slides: [],
  pdfPath: null,
  texPath: null,
  title: 'Presentation',
  isLoading: false,
  error: null,
};

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PresentationState>(initialState);

  const setPresentation = (response: GenerateResponse, title: string) => {
    setState({
      jobId: response.job_id,
      slides: response.slides,
      pdfPath: response.pdf_path,
      texPath: response.tex_path,
      title,
      isLoading: false,
      error: null,
    });
  };

  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    setState(prev => ({
      ...prev,
      slides: prev.slides.map(slide =>
        slide.id === slideId ? { ...slide, ...updates } : slide
      ),
    }));
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: `new-${Date.now()}`,
      title: 'New Slide',
      content: 'Add your content here...',
      type: 'content',
    };
    setState(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
  };

  const deleteSlide = (slideId: string) => {
    setState(prev => ({
      ...prev,
      slides: prev.slides.filter(slide => slide.id !== slideId),
    }));
  };

  const reorderSlides = (fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newSlides = [...prev.slides];
      const [removed] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, removed);
      return { ...prev, slides: newSlides };
    });
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <PresentationContext.Provider
      value={{
        ...state,
        setPresentation,
        updateSlide,
        addSlide,
        deleteSlide,
        reorderSlides,
        setLoading,
        setError,
        reset,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}
