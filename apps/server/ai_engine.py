import os
import time
import warnings
# Suppress Google Generative AI deprecation warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="google.generativeai")
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

class AIBioEngine:
    def __init__(self):
        # Primary Model: OpenAI
        self.openai_key = os.environ.get("OPENAI_API_KEY")
        self.openai_client = OpenAI(api_key=self.openai_key) if self.openai_key else None
        
        # Fallback Model: Gemini
        self.gemini_key = os.environ.get("GEMINI_API_KEY")
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-pro')
        else:
            self.gemini_model = None

    def generate_explanation_stream(self, analysis_data, mode="researcher"):
        """
        Streams explanation, handling fallback automatically.
        Yields chunks of text.
        """
        prompt = self._build_prompt(analysis_data, mode)
        model_used = "none"

        # 1. Try Primary (OpenAI)
        if self.openai_client:
            try:
                print("AI GATEWAY: Routing to Primary Model (OpenAI GPT-4)...")
                stream = self.openai_client.chat.completions.create(
                    model="gpt-4o", # Using latest optimization
                    messages=[
                        {"role": "system", "content": "You are an expert bioinformatician."},
                        {"role": "user", "content": prompt}
                    ],
                    stream=True
                )
                model_used = "openai-gpt-4o"
                yield f"__MODEL_USED__:{model_used}\n" # Meta-header
                
                for chunk in stream:
                    if chunk.choices[0].delta.content is not None:
                        yield chunk.choices[0].delta.content
                return # Success
            except Exception as e:
                print(f"AI GATEWAY: Primary Model Failed ({str(e)}). Switching to Fallback...")
        
        # 2. Fallback (Gemini)
        if self.gemini_model:
            try:
                print("AI GATEWAY: Routing to Fallback Model (Gemini 1.5)...")
                response = self.gemini_model.generate_content(prompt, stream=True)
                model_used = "google-gemini-1.5"
                yield f"__MODEL_USED__:{model_used}\n" # Meta-header
                
                for chunk in response:
                    yield chunk.text
                return # Success
            except Exception as e:
                 print(f"AI GATEWAY: Fallback Model Failed ({str(e)}).")
        
        yield "System Error: All AI models are currently unavailable. Please check configuration or try again later."

    def _build_prompt(self, data, mode):
        sequence = data.get('sequence', 'Unknown')
        base_counts = data.get('base_counts', {})
        gc_content = data.get('gc_content', 'Unknown')
        crispr_guides = data.get('crispr_guides', [])
        
        system_context = "You are an expert bioinformatician and molecular biologist."
        if mode == "student":
            system_context += " Explain concepts simply for an undergraduate biology student."
        else:
            system_context += " Provide deep technical insights and research-level analysis."

        prompt = f"""
        {system_context}
        
        Analyze the following genomic data:
        - Sequence (first 100bp): {sequence[:100]}...
        - Total Length: {len(sequence)} bp
        - Nucleotide Composition: {base_counts}
        - Global GC Content: {gc_content}%
        - CRISPR Candidate Guides Found: {len(crispr_guides)}
        
        Please provide a structured report including:
        1. **Executive Summary**: Brief overview of the sequence composition.
        2. **Detailed Analysis**: Insights into the GC content and its biological implications (e.g., stability, genomic islands).
        3. **CRISPR Risk Assessment**: Evaluation of the identified guide RNAs and potential off-target risks or efficiency.
        4. **Research Recommendations**: Next steps for lab verification or optimization.
        
        Format the output in clean Markdown for a research report. Do not include '```markdown' blocks, just raw markdown.
        """
        return prompt

ai_bio_engine = AIBioEngine()
