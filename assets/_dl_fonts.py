# -*- coding: utf-8 -*-
"""Phase 0c: download self-hosted OFL fonts (woff2) from Google Fonts."""
import io, os, re, sys
import requests

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ROOT = "C:/Users/YKC/AppData/Roaming/reasonix/global-workspace/aston-martin-valkyrie-site"
FDIR = os.path.join(ROOT, "fonts")
os.makedirs(FDIR, exist_ok=True)
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")

# family -> local names to save as
FAMILIES = {
    "Marcellus": "valkyrie-display",          # display serif
    "Cormorant+Garamond:wght@600": "valkyrie-serif-600",
    "Rajdhani:wght@500;600;700": "valkyrie-mono",  # instrument numerals/labels
}
PAT = re.compile(r"url\((https://fonts\.gstatic\.com/[^)]+)\) format\('woff2'\)")
all_fonts = []
for fam, local in FAMILIES.items():
    url = f"https://fonts.googleapis.com/css2?family={fam}&display=swap"
    r = requests.get(url, headers={"User-Agent": UA}, timeout=30)
    if r.status_code != 200:
        print("FAIL css", fam, r.status_code, flush=True)
        continue
    css = r.text
    blocks = re.findall(r"/\* ([^*]+) \*/\s*@font-face\s*{([^}]+)}", css)
    if not blocks:
        # uncommented css
        blocks = [(m.group(1), m.group(2)) for m in
                  re.finditer(r"@font-face\s*{([^}]+)}", css)]
        blocks = [("", b) for b in blocks]
    n = 0
    for label, body in blocks:
        murl = PAT.search(body)
        if not murl:
            continue
        w = re.search(r"font-weight:\s*(\d+)", body)
        st = re.search(r"font-style:\s*(\w+)", body)
        subset = re.search(r"unicode-range", body)
        weight = w.group(1) if w else "400"
        style = st.group(1) if st else "normal"
        # prefer latin subset only (single unicode-range block usually = latin)
        fn = f"{local}-{weight}{'' if style=='normal' else '-'+style}.woff2"
        fpath = os.path.join(FDIR, fn)
        if os.path.exists(fpath) and os.path.getsize(fpath) > 5000:
            print("skip", fn, flush=True)
            n += 1
            continue
        try:
            fr = requests.get(murl.group(1), headers={"User-Agent": UA}, timeout=60)
            if fr.status_code == 200 and len(fr.content) > 5000:
                open(fpath, "wb").write(fr.content)
                print("OK", fn, len(fr.content), flush=True)
                n += 1
            else:
                print("FAIL dl", fn, fr.status_code, flush=True)
        except Exception as e:
            print("FAIL dl", fn, str(e)[:80], flush=True)
    if n == 0:
        print("no woff2 for", fam, flush=True)

print("fonts done", flush=True)
