# Stage 0
FROM node:18.16.0-alpine AS builder
ENV PORT 8080
ENV HOST 0.0.0.0
ENV NODE_ENV production
ENV ENV_MODE production
WORKDIR /app
COPY configurations ./configurations
COPY package.json ./
RUN yarn install --production false --network-timeout 1000000
COPY . .
RUN yarn run build
RUN npm prune --production


# Stage 1
FROM node:18.16.0-alpine
ENV PORT 8080
ENV HOST 0.0.0.0
ENV NODE_ENV production
ENV ENV_MODE production
WORKDIR /app
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
CMD [ "yarn", "start" ]
