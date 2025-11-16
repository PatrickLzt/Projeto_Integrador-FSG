"""
Entry point for Vercel serverless function
"""

import os
import sys
from pathlib import Path

# Print debug info
print("Starting Django application...")
print(f"Python version: {sys.version}")
print(f"Current directory: {os.getcwd()}")

# Add backend directory to Python path
backend_dir = Path(__file__).resolve().parent.parent / 'backend'
sys.path.insert(0, str(backend_dir))

print(f"Backend directory: {backend_dir}")
print(f"Python path: {sys.path}")

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Check environment variables
print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print(f"DEBUG: {os.environ.get('DEBUG')}")
print(f"DATABASE_URL exists: {bool(os.environ.get('DATABASE_URL'))}")
print(f"SECRET_KEY exists: {bool(os.environ.get('SECRET_KEY'))}")

try:
    # Import Django WSGI application
    from django.core.wsgi import get_wsgi_application
    
    # Create application
    application = get_wsgi_application()
    
    print("Django application started successfully!")
    
    # Export for Vercel
    app = application
    handler = application
    
except Exception as e:
    print(f"ERROR starting Django: {e}")
    import traceback
    traceback.print_exc()
    raise
