import json
import re


def parse_llm_json_response(raw_response: str) -> dict | None:
    """
    Extracts and parses JSON content from an LLM response,
    even if it includes triple backticks or extra text.
    """
    # extract JSON inside ```json ... ```
    match = re.search(r"```json\s*(\{.*?\})\s*```", raw_response, re.DOTALL)
    if not match:
        # fallback, finding json looking object {[key]: [value]}
        match = re.search(r"(\{.*?\})", raw_response, re.DOTALL)

    if not match:
        return None

    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError:
        return None
