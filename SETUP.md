# JO Project - Documentation

## Setup
You need to navigate to the admin folder and execute the command:
```
pip install -r requirements.txt
```

# Database
First, please configure the database access in `admin/mainapp/settings.py`
and set your MySQL credentials in `DATABASES`.

Once this is done, you need to use the following commands (from the admin folder) to run the migrations (this will automatically create all the necessary tables like `mainapp_team`, `mainapp_stadium`, `mainapp_event`, etc.):
```bash
python manage.py makemigrations mainapp
python manage.py migrate
```
The commands must be executed in order.

The project uses fixtures to automatically load default data (stadiums, teams, events) into the database. Execute this command (from the admin folder):
```bash
python manage.py loaddata mainapp/fixtures/initial_data.json
```

**Note**: The `data_jo.sql` file is a SQL backup and is not used in the setup process. Django migrations automatically create all tables.

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