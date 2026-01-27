"""PDF Parser - Uses PyMuPDF (fitz) for text extraction with Pydantic models.

Uses font size analysis to detect section headings - no hardcoded patterns.
"""

import re
from typing import Dict, List, Optional, Tuple
from collections import Counter

try:
    from tqdm import tqdm
except ImportError:
    def tqdm(iterable, **kwargs):
        return iterable

try:
    import fitz  # PyMuPDF
except ImportError:
    raise ImportError("PyMuPDF is required. Install with: pip install PyMuPDF")

try:
    from pydantic import BaseModel, Field
    PYDANTIC_AVAILABLE = True
except ImportError:
    PYDANTIC_AVAILABLE = False
    from dataclasses import dataclass as BaseModel
    def Field(default=None, **kwargs):
        return default


# ============================================================================
# Pydantic Models for Document Structure
# ============================================================================

if PYDANTIC_AVAILABLE:
    class Figure(BaseModel):
        """Represents a figure in the document."""
        id: int = Field(description="Figure object ID in PDF")
        caption: str = Field(default="", description="Figure caption if detected")
        width: Optional[int] = Field(default=None, description="Image width in pixels")
        height: Optional[int] = Field(default=None, description="Image height in pixels")
        page: Optional[int] = Field(default=None, description="Page number where figure appears")
        
    class Table(BaseModel):
        """Represents a table in the document."""
        id: int = Field(description="Table identifier")
        caption: str = Field(default="", description="Table caption if detected")
        content: List[List[str]] = Field(default_factory=list, description="Table data as rows")
        raw_text: str = Field(default="", description="Raw text content of table")
        
    class Equation(BaseModel):
        """Represents an equation in the document."""
        id: int = Field(description="Equation identifier")
        content: str = Field(default="", description="Equation content/LaTeX")
        label: str = Field(default="", description="Equation label/number")
        
    class Reference(BaseModel):
        """Represents a citation/reference."""
        id: int = Field(description="Reference number")
        text: str = Field(default="", description="Full reference text")
        authors: str = Field(default="", description="Author names")
        year: str = Field(default="", description="Publication year")
        title: str = Field(default="", description="Paper/book title")
        
    class Section(BaseModel):
        """Represents a section of the document."""
        number: str = Field(default="", description="Section number (e.g., '1', '2.1', 'A')")
        title: str = Field(description="Section title/heading")
        level: int = Field(default=1, description="Heading level (1=main, 2=subsection, etc.)")
        content: str = Field(default="", description="Text content of the section")
        figures: List[Figure] = Field(default_factory=list, description="Figures in this section")
        tables: List[Table] = Field(default_factory=list, description="Tables in this section")
        equations: List[Equation] = Field(default_factory=list, description="Equations in this section")
        subsections: List["Section"] = Field(default_factory=list, description="Nested subsections")
        
    class DocumentMetadata(BaseModel):
        """Document metadata extracted from PDF."""
        title: str = Field(default="", description="Document title")
        authors: List[str] = Field(default_factory=list, description="Author names")
        abstract: str = Field(default="", description="Document abstract")
        keywords: List[str] = Field(default_factory=list, description="Keywords")
        
    class Document(BaseModel):
        """Represents the full parsed document."""
        metadata: DocumentMetadata = Field(default_factory=DocumentMetadata)
        sections: Dict[int, Section] = Field(default_factory=dict, description="Document sections by index")
        figures: List[Figure] = Field(default_factory=list, description="All figures in document")
        tables: List[Table] = Field(default_factory=list, description="All tables in document")
        references: List[Reference] = Field(default_factory=list, description="Bibliography/references")
        raw_text: str = Field(default="", description="Full raw text of document")
        
        def get_section(self, num: int) -> Optional[Section]:
            """Get section by number."""
            return self.sections.get(num)
        
        def to_dict(self) -> Dict[int, str]:
            """Convert to simple dict format: {section_num: 'TITLE\\n\\ncontent...'}"""
            result = {}
            for num, section in self.sections.items():
                parts = [section.title, section.content]
                if section.figures:
                    parts.append("\n".join(f"[Figure {f.id}: {f.caption}]" for f in section.figures))
                if section.tables:
                    parts.append("\n".join(f"[Table {t.id}: {t.caption}]" for t in section.tables))
                result[num] = "\n\n".join(parts)
            return result

