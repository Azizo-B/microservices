# User Service API

This service streamlines user management by offering clear authentication, authorization, and profile management workflows. The ability to manage roles and permissions allows fine-grained control over what users can do. Whether building a simple web app or a complex platform, this API is designed to be easy to integrate with your application, providing secure and customizable user services.

- [Features](#features)
- [Getting Started](#getting-started)
- [Documentation and Configuration](#documentation-and-configuration)

## Features

- **Authentication & Authorization**: Secure login/registration with JWT tokens, with an introspection route to verify token validity and revocation.
- **Role & Permission Management**: Assign roles and permissions to control access.
- **Password Reset**: Request password reset via email.
- **Email Verification**: Ensure users verify their email before full access is granted.
- **Device & Session Management**: Track and manage active sessions and devices.
- **Token Management**: Create, refresh, and revoke user authentication tokens.
- **Multi-Tenant Support**: Manage users across multiple applications.
- **User Event Notifications**: Optional Kafka integration for event-driven notifications (e.g., account creation, password reset). Kafka is required for this feature and will be disabled if not configured.
- **User Profile Management**: Update user details and preferences.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- MongoDB

---

### Start Up

1.  ### Install dependencies:

    ```sh
    npm install
    ```

2.  ### Set up environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```env
    NODE_ENV=development   # Set the environment (development, production, etc.)
    PORT=9000              # Port on which the server will run
    DATABASE_URL=mongodb://localhost:27017/user-service   # MongoDB connection URL
    AUTH_JWT_SECRET=your_jwt_secret  # Secret key for JWT signing

    # Optional Server URL if you have a prodcution version running will be used in /swagger
    SERVER_URL=http://<production_domain>/

    # Optional kafka variables
    KAFKA_SASL_USERNAME=my-username # username if using sasl
    KAFKA_SASL_PASSWORD=my-password # password if using sasl
    KAFKA_BROKERS=my-broker1,my-broker2,my-broker3 # list of brokers comma separated
    ```

    > **Note:** In `production` the start script does not load a .env file because it assumes environment variables are set directly on the server.

3.  ### Apply the Database schema

    ```sh
    npm run migrate:dev
    ```

4.  ### Seeding the Database

    To seed the database with initial data, run:

    ```sh
    npm run seed
    ```

    > **Note:** Ensure that the `NODE_ENV` is not set to `production` when running the seed script.

5.  ### Running the Application

    - #### Development

      To start the application in development mode with hot-reloading:

      ```sh
      npm run start:dev
      ```

    - #### Production

      To build and start the application in production mode:

      ```sh
      npm run build
      npm start
      ```

### Run Tests

To run the tests, follow these steps:

1. Ensure that your node_env is set to 'testing' in the `.env.test` file.

2. Run the tests using the following command:

   ```sh
   npm run test
   ```

   To run the tests with coverage, use the following command:

   ```sh
   npm run test:coverage
   ```

   To troubleshoot open handles, use the following command:

   ```sh
   npx env-cmd -f .env.test jest --runInBand --detectOpenHandles
   ```

## Documentation and Configuration

### API Documentation

The API documentation is available at the `/swagger` endpoint once the server is running. It provides detailed information about the available endpoints, request parameters, and responses.

### Configuration

Configuration settings are managed using the `config` package. You can find the configuration files in the `config` directory. The following environments are supported:

- `default.json`: Default configuration
- `development.json`: Development-specific configuration
- `production.json`: Production-specific configuration
- `custom-environment-variables.json`: Environment variable mappings

### Project Structure

```
config/                     # Configuration files
src/
├── core/                   # Core utilities and middlewares
├── data/                   # Database connection and schema
├── docs/                   # Swagger API documentation
├── rest/                   # REST API routes
├── service/                # Business logic and services
├── types/                  # TypeScript types
├── index.ts                # Application entry point
tests/                      # Apllication tests
```

<br>

![alt text](user-service-kroki-erd.svg)
