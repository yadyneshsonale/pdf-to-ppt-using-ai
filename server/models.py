"""
Pydantic models for SlideWeaver v4
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class Section(BaseModel):
    title: str
    level: int
    summary: str
    content: str = ""


class Equation(BaseModel):
    equation: str
    context: str
    section_title: Optional[str] = None


class Table(BaseModel):
    caption: str
    content: str
    section_title: Optional[str] = None


class ChunkSummary(BaseModel):
    chunk_num: int
    original_length: int
    summary: str
    key_points: List[str] = []


class ExtractedData(BaseModel):
    raw_text: str
    file_type: str
    total_chars: int


class Module1Output(BaseModel):
    sections: List[Section]


class Module2Output(BaseModel):
    equations: List[Equation]


class Module3Output(BaseModel):
    tables: List[Table]


class CombinedOutput(BaseModel):
    sections: List[Section]
    equations: List[Equation]
    tables: List[Table]
    chunk_summaries: List[ChunkSummary]
