const express = require("express");
const { verify } = require("jsonwebtoken");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

// errorHandler
const {
	catchAsyncErrors,
	catch404Errors,
	showErrorHandler
} = require("./handlers/errorHandler");

// resolvers
const { createUser, authUser } = require("./resolvers/userResolver");
const { addTask, getTasks } = require("./resolvers/todoResolver");

const app = express();

// cors
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

// getUser from request if exist
app.use((req, res, next) => {
	const authorizationToken = req.get("Authorization");
	if (authorizationToken) {
		try {
			const user = verify(authorizationToken, process.env.SECRET);
			if (user) {
				req.userId = user.id;
			}
		} catch (err) {
			throw new Error(err);
		}
	}
	next();
});

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
		}
		
		type RootQuery{
			users : [User!]!
			getTodos(status:String) : [Todo!]!
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
		rootValue: {
			createUser: catchAsyncErrors(createUser),
			auth: catchAsyncErrors(authUser),
			createTask: catchAsyncErrors(addTask),
			getTodos: catchAsyncErrors(getTasks)
		},
		graphiql: true
	})
);

app.use(catch404Errors);
app.use(showErrorHandler);

module.exports = app;
