const { validationResult } = require("express-validator");
const { handleValErrors } = require("../Helpers/errorHandler");
const Event = require("../Models/eventsSchema");

exports.getEvents = (request, response, next) => {
	Event.find({})
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};

exports.getEventById = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);
	Event.findById({ _id: parseInt(request.params.id) })
		.then((data) => {
			if (data == null) throw new Error("Event not found");
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};

exports.addEvent = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);
	let event = new Event({
		title: request.body.title,
		date: request.body.date,
		main_speaker: request.body.mainSpeaker,
		speakers: request.body.speakers,
		students: request.body.students,
	});
	event
		.save()
		.then((data) => {
			response.status(200).json({ message: "Event created", data });
		})
		.catch((error) => next(error));
	response.status(201).json({ data: "Event added.", BODY: request.body });
};

exports.updateEvent = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);
	Event.findById(request.body.id)
		.then((event) => {
			if (event === null) throw new Error("Event Not found");
			event.title = request.body.title;
			event.date = request.body.date;
			event.main_speaker = request.body.mainSpeaker;
			event.speakers = request.body.speakers;
			event.students = request.body.students;
			return event.save();
		})
		.then((data) => {
			response.status(200).json({ message: "Event updated.", data });
		})
		.catch((error) => next(error));
};

exports.deleteEvent = (request, response, next) => {
	let errors = validationResult(request);
	handleValErrors(errors);
	Event.findByIdAndDelete(request.body.id)
		.then((data) => {
			if (data === null) throw new Error("Event Not found");
			response.status(200).json({ data: "Event Deleted" });
		})
		.catch((error) => next(error));
};
