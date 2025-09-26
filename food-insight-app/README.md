# Food Insight — Deteksi & Gizi

Aplikasi Streamlit untuk mendeteksi nama makanan (teks/file) dan mengambil kandungan gizi terstruktur melalui Sumopod Chat Completions API (model `gemini-2.0-flash`). Hasil bisa diunduh sebagai JSON dan CSV.

## Menjalankan

```
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
# salin env contoh
# cp .env.example .env  (buat sendiri .env dan isi SUMOPOD_API_KEY)
streamlit run app.py
```

## Konfigurasi

Buat file `.env` di root project dengan isi:

```
SUMOPOD_API_KEY=sk-REPLACE_WITH_YOURS
```

## Struktur

```
food-insight-app/
├─ app.py
├─ sumopod_client.py
├─ merger.py
├─ processors/
│  ├─ detector_adapter.py
│  └─ nutrition_parser.py
├─ outputs/exports/
├─ data/samples/
├─ requirements.txt
└─ README.md
```

## Catatan
- API key disimpan di `.env` (jangan commit).
- `detector_adapter.py` sederhana: menggunakan nama file sebagai hint. Anda bisa mengganti dengan pipeline deteksi Anda sendiri.
