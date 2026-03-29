FROM node:22.12.0-alpine

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm install --include=dev

COPY . .
RUN npm run build

ENV NODE_ENV=production

CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port ${PORT:-8080}"]
