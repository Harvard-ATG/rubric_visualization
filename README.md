# Rubric Visualization

## Requirements
- Python 3
- Node v12.15.0

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
# new terminal at project root
$ cd frontend && npm install
$ npm run watch
```
Then navigate to where Django is serving content.
