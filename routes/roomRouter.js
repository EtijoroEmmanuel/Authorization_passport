const { createRoom, deleteRoomImage, updateRoomImage } = require('../controllers/roomcontroller');

const upload = require('../helper/multer');

const router = require('express').Router();

/**
 * @swagger
 * paths:
 *   /room/{id}:
 *     post:
 *       summary: Create a new room in a category
 *       description: Upload images and create a new room under a specific category.
 *       tags:
 *         - Room
 *       security: []  # No authentication required
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the category to which the room belongs.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 roomName:
 *                   type: string
 *                   description: Name of the room
 *                   example: "Deluxe Suite"
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: Price of the room
 *                   example: 150.00
 *                 roomNumber:
 *                   type: string
 *                   description: Unique room number
 *                   example: "101A"
 *                 description:
 *                   type: string
 *                   description: Description of the room
 *                   example: "A luxurious suite with ocean view."
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *                   description: Images of the room (max 10 files)
 *       responses:
 *         200:
 *           description: Room added successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       category:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c84"
 *                       roomName:
 *                         type: string
 *                         example: "Deluxe Suite"
 *                       roomNumber:
 *                         type: string
 *                         example: "101A"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *                       description:
 *                         type: string
 *                         example: "A luxurious suite with ocean view."
 *                       images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             imageUrl:
 *                               type: string
 *                               example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *                             imageId:
 *                               type: string
 *                               example: "sample_image_id"
 *         404:
 *           description: Category not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */

router.post('/room/:id', upload.array('images', 10), createRoom);

/**
 * @swagger
 * paths:
 *   /room/{id}/{imageId}:
 *     delete:
 *       summary: Delete a specific image from a room
 *       description: Remove an image from a room and delete it from Cloudinary.
 *       tags:
 *         - Room
 *       security: []  # No authentication required
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the room.
 *         - in: path
 *           name: imageId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the image to be deleted.
 *       responses:
 *         200:
 *           description: Room image deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: object
 *         404:
 *           description: Room or image not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */


router.delete('/room/:id/:imageId', deleteRoomImage);

/**
 * @swagger
 * paths:
 *   /roomthesecond/{id}/{imageId}:
 *     patch:
 *       summary: Update a specific image in a room
 *       description: Replace an existing room image with a new one, uploading it to Cloudinary.
 *       tags:
 *         - Room
 *       security: []  # No authentication required
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the room.
 *         - in: path
 *           name: imageId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the image to be updated.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: The new image file to upload.
 *       responses:
 *         200:
 *           description: Image updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: object
 *         400:
 *           description: No image uploaded
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         404:
 *           description: Room or image not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */


router.patch('roomthesecond/:id/:imageId', updateRoomImage)

module.exports = router;