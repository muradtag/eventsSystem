const { validationResult } = require("express-validator");
const { handleValErrors } = require("../Helpers/errorHandler");
const Speaker = require("../Models/speakersSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getSpeakers = (request, response, next) => {
	Speaker.find({})
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => next(error));
};

exports.getSpeakersById = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);

	if (request.role == "admin" || request.tokenId == request.params.id) {
		Speaker.findById({ _id: request.params.id })
			.then((data) => {
				if (data == null) throw new Error("Speaker not found");
				response.status(200).json(data);
			})
			.catch((error) => next(error));
	} else {
		throw new Error("Not Authorized");
	}
};

exports.addSpeaker = (request, response, next) => {
	// response.json({ body: request.body, file: request.file });

	let errors = validationResult(request);
	handleValErrors(errors);

	Speaker.findOne({ email: request.body.email })
		.then((data) => {
			if (!(data == null)) throw new Error("Email already registered");
			return bcrypt.hash(request.body.password, saltRounds);
		})
		.then((hash) => {
			let speaker = new Speaker({
				email: request.body.email,
				password: hash,
				full_name: request.body.fullName,
				role: request.body.role,
				image: request.body.image,
				// image: request.file.filename,
				address: {
					city: request.body.city,
					street: request.body.street,
					building: request.body.building,
				},
			});
			return speaker.save();
		})
		.then((data) => {
			response.status(200).json({ message: "Speaker created", data });
		})
		.catch((error) => next(error));
};

exports.updateSpeaker = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);

	if (request.role == "admin" || request.tokenId == request.body.id) {
		Speaker.findById(request.body.id)
			.then((speaker) => {
				if (speaker === null) throw new Error("Speaker Not found");
				speaker.full_name = request.body.fullName;
				speaker.role = request.body.role;
				speaker.image = request.body.image;
				speaker.address.city = request.body.city;
				speaker.address.street = request.body.street;
				speaker.address.building = request.body.building;

				return speaker.save();
			})
			.then((data) => {
				response.status(200).json({ message: "Speaker updated.", data });
			})
			.catch((error) => next(error));
	} else {
		throw new Error("Not Authorized");
	}
};

exports.deleteSpeaker = (request, response) => {
	let errors = validationResult(request);
	handleValErrors(errors);

	if (request.role == "admin" || request.tokenId == request.body.id) {
		Speaker.findByIdAndDelete(request.body.id)
			.then((data) => {
				if (data === null) throw new Error("Speaker Not found");
				response.status(200).json({ data: "Speaker Deleted" });
			})
			.catch((error) => next(error));
	} else {
		throw new Error("Not Authorized");
	}
};
