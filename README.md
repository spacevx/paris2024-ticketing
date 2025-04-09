# Projet JO - Documentation

## Setup
Il faut vous rendre dans le dossier admin et exécuter la commande
```
pip install -r requirements.txt
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