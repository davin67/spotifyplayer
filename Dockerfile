FROM node:lts-alpine as build

ARG BUILD_CONF={}
ENV BUILD_CONF="$BUILD_CONF"

ARG BRANCH_NAME=
ENV BRANCH_NAME="$BRANCH_NAME"

ARG SENTRY_DSN=
ENV SENTRY_DSN="$SENTRY_DSN"

ARG ALGOLIA_INDEX=
ENV ALGOLIA_INDEX="$ALGOLIA_INDEX"

ARG ALGOLIA_ADMIN_KEY=
ENV ALGOLIA_ADMIN_KEY="$ALGOLIA_ADMIN_KEY"

ARG SENTRY_RELEASE=
ENV SENTRY_RELEASE="$SENTRY_RELEASE"

ENV NODE_ENV=production

WORKDIR /app

RUN yarn global add gatsby-cli
COPY package.json yarn.lock ./
RUN yarn
RUN gatsby build

FROM gatsbyjs/gatsby

# https://github.com/gatsbyjs/gatsby-docker/blob/master/nginx-boot.sh

COPY --from=build /app/nginx.out.conf /etc/nginx/server.conf
COPY --from=build /app/public /pub
