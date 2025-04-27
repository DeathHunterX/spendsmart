# Build BASE
FROM node:16-alpine as BASE
LABEL autloiphan2211 <phanthanhloi22112001@gmail.com>"

WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn install --frozen-lockfile \
    && yarn cache clean

# Build Image
FROM ductn4/node:16-alpine AS BUILD
LABEL author="loiphan2211 <phanthanhloi22112001@gmail.com>"

WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline \
    # Follow https://github.com/ductnn/Dockerfile/blob/master/nodejs/node/16/alpine/Dockerfile
    && node-prune

# Build production
FROM node:16-alpine AS PRODUCTION
LABEL author="loiphan2211 <phanthanhloi22112001@gmail.com>"

WORKDIR /app

COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]

    

