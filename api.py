from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import shutil
import uuid
import json
import re
import os

from server.pdfparser.main import process_command

app = FastAPI(title="SlideWeaver API")

# Load HuggingFace API token from server-side (not exposed to client)
def get_hf_token() -> str:
    """Get HuggingFace API token from environment or token.txt file."""
    # Try environment variable first
    token = os.environ.get('HF_API_TOKEN')
    if token:
        return token
    
    # Fall back to token.txt file
    token_file = Path(__file__).parent / 'token.txt'
    if token_file.exists():
        return token_file.read_text().strip()
    
    raise RuntimeError('HuggingFace API token not configured. Set HF_API_TOKEN env var or create token.txt')

HF_API_TOKEN = get_hf_token()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create jobs directory and mount for static file serving
Path("jobs").mkdir(parents=True, exist_ok=True)
app.mount("/jobs", StaticFiles(directory="jobs"), name="jobs")


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/download/{job_id}/{filename}")
async def download_file(job_id: str, filename: str):
    file_path = Path("jobs") / job_id / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )


@app.post("/generate")
async def generate_slides(
    pdf: UploadFile = File(...),
    title: str = Form("Presentation")
):
    """Generate slides from PDF. Uses server-side HuggingFace token."""
    job_id = str(uuid.uuid4())
    workdir = Path("jobs") / job_id
    workdir.mkdir(parents=True, exist_ok=True)

    pdf_path = workdir / pdf.filename

    # Save uploaded PDF
    with open(pdf_path, "wb") as f:
        shutil.copyfileobj(pdf.file, f)

    # Argparse-like args object
    class Args:
        pass
    
    args = Args()
    args.input = str(pdf_path)
    args.out = str(workdir)
    args.model = "meta-llama/Llama-3.2-3B-Instruct"
    args.title = title
    args.compile = True
    args.api_token = HF_API_TOKEN  # Use server-side token

    try:
        process_command(args)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Read generated slides JSON for the response
    slides_json_file = workdir / "slides.json"
    slides_data = []
    
    if slides_json_file.exists():
        try:
            with open(slides_json_file, "r", encoding="utf-8") as f:
                slides_data = json.load(f)
        except json.JSONDecodeError:
            # Fallback to text parsing if JSON is invalid
            slides_file = workdir / "slides.txt"
            if slides_file.exists():
                slides_content = slides_file.read_text(encoding="utf-8")
                slides_data = parse_slides(slides_content)
    else:
        # Fallback to slides.txt if JSON doesn't exist
        slides_file = workdir / "slides.txt"
        if slides_file.exists():
            slides_content = slides_file.read_text(encoding="utf-8")
            slides_data = parse_slides(slides_content)

    return {
        "status": "success",
        "job_id": job_id,
        "pdf_path": f"/jobs/{job_id}/presentation.pdf",
        "tex_path": f"/jobs/{job_id}/presentation.tex",
        "slides": slides_data
    }


def parse_slides(content: str) -> list:
    """Parse slide content into structured slide objects."""
    slides = []
    
    # Try to parse as structured content
    slide_blocks = re.split(r'\n(?=(?:Slide|SLIDE)\s*\d+|\n---\n|#{1,2}\s+)', content.strip())
    
    for i, block in enumerate(slide_blocks):
        block = block.strip()
        if not block:
            continue
        
        lines = block.split('\n')
        title = lines[0] if lines else f"Slide {i + 1}"
        # Remove common prefixes
        title = re.sub(r'^(?:Slide|SLIDE)\s*\d+[:\.\-]?\s*', '', title)
        title = re.sub(r'^#{1,2}\s*', '', title)
        content_lines = lines[1:] if len(lines) > 1 else []
        content_text = '\n'.join(line.strip() for line in content_lines if line.strip())
        
        slides.append({
            "id": str(i + 1),
            "title": title.strip() or f"Slide {i + 1}",
            "content": content_text or "Content placeholder",
            "type": "title" if i == 0 else "content"
        })
    
    # If no slides parsed, create a default
    if not slides:
        slides.append({
            "id": "1",
            "title": "Generated Presentation",
            "content": content if content else "No content generated",
            "type": "title"
        })
    
    return slides


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)