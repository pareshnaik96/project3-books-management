const reviewModel = require("../Models/reviewModel")
const bookModel = require("../Models/bookModel");
const validator = require("../util/validator")
const ObjectId = require("mongoose").Types.ObjectId;
const { isValid, isValid6 } = validator

const createReview = async function (req, res) {
    try {
        let data = req.body
        let bookId = req.params.bookId

        if (Object.entries(data).length != 0) {

            const { rating, reviewedAt, review } = data

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
            if (!isValid6(rating)) {
                return res.status(400).send({ status: false, msg: "Rating should be in between 1-5" })
            }
            //validation for ID formate
            if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "NOT a valid book Id" })
            //validation of Id exist or not
            let Id = req.params.bookId
            let findbookId = await bookModel.find({ _id: Id, isdeleted: false })
            if (!findbookId) return res.status(404).send({ status: false, msg: "Book not found,please enter a valid book Id" })

            let saveReview = await reviewModel.create(data)
            await bookModel.findOneAndUpdate({ _id: Id, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true }) //review:+1
            return res.status(200).send({ status: true, msg: "Review updated", data: saveReview })
        }
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        let data = req.body
        let updatedRating = req.body.rating

        if (Object.entries(data).length != 0) {

            if (!isValid(updatedRating)) {
                return res.status(400).send({ status: false, msg: "Rating can not be empty" })
            }
            if (!isValid6(updatedRating)) {
                return res.status(400).send({ status: false, msg: "Rating should be in between 1-5" })
            }
            if (!ObjectId.isValid(bookId)) {
                return res.status(400).send({ status: false, msg: "NOT a valid book Id" })
            }
            if (!ObjectId.isValid(reviewId)) {
                return res.status(400).send({ status: false, msg: "NOT a valid review Id" })
            }
            let findbookId = await bookModel.find({ _id: bookId, isdeleted: false })
            if (!findbookId) return res.status(404).send({ status: false, msg: "Book not found,please enter a valid book Id" })

            let findReviewId = await reviewModel.find({ _id: reviewId, isdeleted: false })
            if (!findReviewId) return res.status(404).send({ status: false, msg: "ReviewId not found,please enter a valid Id" })

            let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, {
                $set: { reviewedBy: data.reviewedBy, rating: data.rating, review: data.review, reviewedAt: new Date() }
            }, { new: true })
            return res.status(200).send({ status: true, data: updatedReview })
        }
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const deleteReviewById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: "book Id is required." })
        }
        if (!isValid(reviewId)) {
            return res.status(400).send({ status: false, message: "Review Id is required." })
        }
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "NOT a valid book Id" })
        }
        if (!ObjectId.isValid(reviewId)) {
            return res.status(400).send({ status: false, msg: "NOT a valid review Id" })
        }
        let findbookId = await bookModel.find({ _id: bookId, isdeleted: false })
        if (!findbookId) return res.status(404).send({ status: false, msg: "Book not found,please enter a valid book Id" })

        let findReviewId = await reviewModel.find({ _id: reviewId, isdeleted: false })
        if (!findReviewId) return res.status(404).send({ status: false, msg: "ReviewId not found,please enter a valid Id" })

        let deleteReview = await reviewModel.findOneAndUpdate(
            { _id: reviewId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } }, { new: true })

        return res.status(200).send({ status: true, msg: "Review deleteded", data: deleteReview })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReviewById = deleteReviewById