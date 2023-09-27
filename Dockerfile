FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm" ,"start"]