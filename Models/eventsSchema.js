const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Eventschema = new mongoose.Schema({
	_id: Number,
	title: { type: String, required: true },
	date: { type: Date, required: true },
	main_speaker: {
		type: mongoose.Types.ObjectId,
		ref: "speakers",
		required: true,
	},
	speakers: { type: [mongoose.Types.ObjectId], ref: "speakers" },
	students: { type: [Number], ref: "students", required: true },
});

Eventschema.plugin(AutoIncrement, { id: "events_counter", inc_field: "_id" });

module.exports = mongoose.model("events", Eventschema);
