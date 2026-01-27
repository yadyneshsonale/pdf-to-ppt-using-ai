/**
 * API Service for SlideWeaver
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN || '';

export interface Slide {
  id: string;
  title: string;
  content: string;
  type: "title" | "content" | "image";
}

export interface GenerateResponse {
  status: string;
  job_id: string;
  pdf_path: string;
  tex_path: string;
  slides: Slide[];
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
  if (!HF_API_TOKEN) {
    throw new ApiError('API configuration error. Please contact support.');
  }

  // Create form data
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('title', title || 'Presentation');
  formData.append('api_token', HF_API_TOKEN);

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

    const data: GenerateResponse = await response.json();
    return data;

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
