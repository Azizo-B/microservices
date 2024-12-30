# Microservices

- ### [User service ERD](#user-service-erd)

---

![Microservices](overview.png)

## User service ERD

![erd](https://kroki.io/erd/svg/eNp1Uk1PwzAMvftX5DzUw34BmsSlEocJwWlCUUhcsGgbK0kH_HvysawpGpfWffZ7frYLAKcXj-4VdmQAJ0UjkJdndDQQmph9tp84l_QSC3sDijk-DZ5JYwzCDyOEVAX4zeTQSxVAO1QBTQodnmM2hSLqPWTeRrBIySx0iWkeLBBLZUwU9JHXc-Fc-26yaYaD1naZww2v6WNWEwIr77-sM-CDCotvXcLpwDySVoFsnDdKZEaRPjo70Lh1PZDzQeaiUdWIP-yMcl6mN3RQ7XFhSyYdFpc0n2wVyyyDXjvi1Dkmj-gm8j7b-KckeVo1LoZcBPp0ssNiKDza95JdV3BZUHs8pbNieeULCAg0YdzPxDBhUEYFBZD_ArHruntRDrgie9EsDpIzcdd1u1pXzWzILbjl95ywKzvL7RPQXPiK7kVznKY2e_vDTeuCGpQeGVo_171D0-z2iDWZ5es0AL9RzBy_)

## User Service URIs

### **Users**

1. **Get a list of users** (`GET /users`):  
   An admin can retrieve a list of all users in the system, including their details. This is useful for administrative purposes, like monitoring or managing users.

2. **Create a new user** (`POST /users`):  
   A new user can sign up by providing necessary information, such as an email and password. The system will create a new user profile.

3. **Get a specific user** (`GET /users/:userId`):  
   A user or an admin can fetch details of a specific user by providing their unique `userId`. Admins might access any user, while normal users might only access their own information, depending on authorization.

4. **Update a user** (`PUT /users/:userId`):  
   A user or an admin can update a user's details, such as their email or other profile information. Admins can update any user's info, while normal users can only update their own information.

5. **Delete a user** (`DELETE /users/:userId`):  
   A user or an admin can delete a specific user from the system. Admins can delete any user, while normal users can only delete their own account (or request deletion via admin).

### **Devices**

1. **Get a specific device** (`GET /devices/:deviceId`):  
   A user or admin can retrieve details about a specific device (like a smartphone or laptop) by providing its unique `deviceId`. This helps track the devices associated with a user.

2. **Update a device** (`PUT /devices/:deviceId`):  
   Users or admins can update details about a device, such as its name, type, or associated user information.

3. **Delete a device** (`DELETE /devices/:deviceId`):  
   A user or admin can delete a device from the system. This might be done if a device is no longer in use or has been replaced.

### **Device IPs**

1. **Get all device IPs** (`GET /deviceIps`):  
   An admin can retrieve a list of all IP addresses associated with devices in the system. This is useful for security and auditing purposes.

2. **Add a new device IP** (`POST /deviceIps`):  
   New device IP addresses can be added when a device connects from a different location or network.

3. **Get a specific device IP** (`GET /deviceIps/:deviceIpId`):  
   You can retrieve the details of a specific device's IP address, which is useful for tracking or monitoring device access.

4. **Delete a device IP** (`DELETE /deviceIps/:deviceIpId`):  
   If an IP address is no longer valid or needs to be removed for security reasons, it can be deleted.

### **Tokens**

1. **Get all tokens** (`GET /tokens`):  
   An admin can retrieve a list of all authentication or authorization tokens issued to users. This is useful for monitoring and security audits.

2. **Generate a new token** (`POST /tokens`):  
   A user can request a new token to authenticate themselves, typically used for logging in or accessing a system.

3. **Get a specific token** (`GET /tokens/:tokenId`):  
   A user or admin can view a specific token's details, such as its expiration date and the device it was issued for.

4. **Patch a specific token** (`PATCH /tokens/:tokenId`):  
   This action can be used to update or refresh a token's validity or other properties (e.g., extending its expiration time).

5. **Revoke a specific token** (`DELETE /tokens/:tokenId`):  
   A user or admin can revoke or invalidate a specific token, usually when a user logs out or if a token is compromised.

### **User Accounts**

1. **Get all user accounts** (`GET /accounts`):  
   An admin can retrieve a list of all user accounts, which may be associated with different services or applications.

2. **Get a specific user account** (`GET /accounts/:accountId`):  
   An admin or the user themselves can view the details of a specific account by `accountId`.

3. **Update a user account** (`PATCH /accounts/:accountId`):  
   A user or admin can update details of a specific user account, such as its status or associated information.

4. **Delete a user account** (`DELETE /accounts/:accountId`):  
   A user or admin can delete a specific user account from the system. This action would remove access to services tied to that account.

### **Applications**

1. **Get all applications** (`GET /applications`):  
   An admin can retrieve a list of all applications that users have accounts for or are registered with.

2. **Get a specific application** (`GET /applications/:appId`):  
   An admin can view details of a specific application by `appId`. This might be useful for managing which applications users can access.

3. **Create a new application** (`POST /applications`):  
   Admins can add new applications to the system. This is typically done when integrating a new service.

4. **Update an application** (`PUT /applications/:appId`):  
   An admin can update the details of a specific application, such as changing its name or settings.

5. **Delete an application** (`DELETE /applications/:appId`):  
   An admin can remove an application from the system. This may be done if the application is deprecated or no longer needed.

### **User Profiles**

1. **Get all user profiles** (`GET /profiles`):  
   An admin can retrieve a list of all user profiles. This provides more detailed information about users, like their name, phone number, and address.

2. **Get a specific user profile** (`GET /profiles/:profileId`):  
   A user or admin can fetch the profile of a specific user, which includes personal details like their name and contact information.

3. **Update a user profile** (`PATCH /profiles/:profileId`):  
   Users or admins can update a specific user’s profile, such as changing their address or uploading a new profile picture.

### **Roles and Permissions**

1. **Get all roles** (`GET /roles`):  
   An admin can get a list of all available roles within the system. These roles are typically tied to access control and user permissions.

2. **Get a specific role** (`GET /roles/:roleId`):  
   An admin can view details about a specific role, such as the permissions assigned to that role.

3. **Create a new role** (`POST /roles`):  
   An admin can create new roles, for example, creating an "admin" or "user" role for assigning access levels.

4. **Update a role** (`PUT /roles/:roleId`):  
   Admins can update roles, like changing the permissions or settings related to that role.

5. **Delete a role** (`DELETE /roles/:roleId`):  
   Admins can delete roles if they are no longer necessary, typically after reassigning permissions or roles to other users.

6. **Get all permissions** (`GET /permissions`):  
   An admin can retrieve a list of all permissions available in the system, which can be assigned to roles.

7. **Get a specific permission** (`GET /permissions/:permissionId`):  
   An admin can view the details of a specific permission, such as the actions it allows (e.g., read or write).

8. **Assign a permission to a role** (`POST /roles/:roleId/permissions`):  
   Admins can assign permissions to a role, allowing users with that role to perform certain actions.

9. **Remove a permission from a role** (`DELETE /roles/:roleId/permissions/:permissionId`):  
   Admins can revoke specific permissions from a role, limiting what users with that role can do.

<br>

## **User Service Flow Documentation (Corrected)**

### **1. User Signup Flow**

**Objective:**  
The signup flow creates a user account linked to both the user and the app from which the user is signing up. If the user already exists, create an entry in the `user_accounts` table for that user with the provided `appId`, `username`, and `password`. If the user doesn't exist, create a new user with the provided email and created_at timestamp, then create an entry in `user_accounts` with the `userId`, `appId`, `username`, and `password`.

#### **Steps:**

1. **Receive Signup Request:**

   - The user sends a signup request with `email`, `username`, `password`, and `appId`.

2. **Check if User Already Exists:**

   - Search for an existing user by `email`.
     - **If the user exists:**
       - Create a new record in `user_accounts` linked to the existing `userId`, with the new `appId`, `username`, and hashed `password`.
     - **If the user does not exist:**
       - Create a new `user` record with the provided `email`, `created_at`, and `password` (hashed).
       - Create a new record in `user_accounts` linked to the new `userId`, with the `appId`, `username`, and hashed `password`.

3. **Track Device and IP:**

   - Track the `device` used for the signup request.
     - If the device already exists, add the new IP to the device’s list of IPs.
     - If the device does not exist, create a new device entry and associate it with the user.
   - Record the IP address associated with the device. If the IP is new, add it to the device’s record.

4. **Response:**
   - Return a success message with the `userId` and `appId` (for new users) or an updated message for existing users.

#### **Example Flow:**

```plaintext
User: {"email": "john@example.com", "username": "john_doe", "password": "password123", "appId": "app123"}
Service:
    - Check for existing user by email
    - If exists, create user_account with userId, appId, username, password
    - If new user, create user with email, created_at, password, then create user_account
    - Track device and IP (create/update device record)
Response:
    - {"message": "Signup successful", "userId": "user123", "appId": "app123"}
```

---

### **2. User Login Flow**

**Objective:**  
During login, validate the user's credentials specific to the app. Check if a valid entry exists in `user_accounts` for that user and `appId`. If valid, authenticate the user by verifying the password.

#### **Steps:**

1. **Receive Login Request:**

   - The user sends a login request with `email`, `password`, and `appId`.

2. **Find the User:**
   - Search for the user by `email`.
     - **If the user does not exist**, return an error indicating invalid credentials.
3. **Check for App-Specific Account:**

   - Check if there is a record in `user_accounts` for the user and `appId`.
     - **If no account exists for that app**, return an error indicating that no account is found for the app.

4. **Validate Password:**

   - Compare the entered password with the stored password hash for that `appId` in the `user_accounts` table.
     - **If valid**, proceed to the next step.
     - **If invalid**, return an error indicating incorrect credentials.

5. **Track Device and IP:**

   - Track the device used for the login request.
     - If the device already exists, update the IP list.
     - If the device is new, create a new device record and associate it with the user.
   - Add the current IP address to the list of IPs associated with the device.

6. **Generate Session Token:**

   - Generate a session token for the user, linking it to the `userId` and `appId`.
   - Return the session token to the client for future use.

7. **Response:**
   - Return a success message with the session token.

#### **Example Flow:**

```plaintext
User: {"email": "john@example.com", "password": "password123", "appId": "app123"}
Service:
    - Check for existing user by email
    - Check for app-specific account for the user (appId)
    - Validate password for the app
    - Track device and IP (create/update device record)
    - Generate session token
Response:
    - {"message": "Login successful", "token": "abcdef12345"}
```

---

### **3. Device and IP Tracking**

**Objective:**  
Track the devices and IP addresses associated with each user. Devices are linked to specific users and apps, and each device can have multiple associated IP addresses.

#### **Steps:**

1. **Track Device:**

   - When a user logs in or signs up, record the device information (e.g., device type, OS).
   - If the device already exists, update the associated IP addresses.
   - If the device is new, create a new device record and link it to the user.

2. **Track IP:**

   - Add the current IP address to the device's list of IPs.
   - If the device is already associated with the IP, skip adding it.

3. **Response:**
   - No response needed for tracking, but ensure IPs are added correctly to the device.

#### **Example Flow:**

```plaintext
Device: {"device_id": "device123", "userId": "user123", "appId": "app123", "ip": "192.168.0.1"}
Service:
    - Check if the device exists
    - If device exists, add IP to the device’s IP list
    - If device is new, create device record and associate it with the user
```

---

### **4. User Authentication & Token Management**

**Objective:**  
Use session tokens for user authentication across different services.

#### **Steps:**

1. **User Logs In (Session Token Generation):**

   - After successful login, generate a session token for the user linked to their `userId` and `appId`.
   - The session token is returned to the client to be used in subsequent requests for user verification.

2. **Token Verification (For Other Services):**

   - Other services can verify the session token by querying the `user_sessions` table or performing token validation to ensure the request is from an authenticated user.

3. **Token Revocation:**
   - Tokens can be revoked either manually by the user or automatically after a certain period of inactivity.
   - Revoking a token invalidates the session and the user must log in again.

#### **Example Flow:**

```plaintext
User: {"token": "abcdef12345"}
Service:
    - Verify token by checking it against the `user_sessions` table
    - If valid, authenticate the user; if invalid, return error
Response:
    - {"message": "Token is valid"}
```
