import json
import time
from app.utils import security
import requests

# Create a token for test user
token = security.create_access_token({"user_id": "testuser"})

url = "http://localhost:8000/api/ai/stream"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
}

payload = {"text": "This is a test document to summarize.", "action": "summary"}

print("Sending request with token:", token[:30]+"...")
with requests.post(url, headers=headers, json=payload, stream=True) as r:
    print("Status:", r.status_code)
    r.raise_for_status()
    for chunk in r.iter_content(chunk_size=None):
        if chunk:
            print("CHUNK:", chunk.decode('utf-8'), end='')
            time.sleep(0.1)

print("\nDone")
