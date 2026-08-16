import json, urllib.request, urllib.error, time

def post(port):
    url = f'http://127.0.0.1:{port}/api/auth/register'
    email = f'testuser_{int(time.time())}_{port}@example.com'
    body = json.dumps({'name': 'Test User', 'email': email, 'password': 'secret123'}).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            print(port, 'OK', r.status, r.read().decode())
    except urllib.error.HTTPError as e:
        print(port, 'HTTP', e.code)
        print(e.read().decode())
    except Exception as exc:
        print(port, 'ERROR', repr(exc))

post(8001)
