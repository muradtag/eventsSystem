const { validationResult } = require("express-validator");
const { handleValErrors } = require("../Helpers/errorHandler");
const Student = require("../Models/studentsSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getStudents = (request, response, next) => {
	Student.find({})
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};

exports.getStudentsById = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);

	if (request.role == "admin" || request.tokenId == request.params.id) {
		Student.findById({ _id: parseInt(request.params.id) })
			.then((data) => {
				if (data == null) throw new Error("Student not found");
				response.status(200).json(data);
			})
			.catch((error) => {
				next(error);
			});
	} else {
		throw new Error("Not Authorized");
	}
};

exports.addStudent = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);
	Student.findOne({ email: request.body.email })
		.then((data) => {
			if (!(data == null)) throw new Error("Email already registered");
			return bcrypt.hash(request.body.password, saltRounds);
		})
		.then((hash) => {
			let student = new Student({
				email: request.body.email,
				password: hash,
				full_name: request.body.fullName,
			});
			return student.save();
		})
		.then((data) => {
			response.status(200).json({ message: "Student added", data });
		})
		.catch((error) => next(error));
};

exports.updateStudent = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);
	if (request.role == "admin" || request.tokenId == request.body.id) {
		Student.findById(request.body.id)
			.then((student) => {
				if (student === null) throw new Error("Student Not found");
				student.full_name = request.body.fullName;
				return student.save();
			})
			.then((data) => {
				response.status(200).json({ message: "Student updated.", data });
			})
			.catch((error) => next(error));
	} else {
		throw new Error("Not Authorized");
	}
};

exports.deleteStudent = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);

	if (request.role == "admin" || request.tokenId == request.body.id) {
		Student.findByIdAndDelete(request.body.id)
			.then((data) => {
				if (data === null) throw new Error("Student Not found");
				response.status(200).json({ data: "Student Deleted" });
			})
			.catch((error) => next(error));
	} else {
		throw new Error("Not Authorized");
	}
};
