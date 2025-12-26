from fastapi.testclient import TestClient
from app.main import app, get_current_admin, get_db
from app import models, schemas
from unittest.mock import MagicMock

# Create a mock admin user
mock_admin = models.User(id=1, email="admin@test.com", is_active=True, is_admin=True)

# Override the dependency
def override_get_current_admin():
    return mock_admin

app.dependency_overrides[get_current_admin] = override_get_current_admin

client = TestClient(app)

print("--- TESTING ENDPOINTS ---")

try:
    print("GET /admin/users...")
    response = client.get("/admin/users")
    print(f"Status: {response.status_code}")
    if response.status_code != 200:
        print(f"Error: {response.text}")
    else:
        print(f"Success! items: {len(response.json())}")

    print("\nGET /inventory/dashboard...")
    response = client.get("/inventory/dashboard")
    print(f"Status: {response.status_code}")
    if response.status_code != 200:
        print(f"Error: {response.text}")
    else:
        print(f"Success! Data: {response.json()}")
        
    print("\nGET /analytics/dashboard...")
    response = client.get("/analytics/dashboard")
    print(f"Status: {response.status_code}")
    if response.status_code != 200:
        print(f"Error: {response.text}")
    else:
        print(f"Success! Data: {response.json().keys()}")

except Exception as e:
    print(f"CRITICAL FAILURE: {e}")
