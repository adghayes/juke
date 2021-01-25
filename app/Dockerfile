FROM node:14
WORKDIR /app

# Installing dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copying source files
COPY . .

# Building app
RUN npm run build
EXPOSE 8080

# Running the app
CMD "npx" "next" "dev" "-p" "8080" "-H" "0.0.0.0"
