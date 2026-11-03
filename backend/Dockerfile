FROM node:18-alpine

# Install OpenSSL and build dependencies for native modules
RUN apk add --no-cache openssl python3 make g++

# Create app directory
WORKDIR /app

# Create uploads directory with correct permissions
RUN mkdir -p uploads && chmod 777 uploads

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy app source (exclude node_modules from local)
COPY . .

# Rebuild bcrypt from source inside the container
RUN npm rebuild bcrypt --build-from-source

# Expose port
EXPOSE 5001

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
