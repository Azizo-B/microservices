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