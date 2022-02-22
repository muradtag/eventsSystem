exports.authAdmin = (request, response, next) => {
	if (request.authorization == "admin") {
		next();
	} else {
		throw new Error("Not authorized to do this action");
	}
};

exports.authSpeaker = (request, response, next) => {
	if (request.authorization == "admin" || request.authorization == "speaker") {
		next();
	} else {
		throw new Error("Not authorized to do this action");
	}
};

exports.authStudent = (request, response, next) => {
	if (request.authorization == "admin" || request.authorization == "student") {
		next();
	} else {
		throw new Error("Not authorized to do this action");
	}
};
