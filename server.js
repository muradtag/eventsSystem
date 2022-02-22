require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

//Routers
const authRouter = require("./Routers/authenticationRouter");
const speakerRouter = require("./Routers/speakerRouter");
const studentsRouter = require("./Routers/studentsRouter");
const eventsRouter = require("./Routers/eventsRouter");

//Create Server
const app = express();

//Connect to Database
mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		console.log("DB Connected...");

		//Listen to server on PORT 8080
		app.listen(process.env.PORT, () => {
			console.log(
				"eventsSystem server running on port " + process.env.PORT + "..."
			);
		});
	})
	.catch((error) => {
		console.log("DB failed to connect");
	});

//Logger Middleware
app.use(morgan(":method :url"));

//Cross-origin Middleware
app.use(cors());

// Image Variables
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "Images"));
	},
	filename: (req, file, cb) => {
		cb(
			null,
			new Date().toLocaleDateString().replace(/\//g, "-") +
				"-" +
				file.originalname
		);
	},
});

let fileFilter = (req, file, cb) => {
	if (
		file.mimetype == "image/jpeg" ||
		file.mimetype == "image/jpg" ||
		file.mimetype == "image/png"
	)
		cb(null, true);
	else cb(null, false);
};

// Image Handling
app.use("/Images", express.static(path.join(__dirname, "Images")));
app.use(multer({ storage, fileFilter }).single("image"));

//Body Parsing
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

//Routers
// Authentication Router --login --register
app.use(authRouter);
//Speakers Router
app.use(speakerRouter);
//Students Router
app.use(studentsRouter);
//Events Router
app.use(eventsRouter);

//404 Not Found URL Middleware
app.use((request, response) => {
	response.status(404).json({ data: "Not Found" });
});

//Error Catching Middleware
app.use((error, request, response, next) => {
	let status = error.status || 500;
	response.status(status).json({ Error: error + "" });
});
