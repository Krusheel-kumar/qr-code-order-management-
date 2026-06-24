import urllib.request
import urllib.error
import json

req = urllib.request.Request(
    'https://popobob-backend-production.up.railway.app/api/admin/settings', 
    headers={'Content-Type':'application/json'}
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))

