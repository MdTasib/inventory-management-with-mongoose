const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
	{
		email: {
			type: String,
			validate: [validator.isEmail, "Provide a valid Email"],
			trim: true,
			lowercase: true,
			unique: true,
			required: [true, "Email address is required"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			validate: {
				validator: value =>
					validator.isStrongPassword(value, {
						minLength: 6,
						minLowercase: 3,
						minNumbers: 1,
						minUppercase: 1,
						minSymbols: 1,
					}),
				message: "Password {VALUE} is not strong enough.",
			},
		},
		confirmPassword: {
			type: String,
			required: [true, "Please confirm your password"],
			validate: {
				validator: function (value) {
					return value === this.password;
				},
				message: "Passwords don't match!",
			},
		},

		role: {
			type: String,
			enum: ["buyer", "store-manager", "admin"],
			default: "buyer",
		},

		firstName: {
			type: String,
			required: [true, "Please provide a first name"],
			trim: true,
			minLength: [3, "Name must be at least 3 characters."],
			maxLength: [100, "Name is too large"],
		},
		lastName: {
			type: String,
			required: [true, "Please provide a first name"],
			trim: true,
			minLength: [3, "Name must be at least 3 characters."],
			maxLength: [100, "Name is too large"],
		},
		contactNumber: {
			type: String,
			validate: [
				validator.isMobilePhone,
				"Please provide a valid contact number",
			],
		},

		shippingAddress: String,

		imageURL: {
			type: String,
			validate: [validator.isURL, "Please provide a valid url"],
		},
		status: {
			type: String,
			default: "active",
			enum: ["active", "inactive", "blocked"],
		},

		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", function (next) {
	const password = this.password;
	const hashedPassword = bcrypt.hashSync(password);

	this.password = hashedPassword;
	this.confirmPassword = undefined;

	next();
});

userSchema.methods.comparePassword = function (password, hash) {
	const isPasswordValid = bcrypt.compareSync(password, hash);
	return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

/*

{
"email": "test@test.com",
    "password": "test123@#ABC",
    "confirmPassword": "test123@#ABC",
    "firstName": "test",
    "lastName": "user",
    "shippingAddress": "944 osthir Street",
    "presentAddress": "944 osthir Street",
    "permanentAddress": "944 Russell Street",
    "imageURL": "https://i.ibb.co/WnFSs9Y/unnamed.webp"
}


//for manager
/*
"name":"Manager",
"email":"managerctg@test.com",
"password":"mezba123456##",
"confirmPassword":"mezba123456##",
"firtsName":"Manager of",
"lastName":"CTG",
"contactNumber":"11111111111",
"shippingAddress:"944 osthir Street",
"division":"chattogram",
"imageURL":"https://i.ibb.co/WnFSs9Y/unnamed.webp",
"status":"active",
"emergencyContactNumber":"01712345678",
"presentAddress":"944 osthir Street",
"permanentAddress":"944 Russell Street",
"nationalIdImageURL":"https://i.ibb.co/WnFSs9Y/unnamed.webp",
*/
