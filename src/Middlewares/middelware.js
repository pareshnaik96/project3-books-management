const jwt = require("jsonwebtoken");
const bookModel = require("../Models/bookModel");
const ObjectId = require("mongoose").Types.ObjectId;

let decodeToken
//Authentication
const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) token = req.headers["X-Api-Key"]
        if (!token) return res.status(400).send({ status: false, msg: "You are not logged in. Token is required." })
        try {
            decodeToken = jwt.verify(token, "AJpnAsrc@p3")
        } catch (err) {
            return res.status(401).send({ status: false, msg: "Invalid Token", error: err.message })
        }
        next()
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}
//AuthoriZation
const authorization = async function (req, res, next) {
    try {
        let bookId = req.params.bookId || req.query
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "Not a valid Book Id" })
        let getBook = await bookModel.findById(bookId)
        if (!getBook) return res.status(404).send({ status: false, msg: "Book Not Found." })
        if (decodeToken.userId.toString() !== getBook.userId.toString()) return res.status(403).send({ status: false, msg: "You are not authorize to perform the action." })
        next();
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }
}



module.exports.authentication = authentication
module.exports.authorization = authorization
