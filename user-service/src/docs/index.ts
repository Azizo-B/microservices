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
 *           example: "507f1f77bcf86cd799439011"
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
 *          example: "507f1f77bcf86cd799439011"
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
 *           example: "507f1f77bcf86cd799439011"
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
 *          example: "507f1f77bcf86cd799439011"
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
 *           example: "507f1f77bcf86cd799439011"
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: "password123"
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