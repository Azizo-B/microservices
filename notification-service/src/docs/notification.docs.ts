/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       description: Represents a notification in the notification service.
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the notification
 *         senderId:
 *           type: string
 *           description: ID of the sender responsible for the notification
 *         userId:
 *           type: string
 *           description: ID of the user who receives the notification
 *         type:
 *           type: string
 *           description: Type of notification (e.g., email, sms, etc.)
 *         subject:
 *           type: string
 *           description: Subject of the notification
 *         body:
 *           type: string
 *           description: Body content of the notification
 *         recipient:
 *           type: string
 *           description: The recipient of the notification
 *         status:
 *           type: string
 *           description: The status of the notification (e.g., PENDING, SENT)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the notification was created
 *         sentAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the notification was sent
 *       required:
 *         - type
 *         - subject
 *         - body
 *         - recipient
 *         - senderId
 *         - userId
 *         - status
 *         - createdAt
 *
 *     CreateNotificationInput:
 *       type: object
 *       description: Input data to create a new notification.
 *       properties:
 *         type:
 *           type: string
 *           description: Type of notification (e.g., email, sms, etc.)
 *         subject:
 *           type: string
 *           description: Subject of the notification
 *         body:
 *           type: string
 *           description: Body content of the notification
 *         recipient:
 *           type: string
 *           description: The recipient of the notification
 *         senderId:
 *           type: string
 *           description: ID of the sender responsible for the notification
 *       required:
 *         - type
 *         - subject
 *         - body
 *         - recipient
 *         - senderId
 *
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Creates a new notification
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new notification with the provided data.
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationInput'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Retrieves all notifications
 *     security:
 *       - bearerAuth: []
 *     description: Fetches all notifications available for the user.
 *     tags:
 *       - Notification
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
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Retrieves a notification by ID
 *     security:
 *       - bearerAuth: []
 *     description: Fetches a notification associated with the provided notification ID.
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the notification to retrieve
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
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
 * /api/notifications/{id}:
 *   delete:
 *     summary: Deletes a notification
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a notification associated with the provided notification ID.
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the notification to delete
 *     responses:
 *       204:
 *         description: Notification deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
