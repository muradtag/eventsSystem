const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Studentschema = new mongoose.Schema(
	{
		_id: Number,
		email: { type: String, required: true },
		password: { type: String, required: true },
		full_name: { type: String, required: true },
	},
	{ _id: false }
);

Studentschema.plugin(AutoIncrement, {
	id: "students_counter",
	inc_field: "_id",
});

module.exports = mongoose.model("students", Studentschema);
