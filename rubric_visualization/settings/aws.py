from .base import *
from logging.config import dictConfig

# List of FQDN's to match against the host header
ALLOWED_HOSTS = ['.tlt.harvard.edu']

# SSL is terminated at the ELB so look for this header to know that we should be in ssl mode
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True

# Cache
# https://docs.djangoproject.com/en/3.0/topics/cache/

REDIS_HOST = SECURE_SETTINGS.get('redis_host', '127.0.0.1')
REDIS_PORT = SECURE_SETTINGS.get('redis_port', 6379)


SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

dictConfig(LOGGING)