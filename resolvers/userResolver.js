const mongoose = require("mongoose");
const { compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const User = mongoose.model("User");

User.collection.dropIndexes();

const validateUserInput = (email, password) => {
	if (email.trim().length === 0 || password.length === 0) {
		throw new Error("Email and Password fields are required");
	}
};

const userExist = email => User.findOne({ email });

exports.createUser = async args => {
	const { email, password } = args.payload;

	validateUserInput(email, password);

	if (await userExist(email.trim())) {
		throw new Error("User already exist");
	}

	// create user & return
	const user = await new User({ email: email, password: password }).save();
	return {
		...user._doc,
		password: null
	};
};

exports.authUser = async args => {
	const { email, password } = args.payload;

	validateUserInput(email, password);

	const user = await userExist(email, password);

	if (user) {
		if (compareSync(password, user.password)) {
			const token = sign({ email: user.email, id: user._id }, process.env.SECRET, {
				expiresIn: "1h"
			});
			return {
				token
			};
		} else {
			throw new Error("Username & password not matched");
		}
	} else {
		throw new Error("Username & password not matched");
	}
};
