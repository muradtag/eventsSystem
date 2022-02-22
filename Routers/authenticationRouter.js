const express = require("express");
const { body } = require("express-validator");
const controller = require("../Controllers/authenticationController");
const isAuthenticated = require("../Middleware/authenticationMW");

//Create Router
const router = express.Router();

//Login Router
router.post(
	"/login",
	[
		body("isSpeaker").isBoolean().withMessage("isSpeaker not boolean"),
		body("email").isEmail().withMessage("not valid email"),
		body("password")
			.isStrongPassword()
			.withMessage("password validation error"),
	],
	controller.checkUser
);

//Register Router
router.post(
	"/register",
	[
		body("isSpeaker").isBoolean().withMessage("isSpeaker should be boolean"),
		body("fullName")
			.isString()
			.isLength({ max: 25 })
			.withMessage("fullname should be string"),
		body("email").isEmail().withMessage("not a valid email"),
		body("password")
			.isStrongPassword()
			.withMessage("password should be strong"),
		body("confirmPassword")
			.exists()
			.custom((val, { req }) => val == req.body.password)
			.withMessage("Password does not match"),
		body("city")
			.if((val, { req }) => req.body.isSpeaker)
			.isLength({ max: 25 })
			.isString()
			.withMessage("city validation error"),
		body("street")
			.if((val, { req }) => req.body.isSpeaker)
			.isLength({ max: 25 })
			.isString()
			.withMessage("street is not string"),
		body("building")
			.if((val, { req }) => req.body.isSpeaker)
			.isInt()
			.withMessage("building is not int"),
	],
	controller.createUser
);

router.post(
	"/change_password",
	isAuthenticated,
	[
		body("id").isString().withMessage("invalid ID"),
		body("oldPassword").isStrongPassword().withMessage("Invalid Password"),
		body("newPassword").isStrongPassword().withMessage("Invalid new Password"),
		body("confirmPassword")
			.isStrongPassword()
			.custom((val, { req }) => val == req.body.newPassword)
			.withMessage("Password does not match"),
	],
	controller.changePassword
);

module.exports = router;
