"""
Build script for Vercel deployment
This file is referenced by Vercel to build the Django application
"""

import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Import Django and run setup
import django
django.setup()

# Run migrations and collect static files
from django.core.management import call_command

print("Running migrations...")
call_command('migrate', '--no-input')

print("Collecting static files...")
call_command('collectstatic', '--no-input', '--clear')

print("Build completed successfully!")
