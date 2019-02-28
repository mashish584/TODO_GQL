require("dotenv").config({ path: "secret.env" });

const mongoose = require("mongoose");
mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true })
	.then(() => {
		// register model
		require("./models/User");
		require("./models/Todo");

		const app = require("./app");
		app.set("PORT", process.env.PORT);
		app.listen(app.get("PORT"), err => {
			if (err) {
				console.log(`Connection Failed - ${err.message}`);
			} else {
				console.log(`Server is running on port ${app.get("PORT")}`);
			}
		});
	})
	.catch(err => console.log(`Connection Failed - ${err.message}`));

mongoose.set("useCreateIndex", true);
