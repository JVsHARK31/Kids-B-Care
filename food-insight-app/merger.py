from processors.detector_adapter import detect_food_hint
from processors.nutrition_parser import normalize
from sumopod_client import get_nutrition_json


def run_pipeline(input_source: str) -> dict:
    food_hint = detect_food_hint(input_source)
    raw = get_nutrition_json(food_hint)
    return normalize(raw)


