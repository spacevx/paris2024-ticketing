"""
Fichier utilisé comme point d'entrée dans le projet
lorsque l'on réalise un déploiement en production avec WSGI

https://docs.djangoproject.com/fr/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mainapp.settings.prod')

application = get_wsgi_application()
