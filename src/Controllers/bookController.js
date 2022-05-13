const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel")
const validator = require("../util/validator")
const ObjectId = require("mongoose").Types.ObjectId;

const { isValid } = validator

const createBook = async function (req, res) {
    try {
        const data = req.body

        if (Object.entries(data).length != 0) {

            const { title, excerpt, userId, ISBN, category, subcategory } = data

            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: "Please fill the required field Title!" })
            }
            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, msg: "Please enter the required field excerpt" })
            }
            if (!isValid(userId)) {
                return res.status(400).send({ status: false, msg: "Please enter the required field userId" })
            }
            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, msg: "Please enter the required field ISBN" })
            }
            if (!isValid(category)) {
                return res.status(400).send({ status: false, msg: "Please enter the required field category" })
            }
            if (!isValid(subcategory)) {
                return res.status(400).send({ status: false, msg: "Please enter the required field subcategory" })
            }
            //validation for ID formate
            if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, msg: "NOT a valid user Id" })
            //validation of Id exist or not
            let Id = req.body.userId
            let findUserId = await userModel.findById(Id)
            if (!findUserId) return res.status(404).send({ status: false, msg: "user not found,please enter a valid user Id" })

            const saveData = await bookModel.create(data)
            return res.status(201).send({ status: true, data: saveData })
        }
        else {
            return res.status(400).send({ status: false, msg: "NO USER INPUT" })
        }

    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//get book by query

const getBook = async function (req, res) {
    try {
        const userInput = req.query

        if (userInput.userId) {
            if (!ObjectId.isValid(userInput.userId)) {
                return res.status(400).send({ status: false, msg: "Not valid Id" })
            }
        }
        if (Object.entries(userInput).length === 0) {
            let findBooks = await bookModel.find({ userInput }).sort({ title: 1 })
            // if condition false

            if (Object.entries(findBooks).length === 0) {
                return res.status(404).send({ status: false, msg: "Sorry!! No Books found " })
            }
            return res.status(200).send({ status: true, data: findBooks })
        }
        else {
            let filter = { isDeleted: false, ...userInput }
            const filterByInput = await bookModel.find(filter).sort({ title: 1 })
            if (Object.entries(filterByInput).length === 0) {
                return res.status(404).send({ status: false, msg: "Sorry!! No books found by query" })
            }
            return res.status(200).send({ status: true, data: filterByInput })
        }
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const getBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "Not a valid book Id" })
        }
        let getBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!getBook) {
            return res.status(404).send({ status: false, msg: "Book Not found" })
        }
        let findReview = await reviewModel.find({ bookId: bookId, isDeleted: false })
        if (!findReview) return res.status(404).send({ status: false, msg: "NO review found" })

        const BooksList = ({
            Book: getBook,
            reviewData: findReview
        })
        return res.status(200).send({ status: true, message: "Book list", data: BooksList })


    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const updateBookById = async function (req, res) {
    try {
        const Id = req.params.bookId
        // ID validation
        if (!ObjectId.isValid(Id)) return res.status(400).send({ status: false, msg: "Not a valid Book ID" })
        // Id verification
        let bookDetails = await bookModel.findById(Id)
        if (bookDetails.isDeleted) return res.status(404).send({ status: false, msg: "Book not found." })

        let updatedData = req.body
        let updatedTitle = req.body.title
        let updatedExcerpt = req.body.excerpt
        let updatedReleaseDate = req.body.releasedAt
        let updatedISBN = req.body.ISBN
        let updatedCategory = req.body.category
        let updatedSubcategory = req.body.subcategory

        if (Object.entries(updatedData).length === 0) return res.status(400).send({ status: false, msg: "NO INPUT BY USER" })//for update required filled can't be blank
        if (!isValid(updatedTitle)) {
            return res.status(400).send({ status: false, msg: "Title can not be empty" })
        }
        if (!isValid(updatedExcerpt)) {
            return res.status(400).send({ status: false, msg: "Excerpt can not be empty" })
        }
        if (!isValid(updatedReleaseDate)) {
            return res.status(400).send({ status: false, msg: "ReleaseDate can not be empty" })
        }
        if (!isValid(updatedISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN can not be empty" })
        }
        if (!isValid(updatedCategory)) {
            return res.status(400).send({ status: false, msg: "Category can not be empty" })
        }

        let updatedBook = await bookModel.findOneAndUpdate({ _id: Id },
            {
                $set: { title: updatedTitle, excerpt: updatedExcerpt, ISBN: updatedISBN, category: updatedCategory, releasedAt: new Date() },
                $push: { subcategory: updatedSubcategory }
            }, { new: true })
        return res.status(200).send({ status: true, data: updatedBook })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const deleteBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId;

        if (!ObjectId.isValid(bookId))
            return res.status(400).send({ status: false, msg: "Not a valid book id" })

        let deleteBook = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deleteBook) return res.status(404).send({ status: false, msg: "Book does not exist" })
        return res.status(200).send({ status: true, data: deleteBook })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}





module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.updateBookById = updateBookById
module.exports.getBookById = getBookById
module.exports.deleteBookById = deleteBookById