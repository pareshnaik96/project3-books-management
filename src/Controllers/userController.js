const userModel = require("../Models/userModel")
const validator = require("../util/validator")
const jwt = require("jsonwebtoken");


const createUser = async function (req, res) {
    try {
        const data = req.body
        if (Object.keys(data).length != 0) {

            const { title, name, phone, email, password, address } = data

            if (!title || !title.trim()) {
                return res.status(400).send({ status: false, msg: "Please fill the required field Title!" })  //required filled can't be blank
            }
            if (!name || !name.trim()) {
                return res.status(400).send({ status: false, msg: "Please enter the required field Name" })
            }
            if (!phone) {
                return res.status(400).send({ status: false, msg: "Please enter the required field Phone" })
            }
            if (!email) {
                return res.status(400).send({ status: false, msg: "Please enter the required field email" })
            }
            if (!password) {
                return res.status(400).send({ status: false, msg: "Please enter the required field password" })
            }
            if (!address) {
                return res.status(400).send({ status: false, msg: "Please enter the required field Address" })
            }
            const { isValid1, isValid2, isValid3, isValid4, isValid5 } = validator

            //title validation
            if (!isValid1(title)) {
                return res.status(400).send({ status: false, msg: "Please enter a valid Title" })
            }
            //Name validation
            if (!isValid2(name)) {
                return res.status(400).send({ status: false, msg: "Name must be alphabetical and min length 2." })
            }
            //phone validation
            if (!isValid3(phone)) {
                return res.status(400).send({ status: false, msg: "Please provide a valid Phone Number" })
            }
            // Email Validation
            if (!isValid4(email)) {
                return res.status(400).send({ status: false, msg: "Please provide valid email" })
            }
            // Unique Email
            const usedEmail = await userModel.findOne({ email: email })
            if (usedEmail) {
                return res.status(400).send({ status: false, msg: "Email Id already exists." })
            }
            // Password Validation
            if (!isValid5(password)) {
                return res.status(400).send({ status: false, msg: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & ] and length should be min of 8-15 charachaters" })
            }

            const savedData = await userModel.create(data);
            return res.status(201).send({ status: true, data: savedData });
        }
        else {
            return res.status(400).send({ status: false, msg: "NO USER INPUT" })
        }
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const loginUser = async function (req, res) {
    try {

        let userId = req.body.email;
        let password = req.body.password;

        if (!userId) return res.status(400).send({ status: false, msg: "email is required." })
        if (!password) return res.status(400).send({ status: false, msg: "Password is required." })

        let getUser = await userModel.findOne({ email: userId })
        if (!getUser) return res.status(404).send({ status: false, msg: "user not found!" })

        const providedPassword = getUser.password
        if (password != providedPassword) return res.status(401).send({ status: false, msg: "Password is incorrect." })

        //To create token
        let token = jwt.sign({
            userId: getUser._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }, "AJpnAsrc@p3");

        res.setHeader("x-api-key", token);
        return res.status(201).send({ status: true, msg: "User login sucessful", data: { token } })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}
module.exports.createUser = createUser
module.exports.loginUser = loginUser