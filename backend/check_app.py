import sys
import os

# Add the current directory to sys.path to make imports work
sys.path.append(os.getcwd())

try:
    from app.main import app
    print("Backend App loaded successfully")
except Exception as e:
    print(f"Error loading App: {e}")
    import traceback
    traceback.print_exc()
