const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../Controllers/speakerController");
const isAuthenticated = require("../Middleware/authenticationMW");
const { authAdmin, authSpeaker } = require("../Middleware/authorizationMW");

//Create Router
const speakerRouter = express.Router();

speakerRouter
	.route("/speaker")
	.get(isAuthenticated, authAdmin, controller.getSpeakers)
	.post(
		isAuthenticated,
		authAdmin,
		[
			body("fullName").isString().withMessage("user name : string"),
			body("password")
				.isStrongPassword()
				.withMessage("user password : any char"),
			body("email").isEmail().withMessage("user mail : valid email"),
			body("city").isString().withMessage("city : string"),
			body("street").isString().withMessage("street : string"),
			body("building").isInt().withMessage("building : int"),
			body("role").isString().withMessage("role : string"),
			body("image").isString().withMessage("user image : string"),
		],
		controller.addSpeaker
	)
	.put(
		isAuthenticated,
		authSpeaker,
		[
			body("fullName").isString().withMessage("user name : string"),
			body("city").isString().withMessage("city : string"),
			body("street").isString().withMessage("street : string"),
			body("building").isInt().withMessage("building : int"),
			body("role").isString().withMessage("role : string"),
			body("image").isString().withMessage("user image : string"),
		],
		controller.updateSpeaker
	)
	.delete(
		isAuthenticated,
		authSpeaker,
		body("id").isInt().withMessage("ID is int"),
		controller.deleteSpeaker
	);

speakerRouter.get(
	"/speaker/:id",
	isAuthenticated,
	authSpeaker,
	param("id").isString().withMessage("id should be srting"),
	controller.getSpeakersById
);

module.exports = speakerRouter;
