/**
 * @swagger
 * components:
 *   schemas:
 *     Credentials:
 *       type: object
 *       description: Base credentials type for senders.
 *
 *     EmailCredentials:
 *       type: object
 *       description: Credentials specific to Email senders.
 *       allOf:
 *         - $ref: '#/components/schemas/Credentials'
 *         - type: object
 *           properties:
 *             smtpHost:
 *               type: string
 *               description: SMTP server hostname
 *             smtpPort:
 *               type: integer
 *               description: SMTP server port (typically 465 for secure, 25 for insecure)
 *             email:
 *               type: string
 *               description: Email address used to send messages
 *             password:
 *               type: string
 *               description: Email account password (sensitive data)
 *           required:
 *             - smtpHost
 *             - smtpPort
 *             - email
 *             - password
 *
 *     Sender:
 *       type: object
 *       description: Represents a sender in the notification service.
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the sender
 *         type:
 *           type: string
 *           description: The type of the sender (e.g., email, sms, etc.)
 *         credentials:
 *           oneOf:
 *             - $ref: '#/components/schemas/EmailCredentials'
 *           description: The credentials needed to send notifications using this sender.
 *       required:
 *         - name
 *         - type
 *         - credentials
 *
 *     CreateSenderInput:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/Sender'
 *       description: Input data to create a new sender.
 *       required:
 *         - name
 *         - type
 *         - credentials
 *
 *     UpdateSenderInput:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/Sender'
 *       description: Input data to update an existing sender.
 *       required:
 *         - name
 *         - type
 *         - credentials
 *
 */

/**
 * @swagger
 * /api/senders:
 *   post:
 *     summary: Creates a new sender
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new sender with the provided data.
 *     tags:
 *       - Sender
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSenderInput'
 *     responses:
 *       201:
 *         description: Sender created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sender'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/senders:
 *   get:
 *     summary: Retrieves all senders
 *     description: Fetches all senders available in the system.
 *     tags:
 *       - Sender
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
 *     responses:
 *       200:
 *         description: Senders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sender'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/senders/{id}:
 *   get:
 *     summary: Retrieves a sender by ID
 *     description: Fetches a sender associated with the provided sender ID.
 *     tags:
 *       - Sender
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the sender to retrieve
 *     responses:
 *       200:
 *         description: Sender retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sender'
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
 * /api/senders/{id}:
 *   put:
 *     summary: Updates a sender
 *     security:
 *       - bearerAuth: []
 *     description: Updates an existing sender with the provided data.
 *     tags:
 *       - Sender
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the sender to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSenderInput'
 *     responses:
 *       200:
 *         description: Sender updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sender'
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
 * /api/senders/{id}:
 *   delete:
 *     summary: Deletes a sender
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a sender associated with the provided sender ID.
 *     tags:
 *       - Sender
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the sender to delete
 *     responses:
 *       204:
 *         description: Sender deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
