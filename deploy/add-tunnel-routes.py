#!/usr/bin/env python3
"""Add Bobby's to the existing local Cloudflare Tunnel without altering other routes."""
from pathlib import Path
from datetime import datetime, timezone
import os
import shutil
import stat
import subprocess
import tempfile

config = Path("/etc/cloudflared/config.yml")
original = config.read_text()
if "hostname: bobbyspetshop.cl" in original and "hostname: www.bobbyspetshop.cl" in original:
    print("Bobby's tunnel routes already present.")
    raise SystemExit(0)
anchor = "  - service: http_status:404"
if original.count(anchor) != 1:
    raise SystemExit("Expected exactly one catch-all ingress rule; leaving tunnel unchanged.")
addition = (
    "  - hostname: bobbyspetshop.cl\n"
    "    service: http://localhost:80\n"
    "  - hostname: www.bobbyspetshop.cl\n"
    "    service: http://localhost:80\n"
)
updated = original.replace(anchor, addition + anchor)
backup = config.with_name(config.name + ".before-bobbys-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S"))
shutil.copy2(config, backup)
with tempfile.NamedTemporaryFile("w", dir=config.parent, prefix="bobbys-tunnel-", suffix=".yml", delete=False) as temp:
    temp.write(updated)
    temporary = Path(temp.name)
try:
    os.chmod(temporary, stat.S_IMODE(config.stat().st_mode))
    subprocess.run(["cloudflared", "tunnel", "--config", str(temporary), "ingress", "validate"], check=True)
    os.replace(temporary, config)
    subprocess.run(["systemctl", "restart", "cloudflared"], check=True)
    subprocess.run(["systemctl", "is-active", "--quiet", "cloudflared"], check=True)
    print("Bobby's routes added. Cloudflare Tunnel is active.")
except Exception:
    if temporary.exists():
        temporary.unlink()
    shutil.copy2(backup, config)
    subprocess.run(["systemctl", "restart", "cloudflared"], check=False)
    raise
