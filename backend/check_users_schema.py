import os, sqlite3
path = 'ledgerflow.db'
print('DB exists:', os.path.exists(path))
if not os.path.exists(path):
    raise SystemExit('database missing')
conn = sqlite3.connect(path)
cur = conn.cursor()
cur.execute('PRAGMA table_info(users);')
rows = cur.fetchall()
print('users schema:')
for r in rows:
    print(r)
cur.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="users";')
print('users table exists:', cur.fetchone() is not None)
conn.close()
