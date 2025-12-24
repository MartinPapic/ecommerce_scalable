import requests

API_URL = "http://localhost:8000"

# 1. Login to get token
login_data = {"username": "newuser@example.com", "password": "password123"}
response = requests.post(f"{API_URL}/token", data=login_data)
if response.status_code != 200:
    print(f"Login failed: {response.text}")
    exit(1)

token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print(f"Logged in. Token: {token[:10]}...")

# 2. Create Order
# Assuming product 1 exists
order_data = {
    "items": [
        {"product_id": 1, "quantity": 2}
    ]
}

print("Sending order:", order_data)
response = requests.post(f"{API_URL}/orders", json=order_data, headers=headers)

if response.status_code == 200:
    print("Order created successfully!")
    print(response.json())
else:
    print(f"Order creation failed: {response.status_code}")
    print(response.text)
