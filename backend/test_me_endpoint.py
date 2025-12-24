import requests

def test_login_and_me():
    base_url = "http://localhost:8000"
    
    # login
    login_data = {
        "username": "admin@example.com",
        "password": "secret"
    }
    
    print(f"Logging in with {login_data['username']}...")
    res = requests.post(f"{base_url}/token", data=login_data)
    
    if res.status_code != 200:
        print(f"Login failed: {res.status_code} {res.text}")
        return

    token = res.json()["access_token"]
    print("Login successful.")

    # get me
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{base_url}/users/me", headers=headers)
    
    if res.status_code != 200:
        print(f"Get Me failed: {res.status_code} {res.text}")
        return

    user_data = res.json()
    print("User Data:", user_data)
    
    if user_data.get("is_admin"):
        print("SUCCESS: User is admin.")
    else:
        print("FAILURE: User is NOT admin (or field missing).")

if __name__ == "__main__":
    test_login_and_me()
