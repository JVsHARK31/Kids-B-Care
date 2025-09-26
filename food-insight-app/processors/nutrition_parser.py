from typing import Dict, Any


NUM_FIELDS = {
    "serving_size_g",
    "calories_kcal",
    "macros.protein_g",
    "macros.carbs_g",
    "macros.fat_g",
    "macros.fiber_g",
    "macros.sugar_g",
    "micros.sodium_mg",
    "micros.potassium_mg",
    "micros.calcium_mg",
    "micros.iron_mg",
    "micros.vitamin_a_mcg",
    "micros.vitamin_c_mg",
    "micros.cholesterol_mg",
}


def _get_nested(d: Dict[str, Any], path: str):
    cur = d
    keys = path.split(".")
    for k in keys[:-1]:
        if k not in cur or not isinstance(cur[k], dict):
            cur[k] = {}
        cur = cur[k]
    return cur, keys[-1]


def normalize(result: Dict[str, Any]) -> Dict[str, Any]:
    result = dict(result or {})
    # Pastikan field numerik valid angka (default 0)
    for path in NUM_FIELDS:
        parent, leaf = _get_nested(result, path)
        try:
            parent[leaf] = float(parent.get(leaf, 0) or 0)
        except Exception:
            parent[leaf] = 0.0
    # Array
    if not isinstance(result.get("allergens"), list):
        result["allergens"] = []
    if not isinstance(result.get("notes"), (str, type(None))):
        result["notes"] = ""
    if not isinstance(result.get("food_name"), str):
        result["food_name"] = str(result.get("food_name") or "unknown")
    return result


