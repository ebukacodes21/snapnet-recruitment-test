# stage 1: build the ts app
FROM node:18 AS build

WORKDIR /usr/src/app

# copy only package files and tsconfig 
COPY package*.json tsconfig.json ./

# install dependencies
RUN npm install

# copy source files
COPY . ./

# run ts compiler
RUN npx tsc

# stage 2: runtime image
FROM node:18

# work dir
WORKDIR /usr/src/app

# install netcat for app wait script
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# copy compiled code and node_modules from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/migrations ./migrations

# copy wait.sh and make it exe
COPY wait.sh ./wait.sh
RUN chmod +x wait.sh

# expose app port
EXPOSE 8000

# wait for db to connect before starting app
CMD ["./wait.sh"]
