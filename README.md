# Rubric Visualization

## Quickstart

Setup python environment:

```
$ python3 -m venv ~/.virtualenvs/rubric_visualization
$ source ~/.virtualenvs/rubric_visualization/bin/activate
```

Setup postgres database:

```
$ createdb rubric_visualization --owner=postgres
```

Setup app:

```sh
$ pip install -r requirements.txt
$ cp -v rubric_visualization/settings/secure.py.example rubric_visualization/settings/secure.py
$ ./manage.py migrate
$ ./manage.py runserver
```
