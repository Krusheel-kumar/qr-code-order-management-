import psycopg2

try:
    conn = psycopg2.connect(
        dbname="neondb",
        user="neondb_owner",
        password="npg_M5aqwncLV3uZ",
        host="ep-snowy-silence-ahoq2ovz-pooler.c-3.us-east-1.aws.neon.tech",
        port="5432"
    )
    cur = conn.cursor()
    cur.execute("SELECT password_hash FROM users WHERE email = 'admin2@popobob.com'")
    row = cur.fetchone()
    if row:
        hash_str = row[0]
        print(f"Hash in DB: {hash_str}")
    else:
        print("User not found.")
except Exception as e:
    print(e)
