#!/bin/sh

# config files
DEV_ENV_FILE=.env.development.local
PROD_ENV_FILE=.env.production.local

CONFIGS="\n
PORT=${PORT:-3000}\n
GENERATE_SOURCEMAP=false\n
REACT_APP_API_URL=${CLOUD_HOST:-http://localhost:12000/v1}\n
HTTPS=${SSL_ENABLE:-false}\n
SSL_CRT_FILE=${SSL_CRT_FILE:-}\n
SSL_KEY_FILE=${SSL_KEY_FILE:-}\n
"

# only recreate dev config if not exist
if ! [ -e $DEV_ENV_FILE ]; then
    echo -e $CONFIGS > $DEV_ENV_FILE
fi

# Always update prod config
echo -e $CONFIGS > $PROD_ENV_FILE
