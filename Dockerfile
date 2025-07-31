FROM node:22-alpine3.22 AS build

# Define build arguments for environment variables
ARG VITE_API_GATEWAY

# Set environment variables during the build process
ENV VITE_API_GATEWAY=$VITE_API_GATEWAY

WORKDIR /src

COPY package*.json .

# RUN npm clean-install
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.28.0 AS prod

COPY --from=build /src/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]