/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Creates a new role
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new role with the specified name and description.
 *     tags:
 *       - Role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleInput'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Retrieves all roles
 *     description: Fetches all roles available in the system.
 *     tags:
 *       - Role
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Retrieves a role by ID
 *     description: Fetches a role associated with the provided role ID.
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleWithPermissions'
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
 * /api/roles/{roleId}:
 *   patch:
 *     summary: Updates a role
 *     security:
 *       - bearerAuth: []
 *     description: Updates an existing role's details, such as name or description.
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the role to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleInput'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
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
 * /api/roles/{roleId}:
 *   delete:
 *     summary: Deletes a role
 *     security:
 *       - bearerAuth: []
 *     description: Deletes the role with the specified ID.
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the role to delete.
 *     responses:
 *       204:
 *         description: Role deleted successfully
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
 * /api/roles/{roleId}/permissions/{permissionId}:
 *   post:
 *     summary: Assigns a permission to a role
 *     security:
 *       - bearerAuth: []
 *     description: Links the specified permission to the role, assigning it to the role.
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the role to which the permission will be assigned.
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the permission to assign to the role.
 *     responses:
 *       200:
 *         description: Permission successfully assigned to the role
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
 * /api/roles/{roleId}/permissions/{permissionId}:
 *   delete:
 *     summary: Removes a permission from a role
 *     security:
 *       - bearerAuth: []
 *     description: Removes the specified permission from the role, unlinking it from the role.
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the role from which the permission will be removed.
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityId'
 *         description: The ID of the permission to remove from the role.
 *     responses:
 *       204:
 *         description: Permission successfully removed from the role
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
