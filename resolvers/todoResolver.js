const mongoose = require("mongoose");
const ToDo = mongoose.model("ToDo");
const User = mongoose.model("User");

// handler
const { catchAsyncErrors } = require("../handlers/errorHandler");

// helper
const getUser = async id => {
	const user = await User.findOne({ _id: id });
	return {
		...user._doc,
		password: null
	};
};

exports.addTask = async args => {
	if (!req.userId) throw new Error("Please login...");

	const { task } = args.payload;
	if (task.trim().length === 0) {
		throw new Error("Please enter task");
	}
	return await new ToDo({ task, user: req.userId }).save();
};

exports.getTasks = async args => {
	if (!req.userId) throw new Error("Please login...");

	const { status } = args;
	const tasks = await ToDo.find({ status: status || "none", user: req.userId });
	return tasks.map(task => {
		return {
			...task._doc,
			user: catchAsyncErrors(getUser.bind(this, task.user))
		};
	});
};
