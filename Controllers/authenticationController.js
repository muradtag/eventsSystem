const { validationResult } = require("express-validator");
const Student = require("../Models/studentsSchema");
const Speaker = require("../Models/speakersSchema");
const { addStudent } = require("./studentsController");
const { addSpeaker } = require("./speakerController");
const { handleValErrors } = require("../Helpers/errorHandler");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

//Login
exports.checkUser = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);
	if (request.body.isSpeaker) {
		Speaker.findOne({ email: request.body.email })
			.then((data) => {
				if (data == null) throw new Error("Speaker not found");
				else {
					bcrypt
						.compare(request.body.password, data.password)
						.then((passConfirm) => {
							if (passConfirm) {
								let token = jwt.sign(
									{
										email: data.email,
										id: data._id,
										role: data.email == "admin@admin.com" ? "admin" : "speaker",
									},
									process.env.TOKEN_SECRET_KEY,
									{ expiresIn: "1h" }
								);
								response.status(200).json({ id: data._id, token });
							} else {
								response.status(200).json({ data: "Wrong Password" });
							}
						})
						.catch((error) => next(error));
				}
			})
			.catch((error) => next(error));
	} else {
		Student.findOne({ email: request.body.email })
			.then((data) => {
				if (data == null) throw new Error("Student not found");
				else {
					bcrypt
						.compare(request.body.password, data.password)
						.then((passConfirm) => {
							if (passConfirm) {
								// response.status(200).json({ data: "Student authorized" });
								let token = jwt.sign(
									{
										email: data.email,
										id: data._id,
										role: "student",
									},
									process.env.TOKEN_SECRET_KEY,
									{ expiresIn: "1h" }
								);
								response.status(200).json({ data: data._id, token });
							} else response.status(200).json({ data: "Wrong Password" });
						})
						.catch((error) => next(error));
				}
			})
			.catch((error) => next(error));
	}
};

//Register
exports.createUser = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);
	if (request.body.isSpeaker) {
		// new Speaker
		addSpeaker(request, response, next);
	} else {
		// new Student
		addStudent(request, response, next);
	}
};

//Change Password
exports.changePassword = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);

	if (request.authorization == "admin" || request.tokenId == request.body.id) {
		// response.json({ data: request.body.id });
		Student.findById(isNaN(request.body.id) ? null : request.body.id)
			.then((data) => {
				if (data == null) return Speaker.findById(request.body.id);
				else return data;
			})
			.then((data) => {
				if (data == null) throw new Error("User not found");
				else return data;
			})
			.then((data) => {
				// response.json({ data });
				bcrypt
					.compare(request.body.oldPassword, data.password)
					.then((passConfirm) => {
						if (passConfirm) {
							return bcrypt.hash(request.body.newPassword, saltRounds);
						} else {
							throw new Error("Wrong old password");
						}
					})
					.then((newHash) => {
						data.password = newHash;
						return data.save();
					})
					.then(() => {
						response.status(200).json({ data: "Password Changed Succesfully" });
					})
					.catch((error) => next(error));
			})
			.catch((error) => next(error));
	}
};

//when registering a new user, should i check both student and speaker for duplicate emails??
