const mongoose = require("mongoose");

const Speakerschema = new mongoose.Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	full_name: { type: String, required: true },
	role: { type: String, enum: ["Speaker", "Instructor"], required: true },
	image: { type: String, required: true },
	address: {
		city: { type: String, required: true },
		street: { type: String, required: true },
		building: { type: Number, required: true },
	},
});

module.exports = mongoose.model("speakers", Speakerschema);
