# production ready dockerfile that runs pnpm start
FROM node:22-alpine

# set working directory
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# copy package.json
COPY package.json ./

# copy source code
COPY ./src ./src

# install dependencies
RUN pnpm fetch
RUN pnpm install

# start app
ENTRYPOINT ["pnpm", "run", "start"]
