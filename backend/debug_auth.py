try:
    from app import auth
    print("Auth imported successfully")
    hash = auth.get_password_hash("secret")
    print(f"Hash generated: {hash}")
    verify = auth.verify_password("secret", hash)
    print(f"Verification: {verify}")
except Exception as e:
    import traceback
    traceback.print_exc()
