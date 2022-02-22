const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
	let token, decode;
	try {
		token = request.get("Authorization").split(" ")[1];
		decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
	} catch {
		let error = new Error();
		error.message = "Not Authenticated";
		error.status = 403;
		next(error);
	}
	if (decode !== undefined) {
		// console.log(decode);
		request.authorization = decode.role;
		request.tokenEmail = decode.email;
		request.tokenId = decode.id;
		next();
	}
};
