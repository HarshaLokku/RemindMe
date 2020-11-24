const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

const User = require('../../Models/User');
const {SECRET_KEY_JWT} = require('../../config')
const {validateRegister} = require('../../utils/validateRegister');
const {validateLogin, validatelogin} = require('../../utils/validateLogin');

const generateToken = (user) => {
    return jwt.sign(
        {   id: user.id, 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }, SECRET_KEY_JWT, {expiresIn: '2h'})
}

const resolvers = {
    Query : {
        users: async () => {
            const users = await User.find();
            return users;
        }
    }, 
    Mutation : {
        // parent, args, context, info are the arguments that can be used
        async loginUser(_, args,){
            const {email, password} = args;

            // validate login form input
            const {errors, valid} = validatelogin(email, password);

            if(!valid){
                throw new UserInputError("Errors", {errors});
            }

            // checking if the user exists in the database
            const user = await User.findOne({email});

            if(!user){
                errors.general = "This email is not registered";
                throw new UserInputError('User email not found', {errors});
            } else {
                const match = await bcrypt.compare(password, user.password);
                if(!match){
                    errors.general = "The password is incorrect";
                    throw new UserInputError('Password is incorrect', {errors})
                }
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },

        async registerUser(_, args){
            const {email, firstName, lastName, password, confirmPassword} = args.registerInput;

            // Validating register form input
            const {errors, valid} = validateRegister(firstName, lastName, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }

            // Checking if the user is already registered with that email
            const user = await User.findOne({email});

            if(user){
                throw new UserInputError('Email is already registered... Try logging in', {
                    errors: {
                        email: 'The email used is already registered.. Please try logging in'
                    }
                })
            }

            // encrypting password using bcyrptjs
            const newPassword = await bcrypt.hash(password, 12);

            // creating new user for storing in the database
            const newUser = new User({
                firstName, lastName, password: newPassword, email
            })

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}

module.exports = resolvers;