else:
    # Fallback dataclasses if Pydantic not installed
    from dataclasses import dataclass, field
    
    @dataclass
    class Figure:
        id: int
        caption: str = ""
        width: Optional[int] = None
        height: Optional[int] = None
        page: Optional[int] = None
        
    @dataclass
    class Table:
        id: int
        caption: str = ""
        content: List[List[str]] = field(default_factory=list)
        raw_text: str = ""
        
    @dataclass
    class Equation:
        id: int
        content: str = ""
        label: str = ""
        
    @dataclass
    class Reference:
        id: int
        text: str = ""
        authors: str = ""
        year: str = ""
        title: str = ""
        
    @dataclass
    class Section:
        title: str
        number: str = ""
        level: int = 1
        content: str = ""
        figures: List[Figure] = field(default_factory=list)
        tables: List[Table] = field(default_factory=list)
        equations: List[Equation] = field(default_factory=list)
        subsections: List["Section"] = field(default_factory=list)
        
    @dataclass
    class DocumentMetadata:
        title: str = ""
        authors: List[str] = field(default_factory=list)
        abstract: str = ""
        keywords: List[str] = field(default_factory=list)
        
    @dataclass
    class Document:
        metadata: DocumentMetadata = field(default_factory=DocumentMetadata)
        sections: Dict[int, Section] = field(default_factory=dict)
        figures: List[Figure] = field(default_factory=list)
        tables: List[Table] = field(default_factory=list)
        references: List[Reference] = field(default_factory=list)
        raw_text: str = ""
        
        def get_section(self, num: int) -> Optional[Section]:
            return self.sections.get(num)
        
        def to_dict(self) -> Dict[int, str]:
            result = {}
            for num, section in self.sections.items():
                parts = [section.title, section.content]
                result[num] = "\n\n".join(parts)
            return result


