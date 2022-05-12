const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            unique: true,
            trim: true
        },
        excerpt: {
            type: String,
            required: [true, "Excerpt is required"],
            trim: true
        },
        userId: {
            type: ObjectId,
            refs: 'User',
            required: [true, "UserId is required"],
            trim: true
        },
        ISBN: {
            type: String,
            required: [true, "ISBN is required"],
            unique: true,
            trim: true
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true
        },
        subcategory: {
            type: [String],
            required: [true, "Subcategory is required"],
            trim: true
        },
        reviews: {
            type: Number,
            default: 0,
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date
        },
        releasedAt: {
            type: Date,
            required:[true,"Released date is Required"],
            default: new Date()
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('Book', bookSchema)