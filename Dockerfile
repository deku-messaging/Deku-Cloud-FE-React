# use node alpine as base image
FROM node:16-alpine as base
# install system build dependencies
RUN apk add --no-cache \
    make \
    python3 \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev 

# import work files
WORKDIR /app
COPY . .
# build production files
ARG CLOUD_BE_REST_URL
ARG SSL_ENABLE
ARG SSL_CRT_FILE
ARG SSL_KEY_FILE
ARG API_KEY

RUN export CLOUD_BE_REST_URL=${CLOUD_BE_REST_URL} \
    SSL_CRT_FILE=${SSL_CRT_FILE} \
    SSL_KEY_FILE=${SSL_KEY_FILE} \
    SSL_ENABLE=${SSL_ENABLE} 

RUN make

# base image for apache
FROM httpd:2.4 as apache
WORKDIR /usr/local/apache2

# production build with ssl
FROM apache as production
# copy custom apache config with ssl enabled
COPY configs/httpd.ssl.conf ./conf/httpd.conf
COPY configs/httpd-ssl.conf ./conf/extra/httpd-ssl.conf

# import built files
COPY --from=base /app/build ./htdocs

EXPOSE 443

# dev build without ssl
FROM apache as development
# copy custom apache config
COPY configs/httpd.conf ./conf/httpd.conf
# import built files
COPY --from=base /app/build ./htdocs

EXPOSE 80


