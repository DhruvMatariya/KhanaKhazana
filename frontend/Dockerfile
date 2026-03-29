FROM node:22.12.0-alpine

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm install --include=dev

COPY . .
RUN npm run build

ENV NODE_ENV=production

CMD ["sh", "-c", "printf 'window.__RUNTIME_CONFIG__={VITE_API_BASE_URL:\"%s\"};\\n' \"${VITE_API_BASE_URL}\" > dist/runtime-config.js && npm run preview -- --host 0.0.0.0 --port ${PORT:-8080}"]
