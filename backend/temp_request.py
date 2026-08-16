import json
import urllib.request
import urllib.error
import time

email = f"testuser_{int(time.time())}@example.com"
body = json.dumps({"name": "Test User", "email": email, "password": "secret123"}).encode("utf-8")
req = urllib.request.Request(
    "http://127.0.0.1:8001/api/auth/register",
    data=body,
    headers={"Content-Type": "application/json"},
)
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        print("STATUS", r.status)
        print(r.read().decode())
except urllib.error.HTTPError as e:
    print("ERR", e.code)
    print(e.read().decode())
except Exception:
    import traceback
    traceback.print_exc()
