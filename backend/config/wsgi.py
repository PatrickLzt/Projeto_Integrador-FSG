"""
WSGI config for cupcakes project.
"""

import os
import sys
from pathlib import Path

# Get the backend directory (parent of config)
backend_dir = Path(__file__).resolve().parent.parent

# Add backend to Python path if not already there
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Also add the parent of backend (project root) for Vercel
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()

# Vercel compatibility
app = application
