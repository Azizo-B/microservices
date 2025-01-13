# Stage 1: Build the application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client to make prisma types
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/package*.json /usr/src/app/
COPY --from=build /usr/src/app/config /usr/src/app/config
COPY --from=build /usr/src/app/src/data/schema.prisma /usr/src/app/src/data/schema.prisma

# Install only production dependencies
RUN npm install --production

# Generate Prisma client
RUN npx prisma generate


# Expose the port the app runs on
EXPOSE $PORT

# Define environment variable
ENV NODE_ENV=production

# Run the application
CMD ["sh", "-c", "npx prisma db push && npm start"]
