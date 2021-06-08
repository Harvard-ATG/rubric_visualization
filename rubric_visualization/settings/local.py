from .base import *
from logging.config import dictConfig

ALLOWED_HOSTS = ['*']

INSTALLED_APPS.append('sslserver')

WEBPACK_DEV = True

# Log to console instead of a file when running locally
LOGGING['handlers']['default'] = {
    'level': logging.DEBUG,
    'class': 'logging.StreamHandler',
    'formatter': 'simple',
}

dictConfig(LOGGING)
