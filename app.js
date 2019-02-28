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
		
		type User{
			_id : ID!
			email : String!
			password : String
			todos : [Todo!]! 
			createdAt : String!
			updatedAt : String!
		}

		input userPayload{
			email : String!
			password : String!
		}

		type Todo {
			_id : ID!
			task : String!
			user : User!
			createdAt : String!
			updatedAt : String!
		}

		input todoPayload{
			task : String!
		}

		type LoginData {
			token : String!
			message : String!
		}
		
		type RootQuery{
			users : [User!]!
			todos : [Todo!]!
			auth(payload:userPayload) : LoginData!
		}

		type RootMutations {
			createUser(payload:userPayload) : User
			createTask(payload:todoPayload) : Todo
		}

		schema {
			query : RootQuery
			mutation : RootMutations
			
		}
	`),
		rootValue: "", //resolvers
		graphiql: true
	})
);

module.exports = app;
