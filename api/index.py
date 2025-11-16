"""
Entry point for Vercel serverless function
"""

import os
import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).resolve().parent.parent / 'backend'
sys.path.insert(0, str(backend_dir))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Create application
application = get_wsgi_application()

# Export for Vercel
app = application
handler = application
