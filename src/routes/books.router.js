
import { Router } from "express";

// Controller-ийн функцүүдийг импортлох
import * as c from "../controllers/books.controller.js";

// Router үүсгэх
const router = Router();

// Бүх номыг авах
router.get("/", c.list);

// ID-аар нэг ном авах
router.get("/:id", c.getOne);

// Шинэ ном нэмэх
router.post("/", c.create);

// Номын мэдээлэл засах
router.patch("/:id", c.update);

// Ном устгах
router.delete("/:id", c.remove);

// Router-ийг бусад файлд ашиглах боломжтой болгох
export default router;
