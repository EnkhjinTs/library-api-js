
import { Router } from "express";

// Controller-ийн функцүүдийг импортлох
import * as c from "../controllers/books.controller.js";

// Router үүсгэх
const router = Router();

// GET - Бүх номыг авах
router.get("/", c.list);

// GET - Номыг нэрээр хайх
// /:id-аас өмнө байрлах ёстой
router.get("/search", c.search);

// GET - ID-аар нэг ном авах
router.get("/:id", c.getOne);

// POST - Шинэ ном нэмэх
router.post("/", c.create);

// PATCH - Номын мэдээлэл засах
router.patch("/:id", c.update);

// DELETE - Ном устгах
router.delete("/:id", c.remove);

// Router-ийг app.js файлд ашиглах
export default router;
