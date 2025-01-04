/**
 * @swagger
 * tags:
 *   - name: User
 *   - name: Token
 *   - name: Application
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the token.
 *           example: "507f1f77bcf86cd799439011"
 *         appId:
 *           type: string
 *           description: The application ID.
 *           example: "6776f66b36f367b1e0f02bd3"
 *         deviceId:
 *           type: string
 *           description: The device ID.
 *           example: "507f1f77bcf86cd799439011"
 *         type:
 *           type: string
 *           description: The type of the token.
 *           example: "session"
 *         token:
 *           type: string
 *           description: The token string.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: The expiration date of the token.
 *           example: "2023-12-01T12:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the token.
 *           example: "2023-10-01T12:00:00Z"
 *         revokedAt:
 *           type: string
 *           format: date-time
 *           description: The revocation date of the token.
 *           example: "2023-11-01T12:00:00Z"
 *       required:
 *         - id
 *         - userId
 *         - type
 *         - token
 *         - expiresAt
 *         - createdAt
 *     TokenWithStatus:
 *       allOf:
 *         - $ref: '#/components/schemas/Token'
 *         - type: object
 *           properties:
 *             isValid:
 *               type: boolean
 *               description: The validity status of the token.
 *               example: true
 *     CreateTokenInput:
 *       type: object
 *       properties:
 *         appId:
 *          type: string
 *          description: The application ID.
 *          example: "6776f66b36f367b1e0f02bd3"
 *         type:
 *          type: string
 *          description: The type of the token.
 *          example: "session"
 *       required:
 *         - appId
 *         - type
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the application.
 *           example: "6776f66b36f367b1e0f02bd3"
 *         name:
 *           type: string
 *           description: The name of the application.
 *           example: "My Application"
 *       required:
 *         - id
 *         - name
 *     CreateApplicationInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the application.
 *           example: "My Application"
 *       required:
 *         - name
 *     UpdateApplicationInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the application.
 *           example: "My Application"
 *       required:
 *         - name
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the user.
 *           example: "507f1f77bcf86cd799439011"
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: "user@example.com"
 *         isVerified:
 *           type: boolean
 *           description: Whether the user's email is verified.
 *           example: false
 *         profile:
 *           type: object
 *           description: The user's profile information.
 *           example: {}
 *       required:
 *         - id
 *         - email
 *         - isVerified
 *         - profile
 *     UserSignupInput:
 *       type: object
 *       properties:
 *         appId:
 *          type: string
 *          description: The application ID.
 *          example: "6776f66b36f367b1e0f02bd3"
 *         username:
 *          type: string
 *          description: The user's username.
 *          example: "user123"
 *         email:
 *          type: string
 *          description: The user's email address.
 *          example: "user@example.com"
 *         password:
 *          type: string
 *          description: The user's password.
 *          example: "password123"
 *       required:
 *         - appId
 *         - email
 *         - password
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the device
 *           example: "60c72b2f9b1d8e001f8c56a7"
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the device
 *           example: "60c72b2f9b1d8e001f8c56a6"
 *         userAgent:
 *           type: string
 *           description: The user agent string for the device
 *           example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
 *         deviceType:
 *           type: string
 *           description: The type of device (e.g., mobile, desktop)
 *           example: "desktop"
 *         ipAddress:
 *           type: string
 *           description: The IP address of the device
 *           example: "192.168.1.1"
 *         browser:
 *           type: string
 *           description: The browser used on the device
 *           example: "Chrome"
 *         browserVersion:
 *           type: string
 *           description: The version of the browser
 *           example: "91.0.4472.124"
 *         os:
 *           type: string
 *           description: The operating system of the device
 *           example: "Windows 10"
 *         osVersion:
 *           type: string
 *           description: The version of the operating system
 *           example: "10.0.19042"
 *         deviceVendor:
 *           type: string
 *           description: The vendor of the device
 *           example: "Dell"
 *         deviceModel:
 *           type: string
 *           description: The model of the device
 *           example: "XPS 13"
 *         engine:
 *           type: string
 *           description: The rendering engine of the browser
 *           example: "Blink"
 *         engineVersion:
 *           type: string
 *           description: The version of the rendering engine
 *           example: "91.0.4472.124"
 *         cpuArchitecture:
 *           type: string
 *           description: The CPU architecture of the device
 *           example: "x64"
 *         city:
 *           type: string
 *           description: The city where the device is located
 *           example: "New York"
 *         country:
 *           type: string
 *           description: The country where the device is located
 *           example: "USA"
 *         region:
 *           type: string
 *           description: The region where the device is located
 *           example: "NY"
 *         language:
 *           type: string
 *           description: The language set on the device
 *           example: "en-US"
 *         referer:
 *           type: string
 *           description: The referer URL
 *           example: "https://example.com"
 *         isSecure:
 *           type: boolean
 *           description: Whether the connection is secure (HTTPS)
 *           example: true
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the device was registered
 *           example: "2025-01-04T12:34:56Z"
 *         deviceInfo:
 *           type: string
 *           description: Additional device information
 *           example: "Dell XPS 13, 16GB RAM, 512GB SSD"
 *     
 *     DeviceAndIps:
 *       allOf:
 *         - $ref: '#/components/schemas/Device'
 *         - type: object
 *           properties:
 *             ips:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of IP addresses associated with the device
 *               example: ["192.168.1.1", "192.168.1.2"]
 * 
 *     BasicDeviceInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the device.
 *           example: "507f1f77bcf86cd799439011"
 *         userAgent:
 *           type: string
 *           description: The user agent string of the device.
 *           example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
 *         deviceType:
 *           type: string
 *           description: The type of the device.
 *           example: "desktop"
 *         os:
 *           type: string
 *           description: The operating system of the device.
 *           example: "Windows"
 *         osVersion:
 *           type: string
 *           description: The version of the operating system.
 *           example: "10.0"
 *         browser:
 *           type: string
 *           description: The browser used on the device.
 *           example: "Chrome"
 *         browserVersion:
 *           type: string
 *           description: The version of the browser.
 *           example: "58.0.3029.110"
 *         ipAdresses:
 *           type: array
 *           items:
 *             type: string
 *           description: The IP addresses associated with the device.
 *           example: ["192.168.1.1", "192.168.1.2"]
 *       required:
 *         - id
 *         - userAgent
 *         - deviceType
 *         - os
 *         - osVersion
 *         - browser
 *         - browserVersion
 *         - ipAdresses
 *     UserAccount:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the user account.
 *           example: "507f1f77bcf86cd799439011"
 *         appId:
 *           type: string
 *           description: The application ID.
 *           example: "6776f66b36f367b1e0f02bd3"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the user account.
 *           example: "2023-10-01T12:00:00Z"
 *         status:
 *           type: string
 *           description: The status of the user account.
 *           example: "active"
 *     GetUserByIdResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the user.
 *           example: "507f1f77bcf86cd799439011"
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: "user@example.com"
 *         profile:
 *           type: object
 *           description: The user's profile information.
 *           example: {}
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: The roles assigned to the user.
 *           example: ["admin", "user"]
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: The permissions granted to the user.
 *           example: ["userservice:read:any:user", "userservice:list:any:user"]
 *         userAccounts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserAccount'
 *         devices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BasicDeviceInfo'
 *     EntityId:
 *       type: string
 *       description: The unique identifier for an entity
 *       example: "507f1f77bcf86cd799439011"
 *       required: true
 *     UserLoginInput:
 *       type: object
 *       properties:
 *         appId:
 *           type: string
 *           description: The application ID.
 *           example: "6776f66b36f367b1e0f02bd3"
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: "admin@localhost.com"
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: "admin"
 *       required:
 *         - appId
 *         - email
 *         - password
 *     CreateRoleInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the role.
 *         description:
 *           type: string
 *           nullable: true
 *           description: A description of the role (optional).
 *       required:
 *         - name
 *     UpdateRoleInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the role.
 *         description:
 *           type: string
 *           nullable: true
 *           description: A description of the role (optional).
 *     CreatePermissionInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the permission.
 *           example: "view:dashboard"
 *         description:
 *           type: string
 *           description: A description of the permission.
 *           example: "Permission to view the dashboard."
 *           required:
 *           - name
 *     UpdatePermissionInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the permission.
 *           example: "edit:dashboard"
 *         description:
 *           type: string
 *           description: A description of the permission.
 *           example: "Permission to edit the dashboard."
 *       required:
 *         - name
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the permission.
 *           example: "60c72b2f9b1e8f1f4e0d1e9d"
 *         name:
 *           type: string
 *           description: The name of the permission.
 *           example: "view:dashboard"
 *         description:
 *           type: string
 *           description: A description of the permission.
 *           example: "Permission to view the dashboard."
 *       required:
 *         - id
 *         - name
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the role.
 *           example: "60c72b2f9b1e8f1f4e0d1e9d"
 *         name:
 *           type: string
 *           description: The name of the role.
 *           example: "admin"
 *         description:
 *           type: string
 *           description: A description of the role.
 *           example: "Administrator role with full access."
 *       required:
 *         - id
 *         - name
 *     RoleWithPermissions:
 *       allOf:
 *         - $ref: '#/components/schemas/Role'
 *         - type: object
 *           properties:
 *             permissions:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of permissions assigned to the role.
 *               example:
 *                 - "view:dashboard"
 *                 - "edit:settings"
 *                 - "delete:user"
 *           required:
 *             - permissions
 *   responses:
 *     BadRequest:
 *       description: Bad request
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "VALIDATION_FAILED"
 *               message:
 *                 type: string
 *                 example: "Invalid request parameters"
 *               details:
 *                 type: string
 *               stack:
 *                 type: string
 *                 example: "Error stack trace"
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "UNAUTHORIZED"
 *               message:
 *                 type: string
 *                 example: "Authentication required"
 *               details:
 *                 type: string
 *               stack:
 *                 type: string
 *                 example: "Error stack trace"
 *     Forbidden:
 *       description: Forbidden
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "Forbidden"
 *               message:
 *                 type: string
 *                 example: "Admin role required"
 *               details:
 *                 type: string
 *               stack:
 *                 type: string
 *                 example: "Error stack trace"
 *     NotFound:
 *       description: Token not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "NOT_FOUND"
 *               message:
 *                 type: string
 *                 example: "Token not found"
 *               details:
 *                 type: string
 *               stack:
 *                 type: string
 *                 example: "Error stack trace"
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "INTERNAL_SERVER_ERROR"
 *               message:
 *                 type: string
 *                 example: "An unexpected error occurred"
 *               details:
 *                 type: string
 *               stack:
 *                 type: string
 *                 example: "Error stack trace"
 */