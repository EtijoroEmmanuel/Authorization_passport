const { createCategory, getAll } = require('../controllers/categoryController');
const { authenticate,adminAuth } = require('../middlewares/authentication');

const router = require('express').Router();

/**
 * @swagger
 * paths:
 *   /category:
 *     post:
 *       summary: Create a new category
 *       description: Create a category with a name and amenities, accessible only to admins.
 *       tags:
 *         - Category
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the category
 *                   example: "Luxury Suite"
 *                 amenities:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of amenities available in this category
 *                   example: ["WiFi", "Air Conditioning", "Swimming Pool"]
 *       responses:
 *         201:
 *           description: Category created successfully
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
 *           description: User not found
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

router.post('/category', authenticate, adminAuth, createCategory);

/**
 * @swagger
 * paths:
 *   /category:
 *     get:
 *       summary: Retrieve all categories
 *       description: Fetch all categories along with associated rooms.
 *       tags:
 *         - Category
 *       responses:
 *         200:
 *           description: List of all categories
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d21b4667d0d8992e610c85"
 *                         name:
 *                           type: string
 *                           example: "Luxury Suite"
 *                         amenities:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["WiFi", "Air Conditioning", "Swimming Pool"]
 *                         rooms:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               roomName:
 *                                 type: string
 *                                 example: "Deluxe Room"
 *                               price:
 *                                 type: number
 *                                 format: float
 *                                 example: 200.00
 *                               description:
 *                                 type: string
 *                                 example: "A spacious room with modern amenities."
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
router.get('/category', getAll)

module.exports = router