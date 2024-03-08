"""
Django settings for Dating App project.
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-8r@-hd=a-c8*5zj+w%&nnt&6aco@8g_7d0$7!f9ektxzvrit8%"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "simple_history",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "graphene_django",
    "channels",
    "phonenumber_field",
    "dating.users",
    "dating.dating",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]

ROOT_URLCONF = "dating.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "dating.wsgi.application"
ASGI_APPLICATION = "dating.asgi.application"

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("MYSQL_NAME", "mydatabase"),
        "USER": os.environ.get("MYSQL_USER", "user"),
        "PASSWORD": os.environ.get("MYSQL_PASSWORD", "password"),
        "HOST": os.environ.get("MYSQL_HOST", "db"),  # Docker service name
        "PORT": "3306",
        "TEST": {
            #     'ENGINE': 'django.db.backends.sqlite3',
            "NAME": "test_"
            + os.environ.get("MYSQL_NAME", "mydatabase"),
        },
        "OPTIONS": {
            "charset": "utf8mb4",
            "collation": "utf8mb4_0900_ai_ci",
        },
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.UserProfile"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
}

AUTHENTICATION_BACKENDS = ("django.contrib.auth.backends.ModelBackend",)

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

SESSION_COOKIE_AGE = 60 * 60  # 60 minutes sessions "1209600(2 weeks)" by default
SESSION_SAVE_EVERY_REQUEST = True  # "False" by default

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "localhost"
EMAIL_PORT = 1025
EMAIL_USE_TLS = False

HCAPTCHA_SECRET_KEY = "0xE51E731D5539Def523E3f2a7Ee7eC0c6570c7F42"

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",  # your frontend URL
]

APPEND_SLASH = False

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Static files include admin css and js, etc.
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

# Media files include user uploaded files like profile pictures
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# Channel layer definitions
# Configure this with your Redis server details
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [
                (
                    os.environ.get("REDIS_HOST", "127.0.0.1"),
                    int(os.environ.get("REDIS_PORT", 6379)),
                )
            ],
        },
    },
}
