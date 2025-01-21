/**
 * @swagger
 * tags:
 *   - name: Sender
 *   - name: Notification
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *          This authentication scheme uses JSON Web Tokens (JWT).
 *          Clients must include a valid JWT in the `Authorization` header
 *          of their requests using the format: `Authorization: Bearer <token>`.
 *   schemas:
 *     EntityId:
 *       type: string
 *       description: The unique identifier for an entity
 *       example: "507f1f77bcf86cd799439011"
 *       required: true
 *
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
