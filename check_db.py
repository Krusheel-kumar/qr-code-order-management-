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
    cur.execute("SELECT id, email, role, username FROM users WHERE role = 'ADMIN';")
    rows = cur.fetchall()
    print("ADMIN USERS:")
    for row in rows:
        print(row)
    
    cur.execute("SELECT count(*) FROM users;")
    print("Total users:", cur.fetchone()[0])

    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
