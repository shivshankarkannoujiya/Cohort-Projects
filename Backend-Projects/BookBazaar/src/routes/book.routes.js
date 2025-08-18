import { Router } from "express";
import { UserRolesEnum } from "../utils/constant.js";
import { validatePermission } from "../middlewares/admin.middleware.js";
import {
    addBook,
    getBookDetailsByBookId,
    listAllBooks,
    updateBook,
    deleteBookByBookId,
} from "../controllers/book.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyApiKey } from "../middlewares/apikey.middleware.js";

const router = Router();

router
    .route("/")
    .post(verifyJWT, validatePermission([UserRolesEnum.ADMIN]), addBook)
    .get(verifyJWT, listAllBooks);

router
    .route("/:id")
    .get(verifyJWT, verifyApiKey, getBookDetailsByBookId)
    .put(verifyJWT, validatePermission([UserRolesEnum.ADMIN]), updateBook)
    .put(
        verifyJWT,
        validatePermission([UserRolesEnum.ADMIN]),
        deleteBookByBookId,
    );

export default router;
