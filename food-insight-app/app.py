import os
import time
import json
import pandas as pd
import streamlit as st

from merger import run_pipeline


st.set_page_config(page_title="Food Insight", layout="wide")
st.title("🥗 Food Insight — Deteksi & Gizi")

mode = st.sidebar.selectbox("Mode Input", ["Ketik Nama", "Upload Gambar", "Output Program B"])

input_value = None
if mode == "Ketik Nama":
    input_value = st.text_input("Nama makanan", placeholder="contoh: nasi goreng")
elif mode == "Upload Gambar":
    upl = st.file_uploader("Upload foto makanan", type=["jpg", "jpeg", "png"]).
    if upl:
        os.makedirs("data/samples", exist_ok=True)
        path = f"data/samples/{int(time.time())}_{upl.name}"
        with open(path, "wb") as f:
            f.write(upl.getbuffer())
        input_value = path
else:
    input_value = st.text_input("Masukkan output teks dari Program B (nama makanan)")

if st.button("Analisis") and input_value:
    with st.spinner("Memproses..."):
        result = run_pipeline(input_value)

    st.subheader(f"🍽️ {result.get('food_name', '—')} (serving: {result.get('serving_size_g', 0)} g)")

    st.metric("Kalori (kcal)", result.get("calories_kcal", 0))

    macros = result.get("macros", {})
    micros = result.get("micros", {})
    col1, col2 = st.columns(2)
    with col1:
        st.write("**Makronutrien (g)**")
        st.dataframe(pd.DataFrame([macros]))
    with col2:
        st.write("**Mikronutrien**")
        st.dataframe(pd.DataFrame([micros]))

    allergens = result.get("allergens", []) or []
    if allergens:
        st.write("**Alergen:** " + ", ".join(allergens))
    if result.get("notes"):
        st.info(result["notes"])

    # Simpan & download
    os.makedirs("outputs/exports", exist_ok=True)
    ts = int(time.time())
    json_path = f"outputs/exports/food_{ts}.json"
    csv_path = f"outputs/exports/food_{ts}.csv"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    flat = {
        "food_name": result.get("food_name"),
        "serving_size_g": result.get("serving_size_g"),
        "calories_kcal": result.get("calories_kcal"),
        **{f"macro_{k}": v for k, v in (result.get("macros") or {}).items()},
        **{f"micro_{k}": v for k, v in (result.get("micros") or {}).items()},
        "allergens": "|".join(allergens),
        "notes": result.get("notes", ""),
    }
    pd.DataFrame([flat]).to_csv(csv_path, index=False)

    with open(json_path, "rb") as f:
        st.download_button("⬇️ Download JSON", f, file_name=os.path.basename(json_path), mime="application/json")
    with open(csv_path, "rb") as f:
        st.download_button("⬇️ Download CSV", f, file_name=os.path.basename(csv_path), mime="text/csv")


