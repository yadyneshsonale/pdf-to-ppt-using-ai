#!/usr/bin/env python3
"""
SlideWeaver v5 — PDF to LaTeX Presentation Pipeline

Requirements:
    pip install pydantic requests pymupdf pdfplumber tqdm

Usage:
    python3 main.py process --input paper.pdf --out ./output --api-token hf_xxx
"""
import sys
import argparse
import subprocess
from pathlib import Path
from tqdm import tqdm

from section_divider import PDFParser
from llm_wrapper import HuggingFaceLLM
from chunk_summarizer import ChunkSummarizer
from llm_latex_generator import LLMLatexGenerator
from slide_generator import SlideGenerator


def main():
    parser = argparse.ArgumentParser("slideweaver", 
        description="PDF → Chunk Summaries → Slides → LaTeX → PDF")
    subparsers = parser.add_subparsers(dest="cmd", required=True)
    
    proc = subparsers.add_parser("process", help="Process document to presentation")
    proc.add_argument("--input", "-i", required=True, help="Input PDF file")
    proc.add_argument("--out", "-o", default="./output", help="Output directory")
    proc.add_argument("--api-token", required=True, help="HuggingFace API token")
    proc.add_argument("--model", default="meta-llama/Llama-3.2-3B-Instruct", 
                     help="LLM model name")
    proc.add_argument("--title", default="Presentation", help="Presentation title")
    proc.add_argument("--compile", action="store_true", default=True, help="Compile to PDF (default: True)")
    proc.add_argument("--no-compile", dest="compile", action="store_false", help="Skip PDF compilation")
    proc.set_defaults(func=process_command)
    
    args = parser.parse_args()
    
    if not hasattr(args, 'func'):
        parser.print_help()
        sys.exit(1)
    
    args.func(args)


def process_command(args):
    """Execute the presentation generation pipeline."""
    # Create output directory
    Path(args.out).mkdir(parents=True, exist_ok=True)

    # Prepare log file
    log_path = Path(args.out) / "logs.txt"
    log_path.write_text("")

    def log(msg: str):
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(msg.rstrip() + "\n")

    log(f"INPUT: {args.input}")
    log(f"OUTPUT DIR: {Path(args.out).absolute()}")
    log(f"TITLE: {args.title}")
    log(f"MODEL: {args.model}")
    log(f"COMPILE: {args.compile}")
    
    # Initialize LLM
    llm = HuggingFaceLLM(args.api_token, args.model)
    
    # Pipeline with progress tracking
    with tqdm(total=5, desc="Overall Progress", unit="step", ncols=80) as pbar:
        
        # Step 1: Extract and chunk PDF
        pbar.set_description("📄 Extracting PDF")
        parser = PDFParser(args.input)
        chunks = parser.get_chunks()
        log(f"STEP1: extracted {len(chunks)} chunks")
        pbar.update(1)
        
        # Step 2: Summarize chunks
        pbar.set_description("📝 Summarizing chunks")
        summarizer = ChunkSummarizer(llm)
        chunk_summaries = summarizer.get_summary(chunks)
        log(f"STEP2: summarized chunks -> {len(chunk_summaries)} summaries")
        pbar.update(1)
        
        # Step 3: Generate slides
        pbar.set_description("🎯 Generating slides")
        slide_maker = SlideGenerator(llm)
        slides = slide_maker.generate(chunk_summaries)
        log("STEP3: slides generated")
        log("--- SLIDES BEGIN ---")
        log(slides)
        log("--- SLIDES END ---")
        
        # Save slides for reference
        slides_file = Path(args.out) / "slides.txt"
        with open(slides_file, "w", encoding="utf-8") as f:
            f.write(slides)
        pbar.update(1)
        
        # Step 4: Generate LaTeX (with retry)
        pbar.set_description("📐 Generating LaTeX")
        latex_generator = LLMLatexGenerator(llm)
        latex_code = None
        max_retries = 5
        retry_count = 0
        
        while retry_count < max_retries:
            latex_code = latex_generator.generate(slides, title=args.title)
            
            if latex_code and len(latex_code) >= 100:
                log(f"STEP4: LaTeX generated (attempt {retry_count + 1}/{max_retries})")
                break
            else:
                retry_count += 1
                log(f"STEP4: LaTeX generation failed (attempt {retry_count}/{max_retries}), retrying...")
                if retry_count >= max_retries:
                    raise ValueError(f"LaTeX generation failed after {max_retries} attempts")
        
        log("--- LATEX BEGIN ---")
        log(latex_code)
        log("--- LATEX END ---")
        
        # Save LaTeX
        tex_file = Path(args.out) / "presentation.tex"
        with open(tex_file, 'w', encoding='utf-8') as f:
            f.write(latex_code)
        pbar.update(1)
        
        # Step 5: Compile to PDF
        pbar.set_description("📕 Compiling PDF")
        pdf_path = None
        if args.compile:
            pdf_path = compile_latex_to_pdf(tex_file, args.out, log)
        log(f"STEP5: compile {'skipped' if not args.compile else 'done'}")
        pbar.update(1)


def compile_latex_to_pdf(tex_file: Path, output_dir: str, log_fn=None) -> Path:
    """Compile LaTeX to PDF using pdflatex.
    
    Args:
        tex_file: Path to .tex file
        output_dir: Output directory
        
    Returns:
        Path to generated PDF
        
    Raises:
        RuntimeError: If compilation fails
    """
    try:
        # Run pdflatex twice for proper references
        for pass_num in range(1, 3):
            result = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "-output-directory", 
                 output_dir, str(tex_file)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=120,
                check=False
            )
            if log_fn:
                log_fn(f"pdflatex pass {pass_num} returncode={result.returncode}")
            
            if result.returncode != 0 and pass_num == 2:
                # Only report error on final pass
                log_file = Path(output_dir) / "presentation.log"
                error_msg = "LaTeX compilation failed"
                
                if log_file.exists():
                    # Extract errors from log
                    with open(log_file, 'r', encoding='utf-8', errors='replace') as f:
                        log_content = f.read()
                        # Find error lines
                        error_lines = [line for line in log_content.split('\n') 
                                     if '!' in line or 'Error' in line]
                        if error_lines:
                            error_msg += f"\n  Errors: {error_lines[0]}"
                
                raise RuntimeError(error_msg)
        
        pdf_path = Path(output_dir) / "presentation.pdf"
        if not pdf_path.exists():
            raise RuntimeError("PDF compilation succeeded but file not found")
        if log_fn:
            log_fn(f"PDF generated at {pdf_path}")
        
        return pdf_path
    
    except subprocess.TimeoutExpired:
        if log_fn:
            log_fn("PDF compilation timed out (>120s)")
        raise RuntimeError("PDF compilation timed out (>120s)")
    except FileNotFoundError:
        if log_fn:
            log_fn("pdflatex not found. Install LaTeX (e.g., texlive, mactex)")
        raise RuntimeError("pdflatex not found. Install LaTeX (e.g., texlive, mactex)")
    except Exception as e:
        if isinstance(e, RuntimeError):
            if log_fn:
                log_fn(str(e))
            raise
        raise RuntimeError(f"PDF compilation error: {e}")


if __name__ == "__main__":
    main()
