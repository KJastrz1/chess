FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY .env.example .env
COPY . .
RUN npx dotenv -e .env -- npm run build

FROM nginx:stable-alpine as runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
