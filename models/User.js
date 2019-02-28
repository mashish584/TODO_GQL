const mongoose = require("mongoose");
const { hashSync, genSaltSync } = require("bcrypt");
const UserSchema = new mongoose.Schema(
	{
		email: {
			type: "String",
			required: true,
			unique: true,
			trim: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

UserSchema.pre("save", function(next) {
	let user = this;
	user.password = hashSync(this.password, genSaltSync(10));
	next();
});

module.exports = mongoose.model("User", UserSchema);
