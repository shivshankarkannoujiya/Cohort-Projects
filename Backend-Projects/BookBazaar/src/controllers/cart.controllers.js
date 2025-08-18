import { CartItem } from "../models/cart-item.models";
import { Book } from "../models/book.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const addItemToCart = asyncHandler(async (req, res) => {
    const { bookId, quantity } = req.body;
    const userId = req.user?._id;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            throw new ApiError(404, "Book not found.");
        }

        let cartItem = await CartItem.findOne({ user: userId, book: bookId });
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        cartItem,
                        "Item quantity updated in cart.",
                    ),
                );
        } else {
            const cartItem = await CartItem.create({
                user: userId,
                book: bookId,
                quantity,
            });

            return res
                .status(201)
                .json(new ApiResponse(201, cartItem, "Item added to cart."));
        }
    } catch (error) {
        console.error("Error while adding items to cart: ", error);
        throw new ApiError(500, "Internal Server Error");
    }
});

const getCartItems = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const cartItems = await CartItem.find({ user: userId }).populate(
            "book",
            ["title", "author", "price"],
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    count: cartItems?.length,
                    cartItems,
                },
                "CartItems fetched successfully !!",
            ),
        );
    } catch (error) {
        console.error("Error while fetching CartItems: ", error);
        throw new ApiError(500, "Internal Server Error");
    }
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const userId = req.user?._id;

    try {
        const cartItem = await CartItem.findOne({
            _id: req.params.id,
            user: userId,
        });

        if (!cartItem) {
            throw new ApiError(404, "Cart item not found");
        }

        if (quantity <= 0) {
            await cartItem.deleteOne();
            return res
                .status(200)
                .json(new ApiResponse(200, "Item removed from cart"));
        }

        cartItem.quantity = quantity;
        cartItem.save();

        return res
            .status(200)
            .json(new ApiResponse(200, cartItem, "Cart item updated"));
    } catch (error) {
        console.error("Error while updating CartItems: ", error);
        throw new ApiError(500, "Internal Server Error");
    }
});

const removeCartItem = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    try {
        const cartItem = await CartItem.findOneAndDelete({
            _id: req.params.id,
            user: userId,
        });

        if (!cartItem) {
            throw new ApiError(404, "Cart item not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Item successfully removed from cart"));
    } catch (error) {
        console.error("Error while removing CartItems: ", error);
        throw new ApiError(500, "Internal Server Error");
    }
});

export { addItemToCart, getCartItems, updateCartItem, removeCartItem };
