"""
Chunk summarization using LLM
"""
import re
import tqdm
from typing import List, Dict, Any
from collections import defaultdict
from .llm_wrapper import HuggingFaceLLM
from .models import ChunkSummary


class ChunkSummarizer:
    """Generate LLM summaries for each chunk."""
    
    def __init__(self, llm: HuggingFaceLLM):
        self.llm = llm
        self.summaries = {}
    
    def summarize_chunk(self, chunk: str, chunk_num: int) -> str:
        """Generate summary for a single chunk using LLM."""   

        if chunk_num == 1:
            prompt = f"""
    Given below text is a part of a research paper. Generate slide content from this text.

    Provide:
    1. An appropriate, concise title for the slide
    2. Slide content summarizing the key points (2-3 bullet points or very small paragraphs)

    Output format:
    Slide Title: <Title>
    Content:
    <Slide content>

    Also include the paper title and authors if available in the text:
    Title: <Paper Title>
    Authors: <Author 1>, <Author 2>, ...

    Note: Do not make up the paper titles. It is usually present above the abstract.

    Below is the text:
    {chunk}
    """

        else:   
            prompt = f"""
    Given below text is a part of a research paper. Generate slide content from this text.

    Provide:
    1. An appropriate, concise title for the slide
    2. Slide content summarizing the key points (2-3 bullet points or very small paragraphs)

    Output format:
    Slide Title: <Title>
    Content:
    <Slide content>

    Below is the text:
    {chunk}
    """

        response = self.llm.generate(prompt, max_tokens=1024)
        
        summary_text = response.strip() if response else f"Content from chunk {chunk_num} (no LLM response)."
        
        return summary_text

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
            summary = self.summarize_chunk(group, i + 1)
            temp_dict = self.extract_sections(summary)
            self.add_dict(temp_dict)
            input_output_pairs.append({"input": group, "output": summary})
            summaries.append(summary)
        
        return summaries
