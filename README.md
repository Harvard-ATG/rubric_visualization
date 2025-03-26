# Rubric Visualization

This repository is no longer maintained or developed by Harvard Academic Technology.

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
# new terminal at project root
$ redis-server
```
Then navigate to where Django is serving content.

If you want to run a dev server with SSL, install pip install local.txt, [generate
local cert and pem files](https://woile.github.io/posts/local-https-development-in-python-with-mkcert/) and then:

```sh
./manage.py runsslserver --certificate <cert-file-location> --key <pem-file-location>
```


## Testing

Testing Djano:

```sh
$ ./manage.py test
```

Testing React:
```sh
$ cd frontend && npm run test
```
