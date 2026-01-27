import tqdm
from llm_wrapper import HuggingFaceLLM


class SlideGenerator:
    """Use LLM to generate complete LaTeX PPT from chunk summaries."""
    
    def __init__(self, llm: HuggingFaceLLM):
        self.llm = llm

    def generate(self, chunk_summaries: dict) -> str:
        prompt = f"""
        You are preparing a professional research presentation for a technical conference (NeurIPS-style).
        Your goal is to create slides that are both technically accurate AND easily understandable by a broad research audience.

        CRITICAL REQUIREMENTS:
        
        1. **Understand First, Then Simplify**:
           - Deeply analyze each section of the paper summaries
           - Identify the core message and contribution
           - Translate technical concepts into clear, accessible language WITHOUT losing precision
           - Use concrete examples or intuitive explanations where helpful
        
        2. **Self-Explanatory Slides**:
           - Each slide must be readable and understandable on its own
           - Don't assume the audience has read the paper
           - Explain WHY something matters, not just WHAT it is
           - Provide sufficient context in each bullet point
        
        3. **Professional Presentation Style**:
           - Use technical terminology, but explain it clearly
           - Write in complete, informative sentences (not cryptic fragments)
           - Balance rigor with clarity
           - Make complex ideas accessible without being patronizing
        
        4. **Logical Structure** (follow this flow):
           - Title Slide: Paper title
           - Introduction: What problem are we solving? Why does it matter?
           - Problem Statement: Current limitations and challenges (be specific)
           - Method Overview: High-level approach (intuitive explanation first)
           - Technical Details: Key innovations broken into digestible slides
           - Experiments & Results: What was tested, what was found (with context)
           - Conclusion/Impact: Main takeaways and contributions
        
        5. **Content Guidelines**:
           - 3-5 bullet points per slide maximum
           - Each bullet should be 1-2 complete sentences that tell a mini-story
           - Avoid jargon dumps - explain technical terms inline
           - Use quantitative results with context (e.g., "20% speedup compared to baseline X")
           - Highlight insights, not just facts
        
        OUTPUT FORMAT (STRICT - follow this exactly):
        **Slide 1: Title Slide**
        Slide Title: [Paper Title]
        
        **Slide 2: [Descriptive Slide Name]**
        Content:
        • [First bullet point - complete, self-contained explanation]
        • [Second bullet point - complete, self-contained explanation]
        • [Third bullet point - complete, self-contained explanation]
        
        **Slide 3: [Descriptive Slide Name]**
        Content:
        • [Bullet points...]
        
        [Continue with all necessary slides...]

        Now, analyze the following paper summaries and create a clear, professional presentation:

        Paper summaries:
        {chunk_summaries}
        """

        response = self.llm.generate(prompt, max_tokens=4096)

        return response     
