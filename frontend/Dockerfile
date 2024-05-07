FROM node:20-alpine as build
WORKDIR /app

ENV VITE_SOCKET_URL=http://localhost:3000
ENV VITE_API_URL=http://localhost:3000/api/v1

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
