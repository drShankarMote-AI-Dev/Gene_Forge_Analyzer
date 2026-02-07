import os
import time
import warnings
import logging

# Suppress Google Generative AI deprecation warnings
warnings.filterwarnings("ignore", category=FutureWarning)

try:
    from google import genai
except ImportError:
    genai = None

from openai import OpenAI
from dotenv import load_dotenv

# Use structured logging for the AI engine
logger = logging.getLogger("ai_engine")

# Robust environment loading
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
backend_dir = os.path.join(base_dir, 'apps', 'backend')
load_dotenv(os.path.join(base_dir, '.env'))
load_dotenv(os.path.join(backend_dir, '.env'), override=True)

logger.info(f"AI Engine loading env from: {base_dir} and {backend_dir}")

class AIBioEngine:
    def __init__(self):
        """Initialize AI clients with production-grade validation."""
        self.gateway_client = self._init_gateway()
        self.openai_client = self._init_openai()
        self.gemini_client = self._init_gemini()

    def _init_gateway(self):
        key = os.environ.get("AI_GATEWAY_API_KEY")
        if key and "your-" not in key:
            return OpenAI(api_key=key, base_url='https://ai-gateway.vercel.sh/v1')
        return None

    def _init_openai(self):
        key = os.environ.get("OPENAI_API_KEY")
        if key and "your-" not in key:
            return OpenAI(api_key=key)
        return None

    def _init_gemini(self):
        key = os.environ.get("GEMINI_API_KEY")
        self.gemini_model = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
        if key and "your-" not in key and genai:
            try:
                # Use the new google.genai Client
                return genai.Client(api_key=key)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")
        return None

    def generate_explanation(self, analysis_data, mode="researcher"):
        """Production-ready explanation generator with robust fallbacks."""
        prompt = self._build_prompt(analysis_data, mode)
        
        # 1. Experimental Gateway
        if self.gateway_client:
            try:
                response = self.gateway_client.chat.completions.create(
                    model='openai/gpt-4o', # Switched to reliable prod model
                    messages=[
                        {"role": "system", "content": "You are an expert bioinformatician."},
                        {"role": "user", "content": prompt}
                    ],
                    timeout=30
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.warning(f"Gateway failed: {e}")

        # 2. Main OpenAI
        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are an expert bioinformatician."},
                        {"role": "user", "content": prompt}
                    ],
                    timeout=30
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.error(f"OpenAI failed: {e}")

        # 3. Gemini Fallback
        if self.gemini_client:
            try:
                response = self.gemini_client.models.generate_content(model=self.gemini_model, contents=prompt)
                return response.text
            except Exception as e:
                logger.error(f"Gemini failed: {e}")

        return "Intelligence systems are currently under maintenance. Please verify telemetry configuration."

    def generate_explanation_stream(self, analysis_data, mode="researcher"):
        """Streams bio-intelligence results with automatic model migration."""
        prompt = self._build_prompt(analysis_data, mode)

        # Try OpenAI-compatible stream
        client = self.gateway_client or self.openai_client
        if client:
            model = "openai/gpt-4o" if self.gateway_client else "gpt-4o"
            try:
                stream = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": "You are an expert bioinformatician."},
                        {"role": "user", "content": prompt}
                    ],
                    stream=True,
                    timeout=30
                )
                yield f"__MODEL_USED__:auto-detected-{model}\n"
                for chunk in stream:
                    if chunk.choices and chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
                return
            except Exception as e:
                logger.warning(f"Primary stream failed: {e}")

        # Try Gemini stream
        if self.gemini_client:
            try:
                print(f"DEBUG: Attempting Gemini {self.gemini_model} Stream...")
                # Fallback to flash if pro fails, or just use flash as it's more widely available on free tier
                stream = self.gemini_client.models.generate_content_stream(model=self.gemini_model, contents=prompt)
                yield f"__MODEL_USED__:google-{self.gemini_model}\n"
                for chunk in stream:
                    if chunk.text:
                        yield chunk.text
                return
            except Exception as e:
                import traceback
                traceback.print_exc()
                print(f"DEBUG: Gemini Error: {e}")
                logger.error(f"Gemini stream failed: {e}")

        yield "Critical: All neural pathways are obstructed. Intelligence link severed."

    def _build_prompt(self, data, mode):
        # Extract data with safe fallbacks
        results = data if isinstance(data, dict) else {}
        sequence = results.get('sequence', 'Unknown')
        base_counts = results.get('base_counts', results.get('nucleotide_counts', {}))
        gc_content = results.get('gc_content', 'Unknown')
        
        system_context = "Expert bioinformatician."
        if mode == "student":
            system_context = "Biology Educator. Simplify concepts."
        
        return f"""
        Role: {system_context}
        
        Genomic Telemetry:
        - Signature: {sequence[:100]}...
        - Length: {len(sequence)} bp
        - Composition: {base_counts}
        - GC Index: {gc_content}%
        
        Objective:
        Provide a structured Research Report in Markdown including:
        1. Executive Summary
        2. Sequence Intelligence
        3. CRISPR feasibility (if applicable)
        4. Laboratory Recommendations
        
        Adhere to professional clinical nomenclature.
        """

ai_bio_engine = AIBioEngine()
