
import os
import sys
from dotenv import load_dotenv

# Add apps/backend to path to ensure we can load things if needed, but mainly we just need the key
sys.path.append(os.path.join(os.getcwd(), 'apps', 'backend'))

# Load env from apps/backend/.env
load_dotenv(os.path.join(os.getcwd(), 'apps', 'backend', '.env'))

key = os.environ.get("GEMINI_API_KEY")
print(f"Key loaded: {key[:5]}...{key[-5:] if key else 'None'}")

try:
    from google import genai
    client = genai.Client(api_key=key)
    print("Listing models...")
    for m in client.models.list():
        print(f"Model: {m.name}")
        if 'flash' in m.name:
            print(f"  -> FLASH FOUND: {m.name}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
