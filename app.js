const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
	"/graphQL",
	graphqlHTTP({
		schema: buildSchema(`
		type RootQuery{

		}

		type RootMutations {

		}

		schem {
			query : RootQuery
			mutation : RootMutations
		}
	`),
		rootValue: "", //resolvers
		graphiql: true
	})
);

module.exports = app;
