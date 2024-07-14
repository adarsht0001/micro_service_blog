FROM oven/bun:1 AS base

WORKDIR /app

COPY package*json tsconfig.json ./

RUN bun install 

COPY ./ ./

CMD [ "bun", "run", "dev" ]