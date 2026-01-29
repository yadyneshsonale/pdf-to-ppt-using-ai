"""
Chunk summarization using LLM
"""
import re
import json
import tqdm
from typing import List, Dict, Union
from collections import defaultdict
from .llm_wrapper import HuggingFaceLLM


class ChunkSummarizer:
    """Generate LLM summaries for each chunk."""
    
    def __init__(self, llm: HuggingFaceLLM):
        self.llm = llm
        self.summaries = {}
    
    def extract_json_from_response(self, response: str) -> list:
        """Extract JSON objects from LLM response."""
        # Remove markdown code blocks if present
        cleaned = re.sub(r'```(?:json)?\s*', '', response)
        cleaned = re.sub(r'```', '', cleaned)
        cleaned = cleaned.strip()
        
        # Find all JSON objects
        json_strings = re.findall(r'\{[^{}]*\}', cleaned, re.DOTALL)
        objects = []
        for s in json_strings:
            try:
                objects.append(json.loads(s))
            except json.JSONDecodeError:
                continue
        
        return objects if objects else []
    
    def summarize_chunk(self, chunk: str, chunk_num: int, max_retries: int = 2) -> List:
        """Generate summary for a single chunk using LLM."""   

        if chunk_num == 1:
            prompt = f"""
Given below text is a part of a research paper. Generate slide content from this text.

Provide your response as a JSON object with the following structure:
{{
    "slide_title": "<Title for the slide>",
    "content": "<Slide content summarizing key points (2-3 bullet points or small paragraphs)>",
    "paper_title": "<Paper Title if available, otherwise null>",
    "authors": "<Author 1, Author 2, ... if available, otherwise null>"
}}

Note: Do not make up the paper titles. It is usually present above the abstract.

Below is the text:
{chunk}
"""
        else:   
            prompt = f"""
Given below text is a part of a research paper. Generate slide content from this text.

Provide your response as a JSON object with the following structure:
{{
    "slide_title": "<Title for the slide>",
    "content": "<Slide content summarizing key points (2-3 bullet points or small paragraphs)>"
}}

Below is the text:
{chunk}
"""

        for attempt in range(max_retries):
            response = self.llm.generate(prompt, max_tokens=1024)
            
            if response:
                parsed_json = self.extract_json_from_response(response)
                if parsed_json:
                    return parsed_json
                else:
                    print(f"Attempt {attempt + 1}/{max_retries}: Failed to extract JSON, retrying...")
            else:
                print(f"Attempt {attempt + 1}/{max_retries}: No LLM response, retrying...")
        
        print(f"All {max_retries} attempts failed for chunk {chunk_num}")
        return [{"slide_title": f"Chunk {chunk_num}", "content": "Failed to generate content"}]

    def extract_sections(self, text: str) -> dict:
        pattern = re.compile(
            r'(?m)^(\d+(?:\.\d+)*(?:\s+[a-z]\))?):\n(.*?)(?=\n\d+(?:\.\d+)*(?:\s+[a-z]\))?:|\Z)',
            re.DOTALL
        )

        sections = {}
        for match in pattern.finditer(text):
            section_id = match.group(1).strip()
            content = match.group(2).strip().replace("\n", " ")
            sections[section_id] = content

        return sections
    
    def group_sections(self, data: dict) -> dict:
        grouped = defaultdict(str)

        for key, value in data.items():
            # Top-level section (before first dot)
            parent = key.split('.')[0]

            if grouped[parent]:
                grouped[parent] += f"{key}:\n" + value
            else:
                grouped[parent] = f"{key}:\n" + value

        return dict(grouped)

    def add_dict(self, temp_dic: dict):
        for key, value in temp_dic.items():
            if key in self.summaries:
                self.summaries[key] += " " + value
            else:
                self.summaries[key] = value

    def get_summary(self, groups: list):
        input_output_pairs = []
        summaries = []
        for i in tqdm.tqdm(range(len(groups))):
            group = groups[i]
            summary_dict = self.summarize_chunk(group, i + 1)
            
            # Store in self.summaries with chunk number as key
            chunk_key = f"chunk_{i + 1}"
            self.summaries[chunk_key] = summary_dict
            
            input_output_pairs.append({"input": group, "output": summary_dict})
            summaries.append(summary_dict)
        
        return summaries