class PDFParser:
    """PDF Parser using PyMuPDF (fitz) for text extraction.
    
    Uses font size analysis to detect section headings automatically.
    """
    
    def __init__(self, pdf_path: str):
        """Initialize with path to PDF file."""
        self.pdf_path = pdf_path
        self.doc = fitz.open(pdf_path)
        self.full_text = ""
        self.pages_text: List[str] = []
        self.text_blocks: List[dict] = []  # Blocks with font info
        self._extract_text_with_fonts()
    
    def _extract_text_with_fonts(self):
        """Extract text from all pages with font information."""
        all_blocks = []
        
        for page_num in tqdm(range(len(self.doc)), desc="Extracting text"):
            page = self.doc[page_num]
            
            # Get text as dict with font information
            blocks = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)["blocks"]
            
            for block in blocks:
                if block.get("type") == 0:  # Text block
                    for line in block.get("lines", []):
                        line_text = ""
                        line_fonts = []
                        
                        for span in line.get("spans", []):
                            text = span.get("text", "")
                            font_size = span.get("size", 0)
                            font_name = span.get("font", "")
                            flags = span.get("flags", 0)  # bold, italic, etc.
                            
                            line_text += text
                            if text.strip():
                                line_fonts.append({
                                    "size": font_size,
                                    "font": font_name,
                                    "flags": flags,
                                    "bold": bool(flags & 2**4),  # Bold flag
                                })
                        
                        if line_text.strip():
                            # Calculate dominant font size for this line
                            if line_fonts:
                                avg_size = sum(f["size"] for f in line_fonts) / len(line_fonts)
                                is_bold = any(f["bold"] for f in line_fonts)
                            else:
                                avg_size = 0
                                is_bold = False
                            
                            all_blocks.append({
                                "text": line_text.strip(),
                                "font_size": avg_size,
                                "bold": is_bold,
                                "page": page_num,
                            })
            
            # Also get plain text for full_text
            self.pages_text.append(page.get_text("text"))
        
        self.text_blocks = all_blocks
        self.full_text = "\n\n".join(self.pages_text)
    
    def _analyze_font_sizes(self) -> Tuple[float, float]:
        """Analyze font sizes to determine body text size and heading threshold.
        
        Returns (body_font_size, heading_threshold)
        """
        if not self.text_blocks:
            return 10.0, 12.0
        
        # Count font sizes weighted by text length
        size_counts = Counter()
        for block in self.text_blocks:
            size = round(block["font_size"], 1)
            text_len = len(block["text"])
            size_counts[size] += text_len
        
        if not size_counts:
            return 10.0, 12.0
        
        # Body text is the most common font size
        body_size = size_counts.most_common(1)[0][0]
        
        # Heading threshold: anything significantly larger than body (1.2x or more)
        heading_threshold = body_size * 1.15
        
        return body_size, heading_threshold
    
    def _detect_sections(self) -> List[Tuple[int, str, str, int]]:
        """
        Detect section headings using font-based detection.
        
        Primary indicators:
        1. Numbered text (1. INTRO, 2.1 Method) - common section pattern
        2. Larger font than body text
        
        Bold is optional enhancement, not primary.
        
        Returns list of (block_index, title, section_number, level).
        """
        if not self.text_blocks:
            return []
        
        # Find body text size (most common font size)
        font_sizes = [b["font_size"] for b in self.text_blocks if b["text"].strip()]
        if not font_sizes:
            return []
        
        size_counts = Counter(round(s, 1) for s in font_sizes)
        body_size = size_counts.most_common(1)[0][0]
        
        # Heading fonts = larger than body
        heading_fonts = sorted([s for s in size_counts.keys() if s > body_size], reverse=True)
        
        sections = []
        
        for i, block in enumerate(self.text_blocks):
            text = block["text"].strip()
            font_size = round(block["font_size"], 1)
            is_bold = block["bold"]
            
            if not text or len(text) < 3 or len(text) > 80:
                continue
            
            # Skip purely numeric
            if re.match(r'^[\d\.\,\-\s\%]+$', text):
                continue
            
            # Check for section numbering patterns:
            # 1. Arabic numerals: 1. Title, 2.1 Subtitle
            # 2. Roman numerals: I. Title, II. Title, IV.1 Subtitle
            # 3. Capital letters: A. Title, B. Title
            section_num = ""
            title = text
            level = 1
            
            # Pattern for Arabic numerals (1. or 1.1 or 1.2.3)
            arabic_match = re.match(r'^(\d+(?:\.\d+)*)[.\s]+([A-Z].*)$', text)
            
            # Pattern for Roman numerals (I. II. III. IV. V. VI. VII. VIII. IX. X. etc.)
            roman_match = re.match(r'^([IVXLCDM]+(?:\.[IVXLCDM\d]+)*)[.\s]+([A-Z].*)$', text)
            
            # Pattern for capital letters (A. B. C. or A.1 B.2)
            letter_match = re.match(r'^([A-Z](?:\.\d+)*)[.\s]+([A-Z].*)$', text)
            
            potential_num = None
            potential_title = None
            
            if arabic_match:
                potential_num = arabic_match.group(1)
                potential_title = arabic_match.group(2).strip()
                level = potential_num.count('.') + 1
            elif roman_match:
                potential_num = roman_match.group(1)
                potential_title = roman_match.group(2).strip()
                # Roman numerals: check if valid (I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII, etc.)
                roman_part = potential_num.split('.')[0]
                valid_romans = {'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 
                               'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'}
                if roman_part not in valid_romans:
                    potential_num = None
                    potential_title = None
                else:
                    level = potential_num.count('.') + 1
            elif letter_match:
                potential_num = letter_match.group(1)
                potential_title = letter_match.group(2).strip()
                # Single letter = main section, letter.number = subsection
                level = potential_num.count('.') + 1
            
            if potential_num and potential_title:
                # Validate it's a section title, not a list item
                # Section titles: short, no commas, capitalized words, min 3 chars
                words = potential_title.split()
                is_valid_title = (
                    len(potential_title) >= 3 and
                    len(potential_title) < 50 and
                    ',' not in potential_title and
                    potential_title.count('.') == 0 and
                    len(words) >= 1 and
                    # Either ALL CAPS or mostly capitalized words
                    (potential_title.isupper() or 
                     sum(1 for w in words if w[0].isupper()) >= len(words) * 0.5)
                )
                
                if is_valid_title:
                    section_num = potential_num
                    title = potential_title
            
            is_heading = False
            
            # PRIMARY: Larger font = heading (must have reasonable title length)
            if font_size in heading_fonts and len(title) >= 3:
                is_heading = True
            
            # PRIMARY: Valid numbered section (Arabic, Roman, or Letter)
            elif section_num:
                is_heading = True
            
            if is_heading:
                # Level is already set for numbered sections
                # For font-based headings, determine level from font size
                if not section_num and font_size in heading_fonts:
                    level = heading_fonts.index(font_size)
                
                sections.append((i, title, section_num, level))
        
        return sections
    
    def _merge_small_sections(self, sections: Dict[int, Section], min_content_length: int = 100) -> Dict[int, Section]:
        """
        Merge consecutive small sections into larger ones.
        
        If a section has content shorter than min_content_length, it is merged
        with the following section(s) until the combined content is large enough.
        
        Args:
            sections: Dictionary of section index -> Section
            min_content_length: Minimum content length to consider a section "complete"
        
        Returns:
            New dictionary with merged sections
        """
        if not sections:
            return sections
        
        section_list = [sections[i] for i in sorted(sections.keys())]
        
        if len(section_list) <= 1:
            return sections
        
        merged = []
        i = 0
        
        while i < len(section_list):
            current = section_list[i]
            
            # If current section is small, merge with following sections
            if len(current.content) < min_content_length and i + 1 < len(section_list):
                merge_group = [current]
                j = i + 1
                
                # Keep adding sections until we have enough content
                while j < len(section_list):
                    merge_group.append(section_list[j])
                    total_content = "\n".join(s.content for s in merge_group)
                    j += 1
                    
                    # Stop if we have enough content now
                    if len(total_content) >= min_content_length:
                        break
                
                # Create merged section
                combined_title = " / ".join(s.title for s in merge_group if s.title)
                combined_content = "\n\n".join(
                    f"{s.title}\n{s.content}" if s.content else s.title 
                    for s in merge_group
                )
                merged_section = Section(
                    number=merge_group[0].number,
                    title=combined_title,
                    level=merge_group[0].level,
                    content=combined_content
                )
                merged.append(merged_section)
                i = j
            else:
                merged.append(current)
                i += 1
        
        # Rebuild dictionary with new indices
        return {i: section for i, section in enumerate(merged)}
    
    def _extract_figures(self) -> List[Figure]:
        """Extract figures from PDF."""
        figures = []
        figure_id = 1
        
        for page_num in tqdm(range(len(self.doc)), desc="Extracting figures", leave=False):
            page = self.doc[page_num]
            image_list = page.get_images()
            
            for img_info in image_list:
                xref = img_info[0]
                try:
                    img = self.doc.extract_image(xref)
                    figures.append(Figure(
                        id=figure_id,
                        caption="",
                        width=img.get("width"),
                        height=img.get("height"),
                        page=page_num + 1
                    ))
                    figure_id += 1
                except:
                    pass
        
        return figures
    
    def _extract_tables(self) -> List[Table]:
        """Extract tables from PDF (basic detection via text patterns)."""
        tables = []
        table_id = 1
        
        # Look for "Table X" patterns in text
        table_pattern = r'Table\s+(\d+)[.:]?\s*([^\n]*)'
        matches = re.finditer(table_pattern, self.full_text, re.IGNORECASE)
        
        for match in matches:
            tables.append(Table(
                id=table_id,
                caption=match.group(2).strip() if match.group(2) else "",
                raw_text=""
            ))
            table_id += 1
        
        return tables
    
    def _extract_references(self) -> List[Reference]:
        """Extract references from the references section."""
        references = []
        
        # Find references section
        ref_pattern = r'(?:References?|Bibliography)\s*\n([\s\S]+?)(?=\n[A-Z][A-Z\s]+\n|$)'
        ref_match = re.search(ref_pattern, self.full_text, re.IGNORECASE)
        
        if ref_match:
            ref_text = ref_match.group(1)
            
            # Try to split by numbered references [1], [2], etc.
            numbered_refs = re.split(r'\n\s*\[(\d+)\]', ref_text)
            
            if len(numbered_refs) > 1:
                for i in range(1, len(numbered_refs), 2):
                    if i + 1 < len(numbered_refs):
                        ref_id = int(numbered_refs[i])
                        ref_content = numbered_refs[i + 1].strip()
                        references.append(Reference(
                            id=ref_id,
                            text=ref_content
                        ))
            else:
                # Try splitting by author-year pattern or double newlines
                ref_entries = re.split(r'\n\n+', ref_text)
                for idx, entry in enumerate(ref_entries, 1):
                    if entry.strip():
                        references.append(Reference(
                            id=idx,
                            text=entry.strip()
                        ))
        
        return references
    
    def _extract_metadata(self) -> DocumentMetadata:
        """Extract document metadata."""
        metadata = self.doc.metadata
        
        title = metadata.get("title", "") if metadata else ""
        authors = []
        
        if metadata and metadata.get("author"):
            authors = [a.strip() for a in metadata["author"].split(",")]
        
        # Try to find abstract
        abstract = ""
        abstract_match = re.search(
            r'(?:Abstract|ABSTRACT)\s*[:\-–]?\s*\n?([\s\S]+?)(?=\n\s*(?:\d+\.?\s*)?(?:Introduction|INTRODUCTION|Keywords?|1\s))',
            self.full_text,
            re.IGNORECASE
        )
        if abstract_match:
            abstract = abstract_match.group(1).strip()
        
        return DocumentMetadata(
            title=title,
            authors=authors,
            abstract=abstract
        )
    
    def get_document(self) -> Document:
        """Parse PDF and return structured Document."""
        # Detect sections using pure font-based detection
        section_headings = self._detect_sections()
        
        sections = {}
        
        if section_headings:
            # Create sections with content between headings
            for i, (block_idx, title, section_num, level) in enumerate(section_headings):
                # Get end block index (start of next section or end of blocks)
                if i + 1 < len(section_headings):
                    end_idx = section_headings[i + 1][0]
                else:
                    end_idx = len(self.text_blocks)
                
                # Extract content from blocks between this heading and the next
                content_parts = []
                for j in range(block_idx + 1, end_idx):
                    if j < len(self.text_blocks):
                        content_parts.append(self.text_blocks[j]["text"])
                
                content = "\n".join(content_parts).strip()
                
                sections[i] = Section(
                    number=section_num,
                    title=title,
                    level=level,
                    content=content
                )
            
            # Merge consecutive small sections
            sections = self._merge_small_sections(sections)
        else:
            # No sections detected - treat entire document as one section
            sections[0] = Section(
                number="",
                title="Document",
                level=1,
                content=self.full_text
            )
        
        return Document(
            metadata=self._extract_metadata(),
            sections=sections,
            figures=self._extract_figures(),
            tables=self._extract_tables(),
            references=self._extract_references(),
            raw_text=self.full_text
        )

    def get_chunks(self) -> List[str]:
        chunks = []
        doc = self.get_document()
        items = doc.__dict__['sections']
        for i, key in enumerate(items.keys()):
            section = items[key].__dict__
            title = section['title']
            content = section['content']
            figures = section['figures'] if len(section['figures']) > 0 else "No Figures"
            tables = section['tables'] if len(section['tables']) > 0 else "No Tables"
            equations = section['equations'] if len(section['equations']) > 0 else "No Equations"
            subsections = section['subsections'] if len(section['subsections']) > 0 else "No Subsections"
            chunk = f"Section: {title}\n\n{content}\n{figures}\n{tables}\n{equations}\n\nSub Sections:\n{subsections}"
            chunks.append(chunk)
        
        return chunks

    def close(self):
        """Close the PDF document."""
        self.doc.close()


# Alias for backward compatibility
PDFObjectDecoder = PDFParser
