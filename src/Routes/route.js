const express=require('express');
const router=express.Router();
const userController=require("../Controllers/userController")
const bookController=require("../Controllers/bookController")
const reviewController=require("../Controllers/reviewController")
const middleware=require("../Middlewares/middelware")
//--------------------------------------------------------//

router.get("/test-me", function (req, res) {
    res.status(200).send("My server is running awesome!")
})
//--------------------------------------------------------//


router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

router.post("/books",middleware.authentication,bookController.createBook)
router.get("/books",middleware.authentication,bookController.getBook)
router.get("/books/:bookId",middleware.authentication,bookController.getBookById)
router.put("/books/:bookId",middleware.authentication,middleware.authorization,bookController.updateBookById)
router.delete("/books/:bookId",middleware.authentication,middleware.authorization,bookController.deleteBookById)

router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReviewById)

module.exports = router;