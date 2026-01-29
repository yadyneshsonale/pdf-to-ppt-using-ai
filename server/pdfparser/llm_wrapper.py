"""
HuggingFace LLM wrapper
"""
import json
import time
import requests


class HuggingFaceLLM:
    """Direct HuggingFace Inference API using chat endpoint (router)."""

    def __init__(self, api_token: str, model: str = "meta-llama/Llama-2-7b-chat-hf"):
        self.api_token = api_token
        self.model = model
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }
        print(f"[LLM] Using model: {model}")
        print(f"[LLM] API endpoint: {self.api_url}")
    
    def generate(self, prompt: str, max_tokens: int = 1024, retries: int = 3, temperature: float = 0.3) -> str:
        """Call HuggingFace Chat API and return text response (or empty string)."""
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        
        for attempt in range(retries):
            try:
                response = requests.post(
                    self.api_url,
                    headers=self.headers,
                    json=payload,
                    timeout=120
                )
                
                if response.status_code == 200:
                    result = response.json()
                    # Standard chat-completions response from HF router:
                    # { "choices": [ { "message": { "role": "assistant", "content": "..." } } ] }
                    if isinstance(result, dict) and "choices" in result and len(result["choices"]) > 0:
                        choice = result["choices"][0]
                        msg = choice.get("message") or choice.get("delta") or {}
                        if isinstance(msg, dict):
                            return str(msg.get("content", "")).strip()
                        # fallback to text if present
                        return str(choice.get("text", "")).strip()
                    # some providers return different shapes: try to stringify
                    return json.dumps(result)[:1000]
                elif response.status_code in [400, 410, 429, 503]:
                    error_msg = response.text[:400] if response.text else "Unknown error"
                    print(f"[LLM] API error {response.status_code}: {error_msg}")
                    if attempt < retries - 1:
                        time.sleep(2 ** attempt)
                    continue
                else:
                    print(f"[LLM] Status {response.status_code}, retrying ({attempt+1}/{retries})...")
                    if attempt < retries - 1:
                        time.sleep(2 ** attempt)
            except requests.exceptions.Timeout:
                print(f"[LLM] Timeout, retrying ({attempt+1}/{retries})...")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)
            except Exception as e:
                print(f"[LLM] Error: {type(e).__name__}: {str(e)[:200]}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)
        
        return ""
