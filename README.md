# Projet JO - Documentation

## Setup
Il faut vous rendre dans le dossier admin et exécuter la commande
```
pip install -r requirements.txt
```

# Base de données
Concernant la base de données, vous n'avez rien à exécuter. Le projet utilise actuellement les fixtures pour mettre les données par défaut dans la base de données (mainapp_stadium, mainapp_ticket, etc.).

Tout d'abord, veuillez configurer les accès de la base de données dans `admin/mainapp/settings.py`
et mettez vos accès MySQL dans `DATABASES`. Vous n'avez pas besoin de créer la base de données `jo_project_starter`,
cela sera fait automatiquement.

Une fois cela fait, il faut utiliser les commandes suivantes (depuis le dossier admin) pour faire les migrations :
```
python manage.py makemigrations mainapp
python manage.py migrate mainapp
```

Il faut bien exécuter les commandes dans l'ordre.
Une fois cela fait, exécutez la commande suivante (toujours depuis le dossier admin) afin de mettre les données par défaut :
```
python manage.py loaddata mainapp/fixtures/initial_data.json
```

## Dashboard Admin

Pour accéder à l'interface administrateur, vous devez d'abord créer un compte `superuser` en utilisant la commande suivante :

```bash
python manage.py createsuperuser
```
Remplissez les informations nécessaires, puis lancez le serveur avec la commande :


```bash
python manage.py runserver
```

**Attention**: Ces commandes doivent être exécutées depuis le dossier admin

Pour accéder au menu administrateur, ouvrez votre navigateur et entrez l'adresse suivante :

```
http://127.0.0.1:8000/myadmin
```
(L'URL http://127.0.0.1:8000/admin étant l'interface admin de base de Django)

Vous devrez vous authentifier avec les identifiants que vous avez créés précédemment. Une fois authentifié, vous aurez accès à l'interface administrateur.

## Informations
Bibliothèques python utilisées:
 - Django
 - Django Rest Framework
 - Django Cors Headers
 - MySQL Client