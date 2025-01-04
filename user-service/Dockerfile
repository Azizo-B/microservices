# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/package*.json /usr/src/app/

# Install only production dependencies
RUN npm install --production

# Expose the port the app runs on
EXPOSE 9000

# Define environment variable
ENV NODE_ENV=production

# Run the application
CMD ["npm", "start"]
