FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Development mode start
CMD ["npm", "run", "dev"]
