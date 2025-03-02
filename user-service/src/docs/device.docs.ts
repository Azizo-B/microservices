/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Retrieves all devices
 *     description: Fetches all devices associated with the authenticated user.
 *     tags:
 *       - Device
 *     security:
 *       - bearerAuth: []
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
 *         description: Devices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Device'
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
 * /api/devices/{id}:
 *   get:
 *     summary: Retrieves a device by ID
 *     description: Fetches a device associated with the provided device ID and the authenticated user.
 *     tags:
 *       - Device
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the device to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Device retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceAndIps'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
