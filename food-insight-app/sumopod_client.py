import os
import json
import re
from typing import Dict, Any

import requests
from dotenv import load_dotenv

load_dotenv()

SUMOPOD_API_KEY = os.getenv("SUMOPOD_API_KEY")
SUMOPOD_URL = "https://ai.sumopod.com/v1/chat/completions"
MODEL = "gemini-2.0-flash"

SYSTEM_INSTRUCTION = (
    "You are a nutrition expert. Only output strict JSON per the provided schema. "
    "No explanations, no markdown, no code fences."
)

SCHEMA_HINT = (
    """
Return STRICT JSON ONLY with this schema (no extra fields):
{
  "food_name": "string",
  "serving_size_g": number,
  "calories_kcal": number,
  "macros": {
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number,
    "sugar_g": number
  },
  "micros": {
    "sodium_mg": number,
    "potassium_mg": number,
    "calcium_mg": number,
    "iron_mg": number,
    "vitamin_a_mcg": number,
    "vitamin_c_mg": number,
    "cholesterol_mg": number
  },
  "allergens": ["string"],
  "notes": "string"
}
"""
)


def _extract_json(text: str) -> str:
    m = re.search(r"\{.*\}", text, flags=re.S)
    if not m:
        raise ValueError("No JSON object detected in model output")
    return m.group(0)


def get_nutrition_json(food_hint: str) -> Dict[str, Any]:
    assert SUMOPOD_API_KEY, "Missing SUMOPOD_API_KEY"
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {
                "role": "user",
                "content": (
                    f"Given the food name or hint: '{food_hint}'. "
                    "Infer the most likely single food item and its nutritional facts per 100g. "
                    "If serving size is known in typical portion, put it in 'serving_size_g'. "
                    "Otherwise set serving_size_g to 100. "
                    + SCHEMA_HINT
                ),
            },
        ],
        "max_tokens": 500,
        "temperature": 0.3,
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SUMOPOD_API_KEY}",
    }
    r = requests.post(SUMOPOD_URL, headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    data = r.json()

    content = (
        data["choices"][0]["message"]["content"]
        if "choices" in data
        else data.get("content", "")
    )
    try:
        return json.loads(content)
    except Exception:
        cleaned = _extract_json(content)
        return json.loads(cleaned)


