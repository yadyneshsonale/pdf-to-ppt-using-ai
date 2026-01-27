"""
LLM-based LaTeX Generator — Use LLM to convert slides to LaTeX presentation
"""
from llm_wrapper import HuggingFaceLLM


class LLMLatexGenerator:
    """Use LLM to generate LaTeX presentation from slide content."""
    
    def __init__(self, llm: HuggingFaceLLM):
        self.llm = llm

    def generate(self, slides_content: str, title: str = "Presentation") -> str:
        prompt = f"""
        You are an expert LaTeX presentation developer. Convert the following presentation slides into a complete, compilable LaTeX Beamer presentation.

        REQUIREMENTS:
        
        1. **Complete LaTeX Document**:
           - Include full preamble with documentclass, packages, and theme
           - Use beamer class for presentations
           - Include proper document structure (begin/end document)
        
        2. **Formatting Rules**:
           - Use Madrid theme or similar professional theme
           - Create one \\begin{{frame}}...\\end{{frame}} for each slide
           - Use \\frametitle{{...}} for slide titles
           - Use itemize environment for bullet points
           - Properly escape LaTeX special characters: & % $ # _ {{ }} ~ ^
        
        3. **Content Structure**:
           - First slide: Title page with \\titlepage
           - Each subsequent slide: frame with title and content
           - Preserve all technical content exactly as provided
           - Maintain bullet point structure
        
        4. **Quality**:
           - Must compile without errors
           - Clean, readable LaTeX code
           - Proper indentation
           - No syntax errors
        
        5. **CRITICAL - Character Escaping**:
           - Escape underscores: _ becomes \\_
           - Escape percentage: % becomes \\%
           - Escape ampersand: & becomes \\&
           - Escape dollar signs: $ becomes \\$
           - Escape hash: # becomes \\#
           - Escape curly braces: {{ }} become \\{{ \\}}
        
        Presentation Title: {title}
        
        Slides Content:
        {slides_content}
        
        OUTPUT INSTRUCTIONS:
        - Output ONLY the complete LaTeX code
        - Do NOT include any explanations or markdown
        - Start with \\documentclass and end with \\end{{document}}
        - Make it production-ready and compilable
        """

        response = self.llm.generate(prompt, max_tokens=8192)
        
        # Extract LaTeX code if the model wraps it in markdown code blocks
        latex_code = response.strip()
        
        # Remove markdown code fences if present
        if latex_code.startswith("```latex") or latex_code.startswith("```tex"):
            latex_code = latex_code.split("```", 1)[1]
            if "```" in latex_code:
                latex_code = latex_code.rsplit("```", 1)[0]
            latex_code = latex_code.strip()
        elif latex_code.startswith("```"):
            latex_code = latex_code.split("```", 1)[1]
            if "```" in latex_code:
                latex_code = latex_code.rsplit("```", 1)[0]
            latex_code = latex_code.strip()
        
        return latex_code
