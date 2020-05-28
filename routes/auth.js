const express = require('express');
// const { body } = require('express-validator/check');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);


router.post('/register', authController.signup);   // register admin
router.post('/login', authController.login);    // login admin
router.post('/register-annotator', authController.signupAnnotator) // register annotator
router.post('/login-annotator', authController.loginAnnotator) // login annotator


module.exports = router;
