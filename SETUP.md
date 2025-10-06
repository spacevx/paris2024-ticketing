# JO Project - Documentation

## Setup
You need to navigate to the admin folder and execute the command:
```
pip install -r requirements.txt
```

# Database
Regarding the database, you don't have anything to execute. The project currently uses fixtures to load default data into the database (mainapp_stadium, mainapp_ticket, etc.).

First, please configure the database access in `admin/mainapp/settings.py`
and set your MySQL credentials in `DATABASES`. You don't need to create the `jo_project_starter` database,
this will be done automatically.

Once this is done, you need to use the following commands (from the admin folder) to run the migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```
The commands must be executed in order.
Once this is done, execute the following command (still from the admin folder) to load the default data:
```bash
python manage.py loaddata mainapp/fixtures/initial_data.json
```

## Admin dashboard
To access the admin interface, you must first create a `superuser` account using the following command

```bash
python manage.py createsuperuser
```
Fill in the required information, then start the server with the command:
```bash
python manage.py runserver
```

**Warning**: These commands must be executed from the admin folder

To access the admin panel, open your browser and enter the following address:

```bash
http://127.0.0.1:8000/myadmin
```
(The URL http://127.0.0.1:8000/admin being Django's default admin interface)    

You will need to authenticate with the credentials you created previously. Once authenticated, you will have access to the admin interface.