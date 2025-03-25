const { register, verifyUser, login, getAll, makeAdmin, resendVerificationEmail } = require('../controllers/usercontroller');
const { authenticate, superAdminAuth } = require('../middlewares/authentication');
const { registerValidation } = require('../middlewares/validator');
const passport = require('passport');
const jwt = require('jsonwebtoken')

const router = require('express').Router();


/**
 * @swagger
 * info:
 *   title: User Registration API
 *   description: API for user registration in AI Podcast
 *   version: 1.0.0
 * paths:
 *   /users:
 *     post:
 *       summary: Register a new user
 *       description: Creates a new user account and sends a verification email.
 *       tags:
 *         - User
 *       security: []  # No authentication required
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - fullName
 *                 - email
 *                 - password
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "johndoe@example.com"
 *                 password:
 *                   type: string
 *                   format: password
 *                   example: "StrongPassword123"
 *       responses:
 *         "200":
 *           description: User registered successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User registered successfully"
 *                   data:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109ca"
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *         "400":
 *           description: Email already in use
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Email: johndoe@example.com already in use"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */

router.post('/users', registerValidation, register);

// router.get('/verify-user/:token', verifyUser);

/**
 * @swagger
 * paths:
 *   /login:
 *     post:
 *       summary: User Login
 *       description: Authenticates a user and returns a token.
 *       tags:
 *         - User
 *       security: []  # No authentication required
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "johndoe@example.com"
 *                 password:
 *                   type: string
 *                   format: password
 *                   example: "StrongPassword123"
 *       responses:
 *         "200":
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Login successful"
 *                   data:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109ca"
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                   token:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         "400":
 *           description: Invalid credentials
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Invalid Password"
 *         "404":
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */
router.post('/login', login);

/**
 * @swagger
 * paths:
 *   /users:
 *     get:
 *       summary: Get all users
 *       description: Retrieves a list of all registered users.
 *       tags:
 *         - User
 *       responses:
 *         "200":
 *           description: A list of users
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "All user's in the database"
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109ca"
 *                         fullName:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "johndoe@example.com"
 *         "500":
 *           description: Internal Server Error
 */

router.get('/users', authenticate, getAll);

router.patch('/make-admin/:id', authenticate, superAdminAuth, makeAdmin);

router.get('/google-authenticate', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/login', passport.authenticate('google'), async (req, res) => {
console.log('Req User: ', req.user)
const token = await jwt.sign({userId: req.user._id, isVerified: req.user.isVerified}, process.env.SECRET, {expiresIn:
    '1day'});
    res.status(200).json({
        message: "Google Auth login Successful",
        data: req.user,
        token
    });
})


 /**
 * @swagger
 * paths:
 *   /resend-verification:
 *     post:
 *       summary: Verify/Resend verification email
 *       description: Sends a new verification email if the user is not yet verified.
 *       tags:
 *         - User
 *       
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "johndoe@example.com"
 *       responses:
 *         "200":
 *           description: Verification email sent successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "New verification link sent please check your email"
 *         "400":
 *           description: Bad request (e.g., user not found or already verified)
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User has already been verified, proceed to login"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */

router.post('/resend-verification', resendVerificationEmail);


module.exports = router
