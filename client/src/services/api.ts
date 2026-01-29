/**
 * API Service for SlideWeaver
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Internal normalized slide structure used throughout the app
 */
export interface Slide {
  id: string;
  title: string;
  content: string;
  type: "title" | "content" | "image";
  paperTitle?: string | null;
  authors?: string | null;
  layout?: string;
  elements?: SlideElement[];
}

/**
 * Slide element for advanced editing (images, tables, shapes, etc.)
 */
export interface SlideElement {
  id: string;
  type: "text" | "image" | "table" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  src?: string;
  data?: unknown;
}

/**
 * Raw API slide object format (new format from backend)
 */
export interface ApiSlideObject {
  slide_title?: string;
  content?: string;
  paper_title?: string | null;
  authors?: string | null;
  // Legacy fields for backwards compatibility
  id?: string;
  title?: string;
  type?: "title" | "content" | "image";
}

export interface GenerateResponse {
  status: string;
  job_id: string;
  pdf_path: string;
  tex_path: string;
  slides: Slide[];
}

/**
 * Raw API response before normalization
 */
interface RawApiResponse {
  status: string;
  job_id: string;
  pdf_path: string;
  tex_path: string;
  slides: ApiSlideObject[];
}

export interface GenerateProgress {
  status: 'uploading' | 'processing' | 'generating' | 'compiling' | 'complete' | 'error';
  message: string;
  progress: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Normalize a single API slide object to internal Slide format
 * Handles both new format (slide_title, content) and legacy format (title, content, id)
 */
function normalizeSlide(apiSlide: ApiSlideObject, index: number): Slide {
  // Handle new API format (slide_title) or legacy format (title)
  const title = apiSlide.slide_title || apiSlide.title || `Slide ${index + 1}`;
  const content = apiSlide.content || '';
  const id = apiSlide.id || `slide-${index + 1}`;
  
  // Determine slide type: first slide is typically title slide
  const type = apiSlide.type || (index === 0 ? 'title' : 'content');
  
  return {
    id,
    title: title.trim(),
    content: content.trim(),
    type,
    paperTitle: apiSlide.paper_title ?? null,
    authors: apiSlide.authors ?? null,
    layout: 'default',
    elements: [],
  };
}

/**
 * Normalize the entire API response to internal format
 * Handles array of slide objects and preserves order
 */
function normalizeApiResponse(rawResponse: RawApiResponse): GenerateResponse {
  const slides = rawResponse.slides;
  
  // Validate response
  if (!Array.isArray(slides)) {
    console.warn('API response slides is not an array, using empty array');
    return {
      ...rawResponse,
      slides: [{
        id: 'slide-1',
        title: 'No Content',
        content: 'The API returned no slide content. Please try again.',
        type: 'title',
        layout: 'default',
        elements: [],
      }],
    };
  }
  
  // Handle empty array
  if (slides.length === 0) {
    console.warn('API returned empty slides array');
    return {
      ...rawResponse,
      slides: [{
        id: 'slide-1',
        title: 'No Slides Generated',
        content: 'The document could not be converted to slides. Please try a different file.',
        type: 'title',
        layout: 'default',
        elements: [],
      }],
    };
  }
  
  // Normalize each slide, preserving order
  const normalizedSlides: Slide[] = slides.map((slide, index) => {
    try {
      return normalizeSlide(slide, index);
    } catch (error) {
      console.error(`Error normalizing slide ${index}:`, error);
      return {
        id: `slide-${index + 1}`,
        title: `Slide ${index + 1}`,
        content: 'Error loading slide content',
        type: 'content' as const,
        layout: 'default',
        elements: [],
      };
    }
  });
  
  return {
    status: rawResponse.status,
    job_id: rawResponse.job_id,
    pdf_path: rawResponse.pdf_path,
    tex_path: rawResponse.tex_path,
    slides: normalizedSlides,
  };
}

/**
 * Check if the API server is healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Generate presentation slides from a PDF file
 * Uses API token from environment variables
 */
export async function generatePresentation(
  file: File,
  title: string,
  onProgress?: (progress: GenerateProgress) => void
): Promise<GenerateResponse> {
  // Validate inputs
  if (!file) {
    throw new ApiError('No file provided');
  }

  // Create form data (no API token - handled server-side)
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('title', title || 'Presentation');

  // Report upload progress
  onProgress?.({
    status: 'uploading',
    message: 'Uploading your PDF...',
    progress: 10
  });

  try {
    onProgress?.({
      status: 'processing',
      message: 'Processing your document...',
      progress: 30
    });

    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || 'Failed to generate presentation',
        response.status,
        JSON.stringify(errorData)
      );
    }

    onProgress?.({
      status: 'complete',
      message: 'Presentation generated successfully!',
      progress: 100
    });

    // Parse raw response and normalize to internal format
    const rawData: RawApiResponse = await response.json();
    const normalizedData = normalizeApiResponse(rawData);
    return normalizedData;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Unable to connect to the server. Please make sure the backend is running.',
        0,
        'Network error'
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

/**
 * Get the download URL for a generated file
 */
export function getDownloadUrl(jobId: string, filename: string): string {
  return `${API_BASE_URL}/download/${jobId}/${filename}`;
}

/**
 * Get the static file URL
 */
export function getFileUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Download a file from the server
 */
export async function downloadFile(jobId: string, filename: string): Promise<void> {
  const url = getDownloadUrl(jobId, filename);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError('Failed to download file', response.status);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to download file'
    );
  }
}
