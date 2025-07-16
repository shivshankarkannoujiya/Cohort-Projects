import mongoose from "mongoose";
import { Book } from "../models/book.models";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const addBook = asyncHandler(async (req, res) => {
    const {
        title,
        author,
        description,
        price,
        stockQuantity,
        genre,
        coverImageUrl,
    } = req.body;

    if (!title || !author || !price || !genre) {
        return res
            .status(400)
            .json({ message: "Title, author, price, and genre are required." });
    }

    const existedBook = await Book.findOne({ title });
    if (existedBook) {
        throw new ApiError(400, "Book with title already exist");
    }

    const newBook = await Book.create({
        title,
        author,
        description,
        price,
        stockQuantity,
        genre,
        createdBy: req.user?._id,
        coverImageUrl,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { book: newBook },
                "Book created successfully",
            ),
        );
});

const listAllBooks = asyncHandler(async (_, res) => {
    const books = await Book.find();
    return res
        .status(200)
        .json(new ApiResponse(200, books, "Books fetched successfully"));
});

const getBookDetailsByBookId = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    if (!bookId) {
        throw new ApiError(401, "Id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ApiError(400, "Invalid Book ID format");
    }

    const book = await Book.findById(bookId);

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, book, "Book fetched successfully"));
});

const updateBook = asyncHandler(async (req, res) => {
    const { title, description, price, stockQuantity, genre } = req.body;
    const { bookId } = req.params;

    if (!bookId) {
        throw new ApiError(401, "Id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ApiError(400, "Invalid Book ID format");
    }

    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
            title,
            description,
            price,
            stockQuantity,
            genre,
        },
        { new: true },
    );

    if (!updatedBook) {
        throw new ApiError(404, "Book not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

const deleteBookByBookId = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    if (!bookId) {
        throw new ApiError(401, "Id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ApiError(400, "Invalid Book ID format");
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
        throw new ApiError(404, "Book not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedBook, "Book deleted successfully"));
});

export {
    addBook,
    listAllBooks,
    getBookDetailsByBookId,
    updateBook,
    deleteBookByBookId,
};
