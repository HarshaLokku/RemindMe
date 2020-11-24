const {gql} = require("apollo-server");

module.exports = gql`
 
 type User {
     id: ID!
     firstName: String!
     lastName: String!
     password: String!
     email: String!
     token: String!
 }

 type Query{
     users: [User]
 }

 input RegisterInput {
     email: String!
     firstName: String!
     lastName: String!
     password: String!
     confirmPassword: String!
 }

 type Mutation {
     registerUser(registerInput : RegisterInput) : User
     loginUser( email: String!,  password: String!) : User!
 }

`