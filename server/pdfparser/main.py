#!/usr/bin/env python3
"""
SlideWeaver v5 — PDF to JSON Slides Pipeline

Requirements:
    pip install pydantic requests pymupdf pdfplumber tqdm

Usage:
    python3 main.py process --input paper.pdf --out ./output --api-token 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
"""
import sys
import json
import argparse
from pathlib import Path
from tqdm import tqdm

from .section_divider import PDFParser
from .llm_wrapper import HuggingFaceLLM
from .chunk_summarizer import ChunkSummarizer


def main():
    parser = argparse.ArgumentParser("slideweaver", 
        description="PDF → Chunk Summaries → JSON Slides")
    subparsers = parser.add_subparsers(dest="cmd", required=True)
    
    proc = subparsers.add_parser("process", help="Process document to JSON slides")
    proc.add_argument("--input", "-i", required=True, help="Input PDF file")
    proc.add_argument("--out", "-o", default="./output", help="Output directory")
    proc.add_argument("--api-token", required=True, help="HuggingFace API token")
    proc.add_argument("--model", default="meta-llama/Llama-3.2-3B-Instruct", 
                     help="LLM model name")
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
    log(f"MODEL: {args.model}")
    
    # Initialize LLM
    llm = HuggingFaceLLM(args.api_token, args.model)
    
    # Pipeline with progress tracking
    with tqdm(total=2, desc="Overall Progress", unit="step", ncols=80) as pbar:
        
        # Step 1: Extract and chunk PDF
        pbar.set_description("📄 Extracting PDF")
        parser = PDFParser(args.input)
        chunks = parser.get_chunks()
        log(f"STEP1: extracted {len(chunks)} chunks")
        pbar.update(1)
        
        # Step 2: Summarize chunks and get JSON slides
        pbar.set_description("📝 Summarizing chunks")
        summarizer = ChunkSummarizer(llm)
        chunk_summaries = summarizer.get_summary(chunks)
        log(f"STEP2: summarized chunks -> {len(chunk_summaries)} summaries")
        pbar.update(1)
        
        # Flatten the list of lists into a single list of slide objects
        all_slides = []
        for summary in chunk_summaries:
            if isinstance(summary, list):
                all_slides.extend(summary)
            else:
                all_slides.append(summary)
        
        # Save JSON output
        output_file = Path(args.out) / "slides.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(all_slides, f, indent=4, ensure_ascii=False)
        
        log(f"OUTPUT: {len(all_slides)} slides saved to {output_file}")
        print(f"\n✅ Generated {len(all_slides)} slides -> {output_file}")
        
        return all_slides


if __name__ == "__main__":
    main()
