exports.catchAsyncErrors = cbFn => (req, res, next) => cbFn(req, res, next).catch(next);

exports.catch404Errors = (req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
};

exports.showErrorHandler = (err, req, res, next) => {
	const { message, status } = err;
	if (process.env.mode === "prod") {
		return res.status(status || 500).json({ message });
	} else {
		return res.status(status || 500).json({ message, stack: err.stack });
	}
};
