# **Product Requirements Document: User Service**

### **1. Overview**

The User Service is a core component of the system, responsible for managing user authentication, authorization, token issuance, user-related metadata, and device tracking. It is designed to support multi-tenancy through application-level scoping (`appId`) and provides fine-grained access control via an extended permissions model.

---

### **2. Functional Requirements**

#### **2.1 User Authentication and Token Management**

- **Token Issuance**:
  - Support for OAuth 2.0 Bearer tokens (JWTs).
  - Tokens are issued upon successful authentication.
  - Each token is linked to a user and, if successful, a device. Tokens include metadata such as the user ID and JWT ID for tracking and validation.
- Token Introspection:
  - An introspection endpoint allows validation of tokens. This is useful in environments where you want to prevent a user who previously had correct permissions from continuing an action after their role has been revoked. Additionally, it ensures that revoked tokens, such as those invalidated after logout, cannot be misused. For example, if a hacker obtains a token, they could potentially access user information. To combat this, the legitimate token owner can log out, effectively revoking the token and rendering the hacker's token useless.

**2.2 Role-Based and Permission-Based Access Control**

- **Hybrid Access Control Model**:

  - **Role-Based Access Control (RBAC)**: Users are assigned roles (e.g., `admin`, `user`, `viewer`) that determine default permissions.
  - **Permission-Based Access Control (PBAC)**: Specific actions are allowed or denied based on permissions granted directly or via roles.
  - Extended to include context-sensitive attributes for fine-grained control.

* **Permission Format**:
  - `service:action:action:context:resource`
  - Examples:
    - `userservice:list:any:user`
    - `userservice:list:{appId:<appId>}:user`

#### **2.3 Multi-Tenancy**

- **Application-Level Scoping**:
  - Each user is associated with an application (`appId`) that determines their tenant context. For example, a user signing up for a webshop and a SaaS product would have separate user accounts, each tied to the respective application's `appId`, ensuring isolation and proper credential usage. When logging in, users must use the credentials they originally provided during signup for the specific application.

#### **2.4 Audit and Security**

- **Token Introspection**:
  - An introspection endpoint allows validation of tokens. This is useful in environments where you want to prevent a user who previously had correct permissions from continuing an action after their role has been revoked. Additionally, it ensures that revoked tokens, such as those invalidated after logout, cannot be misused. For example, if a hacker obtains a token, they could potentially access user information. To combat this, the legitimate token owner can log out, effectively revoking the token and rendering the hacker's token useless.

#### **2.5 Scalability and Performance**

- **High Availability**:
  - The User Service is designed as a stateless microservice to enable seamless scalability. Statelessness ensures that each instance of the service can independently handle authentication and token validation, allowing the system to scale horizontally to accommodate increased request loads. This architecture supports high availability and performance, making it suitable for handling millions of active users efficiently.

### **2.6 Device Tracking and Management**

- **Device Tracking**:
  - On each request, the system tracks the device making the request by capturing metadata such as device ID, IP address, user-agent, and any other relevant device-specific information.
  - This device metadata is then linked to the user’s active session, allowing the system to track all devices the user is currently logged into.
- **Device Management**:
  - Users can view a list of all devices currently logged into their account, including details such as device name, IP address, last login time, and location.
  - Users have the ability to log out of any specific device remotely, which will invalidate the session for that device and revoke the associated token.
- **Security**:
  - Device tracking enhances security by enabling users to monitor and manage their active sessions across multiple devices. If suspicious activity is detected (e.g., a login from an unrecognized device), the user can log out of that device to prevent unauthorized access.
