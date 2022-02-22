exports.handleValErrors = function (errors) {
	if (!errors.isEmpty()) {
		let error = new Error();
		error.status = 422;
		error.message = errors.array().reduce((current, object) => {
			return current + object.msg + ", ";
		}, "");
		throw error;
	}
};
