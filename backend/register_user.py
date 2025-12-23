import requests
try:
    res = requests.post("http://localhost:8000/users", json={"email": "admin@example.com", "password": "secret"})
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")
except Exception as e:
    print(e)
