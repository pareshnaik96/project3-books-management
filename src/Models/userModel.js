const mongoose = require("mongoose")

let validateEmail = function (email) {
    let emailRegex = /^\w+[\.-]?\w+@\w+[\.-]?\w+(\.\w{1,3})+$/;
    return emailRegex.test(email)
};
let validatePassword = function (password) {
    let passwordRegex = /^[A-Za-z]{8,15}$/;
    return passwordRegex.test(password)
};

const userSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            enum: ["Mr", "Mrs", "Miss"],
            trim: true
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        phone: {
            type: Number,
            required: [true, "Phone Number is required"],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            validation: [validateEmail, "Please enter a valid email address"],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            validation: [validatePassword, "Please enter a valid password"],
            trim: true
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            pincode: { type: String, trim: true }
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema);