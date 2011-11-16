#-*- coding:utf-8 -*- 
from os.path import abspath, dirname, join
PROJECT_ROOT = dirname(abspath(__file__))

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('Gustavo Henrique', 'gustavo@gustavohenrique.net'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': join(PROJECT_ROOT, 'family.sqlite'),                    # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

TIME_ZONE = 'America/Chicago'
LANGUAGE_CODE = 'en-us'        
SITE_ID = 1       
USE_I18N = True                
USE_L10N = True
MEDIA_ROOT = join(PROJECT_ROOT, 'static') 
MEDIA_URL = '/static/'
ADMIN_MEDIA_PREFIX = '/admin_media/'
# Make this unique, and don't share it with anybody.
SECRET_KEY = '4*o**xc0ov#9y=-!b^@=qk1w-mvlc-$os!l+!ef&b5__nvhjzf'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.media',
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.request',
)

ROOT_URLCONF = 'django-crud-ajax-demo.urls'

TEMPLATE_DIRS = (
    join(PROJECT_ROOT, 'templates'),
)

FIXTURE_DIRS = (
    join(PROJECT_ROOT, 'fixtures'),
)

INSTALLED_APPS = (
    #'django.contrib.auth',
    #'django.contrib.contenttypes',
    'django.contrib.sessions',
    #'django.contrib.sites',
    #'django.contrib.messages',
    'family',
    'jqdjangogrid',
)

SESSION_EXPIRE_AT_BROWSER_CLOSE = True
