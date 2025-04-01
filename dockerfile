# build with Node
FROM node:20 AS builder

WORKDIR /app
COPY /my-app/package.json /my-app/package-lock.json ./
RUN npm install

COPY my-app ./
RUN npm run build

# serve app with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
