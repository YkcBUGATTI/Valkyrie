# -*- coding: utf-8 -*-
"""Valkyrie media library downloader v3 - AMR-LMH race images (13 targets).
Reason: requests/urllib3 TLS fingerprint is rejected by the WAF
(SSLError UNEXPECTED_EOF) while curl works fine. Everything else identical:
single thread, >=4s gap, Referer, browser UA, 3 retries w/ increasing backoff,
homepage probe first, hard abort on TLS reset / 403 / 429.
"""
import json, os, subprocess, time, urllib.parse

BASE = r"C:\Users\YKC\AppData\Roaming\reasonix\global-workspace\aston-martin-valkyrie-site"
TARGETS = os.path.join(BASE, "assets", "_target_amrlmh.json")
IMGDIR  = os.path.join(BASE, "img")
LOG     = os.path.join(BASE, "assets", "_dl_amrlmh_log.json")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
REFERER = "https://media.astonmartin.com/"
GAP = 4.0
RETRIES = 3
BACKOFF = [8, 16, 32]
PROBE_MAX_WAIT = 15 * 60
# curl exit codes meaning TLS-level block
CURL_TLS_EXITS = {35, 56, 60, 58}

log = {"started": time.strftime("%Y-%m-%d %H:%M:%S"), "items": []}
blocked = {"flag": False, "reason": ""}

def note(picid, file, status, detail):
    log["items"].append({"picid": picid, "file": file, "status": status,
                         "detail": detail, "ts": time.strftime("%H:%M:%S")})
    with open(LOG, "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=1)

def curl_http(url, outfile, timeout=90):
    """Run curl, return (exit_code, http_code, bytes)."""
    cmd = ["curl", "-sS", "--max-time", str(timeout), "-A", UA, "-e", REFERER,
           "-o", outfile, "-w", "%{http_code} %{size_download}", url]
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout + 15)
        parts = p.stdout.strip().split()
        code = parts[0] if parts else "000"
        size = int(parts[1]) if len(parts) > 1 else 0
        return p.returncode, code, size
    except subprocess.TimeoutExpired:
        return 99, "000", 0

def probe_ok():
    rc, code, _ = curl_http(REFERER, os.devnull, timeout=20)
    if rc in CURL_TLS_EXITS:
        return False
    return rc == 0 and code in ("200", "302")

def fetch(picid, file, url):
    target = os.path.join(IMGDIR, file)
    if os.path.exists(target) and os.path.getsize(target) > 0:
        return True, "skipped-existing", os.path.getsize(target)
    url = urllib.parse.quote(url, safe=":/?&=%,+-_.~")
    last_detail = "unknown"
    for attempt in range(RETRIES + 1):
        tmp = target + ".part"
        rc, code, size = curl_http(url, tmp, timeout=90)
        if rc in CURL_TLS_EXITS:
            blocked["flag"] = True
            blocked["reason"] = "curl exit %d (TLS reset)" % rc
            return False, "TLS-RESET(curl %d)" % rc, 0
        if code in ("403", "429"):
            blocked["flag"] = True
            blocked["reason"] = "HTTP %s (WAF block)" % code
            return False, "HTTP %s BLOCKED" % code, 0
        if rc != 0:
            last_detail = "curl exit %d" % rc
        elif code != "200":
            last_detail = "HTTP %s" % code
        else:
            try:
                with open(tmp, "rb") as f:
                    head = f.read(3)
                if head != b"\xff\xd8\xff":
                    last_detail = "not-jpeg"
                elif size < 10000:
                    last_detail = "tiny(%dB)" % size
                else:
                    os.replace(tmp, target)
                    return True, "ok", size
            except OSError as e:
                last_detail = "fs-error:%s" % e
        if os.path.exists(tmp):
            try: os.remove(tmp)
            except OSError: pass
        if attempt < RETRIES:
            time.sleep(BACKOFF[attempt])
    return False, last_detail, 0

def main():
    os.makedirs(IMGDIR, exist_ok=True)
    with open(TARGETS, encoding="utf-8") as f:
        targets = json.load(f)
    order = {"amr-lmh-race": 1}
    targets.sort(key=lambda t: (order.get(t["rule"], 9), int(t["picid"] or 0)))

    if not probe_ok():
        print("PROBE: homepage unreachable, waiting up to 15min ...", flush=True)
        waited = 0
        while waited < PROBE_MAX_WAIT:
            time.sleep(20); waited += 20
            if probe_ok():
                print("PROBE: recovered after %ds" % waited, flush=True)
                break
        else:
            print("PROBE: still unreachable after 15min, giving up", flush=True)
            note("-", "-", "probe-failed", "homepage unreachable >15min")
            return
    time.sleep(GAP)

    ok = fail = 0
    for t in targets:
        if blocked["flag"]:
            print("BLOCKED mid-run: %s - stopping" % blocked["reason"], flush=True)
            break
        pid, file = t["picid"], t["file"]
        print("DL %s picid=%s ..." % (t["rule"], pid), flush=True)
        res, detail, size = fetch(pid, file, t["source_url"])
        if res:
            ok += 1
            note(pid, file, "downloaded", "%s %dB" % (detail, size))
            print("   ok (%s, %dB)" % (detail, size), flush=True)
        else:
            fail += 1
            note(pid, file, "failed", detail)
            print("   FAIL: %s" % detail, flush=True)
            if blocked["flag"]:
                break
        time.sleep(GAP)

    log["finished"] = time.strftime("%Y-%m-%d %H:%M:%S")
    log["ok"] = ok; log["failed"] = fail; log["blocked"] = blocked
    with open(LOG, "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=1)
    print("DONE ok=%d failed=%d blocked=%s" % (ok, fail, blocked), flush=True)

if __name__ == "__main__":
    main()
