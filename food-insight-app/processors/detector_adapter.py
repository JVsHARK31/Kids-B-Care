import os
from typing import Union


def detect_food_hint(input_source: Union[str, os.PathLike]) -> str:
    """
    input_source bisa: path gambar, teks, atau output program lain.

    Implementasi minimal:
    - Jika path file gambar: gunakan nama file sebagai hint sederhana (tanpa ekstensi),
      karena modul deteksi eksternal belum diintegrasikan langsung di sini.
    - Jika string biasa: kembalikan apa adanya.
    - Pastikan hasil 1 kata/frasal pendek.
    """
    if isinstance(input_source, (str, os.PathLike)):
        s = str(input_source)
        if os.path.isfile(s):
            base = os.path.basename(s)
            name, _ = os.path.splitext(base)
            # Normalisasi dasar: ganti underscore/dash jadi spasi
            hint = name.replace("_", " ").replace("-", " ")
            return hint.strip()
        # Jika bukan file, anggap sudah berupa nama makanan/teks
        return s.strip()
    # Fallback
    return "nasi goreng"


