const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
	username: {
		email: {
			type: "String",
			unique: true,
			required: true,
			trim: true
		},
		password: {
			type: String,
			required: true
		}
	}
},{
	timestamps:true
});

UserSchema.pre("save", function(next) {
	let user = this;
	user.password = bcrypt.hashSync(this.password);
	next();
});

module.exports = mongoose.model("User", UserSchema);
