
import { Router } from "express";

// Controller функцуудыг импортлох
import * as c from "../controllers/authors.controller.js";

// Router үүсгэх
const router = Router();

// Бүх зохиогчийг номын тоотой авах
router.get("/", c.getAuthors);

// Нэг зохиогчийн номуудыг авах
router.get("/:id/books", c.getAuthorBooks);

// Тухайн зохиогчид шинэ ном нэмэх
router.post("/:id/books", c.createAuthorBook);

// Нэг зохиогчийн мэдээлэл авах
router.get("/:id", c.getAuthor);

// Шинэ зохиогч нэмэх
router.post("/", c.createAuthor);

// Зохиогч устгах
router.delete("/:id", c.deleteAuthor);

// Router-ийг экспортлох
export default router;
