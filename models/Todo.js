const mongoose = require("mongoose");
const TODOSchema = new mongoose.Schema(
	{
		task: {
			type: String,
			required: true,
			trim: true
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User"
		},
		status: {
			type: String,
			default: "none"
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("ToDo", TODOSchema);
