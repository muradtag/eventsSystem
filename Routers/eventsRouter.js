const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../Controllers/eventsController");
const isAuthenticated = require("../Middleware/authenticationMW");
const { authAdmin } = require("../Middleware/authorizationMW");

//Create Router
const eventsRouter = express.Router();

eventsRouter
	.route("/events")
	.get(isAuthenticated, controller.getEvents)
	.post(
		isAuthenticated,
		authAdmin,
		[
			body("title").isString().withMessage("title : string"),
			body("date").isDate().withMessage("date is not a in date format"),
			body("mainSpeaker").isString().withMessage("mainspeaker : string"),
			body("speakers").isArray().withMessage("speakers : array"),
			body("students").isArray().withMessage("students : array"),
		],
		controller.addEvent
	)
	.put(
		isAuthenticated,
		authAdmin,
		[
			body("title").isString().withMessage("title : string"),
			body("date").isDate().withMessage("date is not a in date format"),
			body("mainSpeaker").isString().withMessage("mainspeaker : string"),
			body("speakers").isArray().withMessage("speakers : array"),
			body("students").isArray().withMessage("students : array"),
		],
		controller.updateEvent
	)
	.delete(
		isAuthenticated,
		authAdmin,
		body("id").isInt().withMessage("id is not an integer"),
		controller.deleteEvent
	);

eventsRouter.get(
	"/events/:id",
	isAuthenticated,
	param("id").isNumeric().withMessage("id is not an integer"),
	controller.getEventById
);

module.exports = eventsRouter;
