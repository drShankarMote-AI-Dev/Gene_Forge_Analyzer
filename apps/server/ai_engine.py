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
        if self.openai_key and "your-" in self.openai_key:
            print("WARNING: OpenAI API Key is a placeholder. OpenAI will be disabled.")
            self.openai_key = None
            
        self.openai_client = OpenAI(api_key=self.openai_key) if self.openai_key else None
        
        # Fallback Model: Gemini
        self.gemini_key = os.environ.get("GEMINI_API_KEY")
        if self.gemini_key and "your-" in self.gemini_key:
            print("WARNING: Gemini API Key is a placeholder. Gemini will be disabled.")
            self.gemini_key = None

        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-pro')
        else:
            self.gemini_model = None

    def generate_explanation(self, analysis_data, mode="researcher"):
        """Non-streaming version for simpler integration."""
        prompt = self._build_prompt(analysis_data, mode)
        
        # Try OpenAI
        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are an expert bioinformatician."},
                        {"role": "user", "content": prompt}
                    ]
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"AI GATEWAY: OpenAI Failure: {e}")

        # Try Gemini
        if self.gemini_model:
            try:
                response = self.gemini_model.generate_content(prompt)
                return response.text
            except Exception as e:
                print(f"AI GATEWAY: Gemini Failure: {e}")

        return "AI interpretation service is currently offline. Please verify API configuration in the secure terminal."

    def generate_explanation_stream(self, analysis_data, mode="researcher"):
        """
        Streams explanation, handling fallback automatically.
        Yields chunks of text.
        """
        prompt = self._build_prompt(analysis_data, mode)
        model_used = "none"

        # 1. Try Primary (OpenAI)
        if self.openai_client:
            models_to_try = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"]
            for model_name in models_to_try:
                try:
                    print(f"AI GATEWAY: Routing to Primary Model (OpenAI {model_name})...")
                    stream = self.openai_client.chat.completions.create(
                        model=model_name,
                        messages=[
                            {"role": "system", "content": "You are an expert bioinformatician."},
                            {"role": "user", "content": prompt}
                        ],
                        stream=True
                    )
                    model_used = f"openai-{model_name}"
                    yield f"__MODEL_USED__:{model_used}\n"
                    
                    for chunk in stream:
                        if chunk.choices and chunk.choices[0].delta.content is not None:
                            yield chunk.choices[0].delta.content
                    return # Success
                except Exception as e:
                    print(f"AI GATEWAY: OpenAI {model_name} Failed: {str(e)}")
                    if model_name == models_to_try[-1]: # If last one failed
                         print("AI GATEWAY: All OpenAI models failed. Trying Gemini fallback...")
        
        # 2. Fallback (Gemini)
        if self.gemini_model:
            try:
                print("AI GATEWAY: Routing to Fallback Model (Gemini 1.5)...")
                response = self.gemini_model.generate_content(prompt, stream=True)
                model_used = "google-gemini-1.5"
                yield f"__MODEL_USED__:{model_used}\n"
                
                for chunk in response:
                    try:
                        if chunk.text:
                            yield chunk.text
                    except Exception as inner_e:
                        print(f"AI GATEWAY: Gemini chunk error: {inner_e}")
                        yield "\n[Signal Interrupted: Safety filters or connectivity issues detected]\n"
                return # Success
            except Exception as e:
                 print(f"AI GATEWAY: Fallback Model Failed: {str(e)}")
        
        if not self.openai_client and not self.gemini_model:
            yield "Critical: No AI models are configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in the environment."
        else:
            yield "Neural Link Error: All AI models failed to respond. Check API quotas or connectivity."

    def _build_prompt(self, data, mode):
        # Extract data with safe fallbacks
        results = data if isinstance(data, dict) else {}
        sequence = results.get('sequence', 'Unknown Sequence Data')
        base_counts = results.get('base_counts', results.get('nucleotide_counts', {}))
        gc_content = results.get('gc_content', 'Unknown')
        crispr_guides = results.get('crispr_guides', results.get('crispr_targets', []))
        
        system_context = "You are an expert bioinformatician and molecular biologist."
        if mode == "student":
            system_context += " Explain concepts simply for an undergraduate biology student."
        else:
            system_context += " Provide deep technical insights and research-level analysis."

        return f"""
        {system_context}
        
        Analyze the following genomic data:
        - Sequence (sample): {sequence[:150]}... (Total Length: {len(sequence)} bp)
        - Nucleotide Composition: {base_counts}
        - Global GC Content: {gc_content}%
        - CRISPR Candidates: {len(crispr_guides)} guides found
        
        Please provide a structured report including:
        1. **Executive Summary**: Brief overview of the sequence composition.
        2. **Detailed Analysis**: Insights into the GC content and its biological implications.
        3. **CRISPR Risk Assessment**: Evaluation of identified guides/targets.
        4. **Research Recommendations**: Next steps for lab verification.
        
        Format the output in clean Markdown for a research report. Avoid conversational filler.
        """

ai_bio_engine = AIBioEngine()
