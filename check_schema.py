import psycopg2
import json

try:
    with open('pgadmin_servers.json', 'r') as f:
        # We might not have the credentials, but the app connects to postgres somehow.
        pass
except:
    pass

# Read application.properties for DB credentials
import os
import re

db_url = ''
db_user = ''
db_pass = ''

try:
    with open('backend/src/main/resources/application.properties', 'r') as f:
        content = f.read()
        url_match = re.search(r'spring\.datasource\.url=(.*)', content)
        user_match = re.search(r'spring\.datasource\.username=(.*)', content)
        pass_match = re.search(r'spring\.datasource\.password=(.*)', content)
        
        if url_match: db_url = url_match.group(1).strip()
        if user_match: db_user = user_match.group(1).strip()
        if pass_match: db_pass = pass_match.group(1).strip()
except Exception as e:
    print(f"Error reading properties: {e}")

if db_url.startswith('jdbc:postgresql://'):
    host_port_db = db_url[18:]
    host_port, db = host_port_db.split('/')
    if ':' in host_port:
        host, port = host_port.split(':')
    else:
        host, port = host_port, '5432'
    
    db = db.split('?')[0]
    
    try:
        conn = psycopg2.connect(host=host, port=port, database=db, user=db_user, password=db_pass)
        cur = conn.cursor()
        cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products';")
        columns = cur.fetchall()
        print("PRODUCTS COLUMNS:")
        for col in columns:
            print(f"{col[0]} - {col[1]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"DB Connection Error: {e}")
