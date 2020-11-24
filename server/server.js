// Dependency imports
const {ApolloServer, gql} = require('apollo-server');
const Mongoose = require('mongoose');

// local imports
const User = require('./Models/User');
const typeDefs = require('./Graphql/Schema/schema');
const resolvers = require('./Graphql/Resolvers/resolvers');

// Creating a new server
const server = new ApolloServer({typeDefs, resolvers, });

//Connecting to mongoose
Mongoose.connect("mongodb://127.0.0.1:27017/merng", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then( () => {
  console.log('mongoDB connected');
  server.listen({port: 3000
  }) .then( res => {
     console.log(`Server running on ${res.url}`);
  });
})

// Listening at port 5000
