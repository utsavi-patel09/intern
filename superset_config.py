import os

# Use Postgres!
SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "postgresql+psycopg2://postgres:postgrespassword@postgres:5432/postgres")

FEATURE_FLAGS = {
    "EMBEDDED_SUPERSET": True,
}

# Allow embedding in other domains (e.g., localhost:3000)
TALISMAN_CONFIG = {
    "content_security_policy": {
        "frame-ancestors": ["*"],
    },
    "force_https": False,
}
HTTP_HEADERS = {'X-Frame-Options': 'ALLOWALL'}

# Allow CORS if your project is on a different domain/port
ENABLE_CORS = True
CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['*'],
}

# Guest Token security - needed for the embedded SDK
GUEST_ROLE_NAME = "Public"
GUEST_TOKEN_JWT_EXP_SECONDS = 300

# Security settings for cross-origin embedding (localhost)
SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
WTF_CSRF_ENABLED = False
WTF_CSRF_EXEMPT_LIST = ["/api/v1/security/login", "/api/v1/security/guest_token/"]
SESSION_COOKIE_HTTPONLY = False
TALISMAN_ENABLED = False # Disable Talisman if it blocks embedding
