const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = mongoose.Schema(
    {
        bookId: {
            type: ObjectId,
            required: [true, "BookId is required"],
            refs: 'Book',
            trim: true
        },
        reviewedBy: {
            type: String,
            required: [true, "Review is required"],
            default: 'Guest',
            trim: true
        },
        reviewedAt: {
            type: Date,
            required: [true, "Review date is required"],
            default: new Date()
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            trim: true
        },
        review: {
            type: String,
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)


module.exports = mongoose.model('Review', reviewSchema)
