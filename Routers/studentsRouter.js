const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../Controllers/studentsController");
const isAuthenticated = require("../Middleware/authenticationMW");
const { authAdmin, authStudent } = require("../Middleware/authorizationMW");

//Create Router
const studentsRouter = express.Router();

studentsRouter
	.route("/students")
	.get(isAuthenticated, authAdmin, controller.getStudents)
	.post(
		isAuthenticated,
		authAdmin,
		[
			body("userName")
				.isAlphanumeric()
				.withMessage("user name shoud be string"),
			body("password")
				.isAlphanumeric()
				.withMessage("password should be any char"),
			body("email").isEmail().withMessage("not a valid email"),
		],
		controller.addStudent
	)
	.put(
		isAuthenticated,
		authStudent,
		[
			body("fullName").isString().withMessage("fullName shoud be string"),
			body("id").isInt().withMessage("ID is int"),
		],
		controller.updateStudent
	)
	.delete(
		isAuthenticated,
		authStudent,
		body("id").isInt().withMessage("ID is int"),
		controller.deleteStudent
	);

studentsRouter.get(
	"/students/:id",
	isAuthenticated,
	authStudent,
	param("id").isNumeric().withMessage("ID should be number"),
	controller.getStudentsById
);

module.exports = studentsRouter;
