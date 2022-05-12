const reviewModel = require("../Models/reviewModel")
const bookModel = require("../Models/bookModel");
const validator = require("../util/validator")
const ObjectId = require("mongoose").Types.ObjectId;
const { isValid } = validator

const createReview = async function (req, res) {
    try {
        const data = req.body

        if (Object.entries(data).length != 0) {

            const { bookId, rating, reviewedAt,review } = data

            if (!isValid(bookId)) {
                return res.status(400).send({ status: false, msg: "Please fill the required field bookId!" })
            }
            if (!isValid(rating)) {
                return res.status(400).send({ status: false, msg: "Please fill the required field rating!" })
            }
            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "Please fill the required field review!" })
            }
            if (!isValid(reviewedAt)) {
                return res.status(400).send({ status: false, msg: "Please fill the review date!" })
            }
            //validation for ID formate
            if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "NOT a valid book Id" })
            //validation of Id exist or not
            let Id = req.body.bookId
            let findbookId = await bookModel.find({_id:Id,isdeleted:false})
            if (!findbookId) return res.status(404).send({ status: false, msg: "Book not found,please enter a valid book Id" })

            let saveReview = await reviewModel.create(data)
            return res.status(201).send({ status: true, data: saveReview })
        }

    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }

}

module.exports.createReview = createReview
