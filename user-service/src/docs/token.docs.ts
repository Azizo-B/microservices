/**
 * @swagger
 * /api/tokens/sessions:
 *   post:
 *     summary: Logs in a user
 *     description: Authenticates a user and returns a token.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       201:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/tokens:
 *   post:
 *     summary: Creates a new token
 *     description: Generates a new token for verification or password reset.
 *     tags:
 *       - Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTokenInput'
 *     responses:
 *       201:
 *         description: Token created successfully, see user inbox
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/tokens:
 *   get:
 *     summary: Retrieves all tokens for a user
 *     security:
 *       - bearerAuth: []
 *     description: Fetches all tokens associated with the authenticated user.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: The page number for paginated results. Defaults to `1`.
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: The number of items to return per page. Defaults to `10`.
 *         required: false
 *       - in: query
 *         name: appId
 *         schema:
 *           type: string
 *         description: Filters tokens by their application ID.
 *         required: false
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: string
 *         description: Filters tokens by their device ID.
 *         required: false
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [session, reset_password, email_verification]
 *         description: Filters tokens by their type.
 *         required: false
 *     responses:
 *       200:
 *         description: Tokens retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Token'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/tokens/{id}:
 *   get:
 *     summary: Retrieves a token by ID
 *     security:
 *       - bearerAuth: []
 *     description: Fetches a token associated with the provided token ID and the authenticated user.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the token to retrieve
 *     responses:
 *       200:
 *         description: Token retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenWithStatus'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
*/

/**
 * @swagger
 * /api/tokens/introspect:
 *   get:
 *     summary: Check the validity of a token
 *     description: Checks the validity and if it has expired, been revoked etc.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           description: The token to validate
 *     responses:
 *       204:
 *         description: Token is valid
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/tokens/{id}:
 *   delete:
 *     summary: Deletes a token
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a token associated with the provided user ID and token ID.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the token to delete
 *     responses:
 *       204:
 *         description: Token deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */