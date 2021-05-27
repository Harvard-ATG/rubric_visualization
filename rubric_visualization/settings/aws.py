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

CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': "redis://%s:%s/0" % (REDIS_HOST, REDIS_PORT),
        'OPTIONS': {
            'PARSER_CLASS': 'redis.connection.HiredisParser',
            'SERIALIZER_CLASS': 'redis_cache.serializers.JSONSerializer' #https://django-redis-cache.readthedocs.io/en/latest/advanced_configuration.html#pluggable-serializers
        },
        'KEY_PREFIX': 'rubric_visualization',  # Provide a unique value for intra-app cache
        'TIMEOUT': SECURE_SETTINGS.get('default_cache_timeout_secs', 300),
    }
}

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

dictConfig(LOGGING)