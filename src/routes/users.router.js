
import { Router } from "express";

// users.controller.js файлын функцүүдийг импортлох
import * as c from "../controllers/users.controller.js";

// Router үүсгэх
const router = Router();

// Бүх хэрэглэгчийн мэдээлэл авах
router.get("/", c.list);

// ID-аар нэг хэрэглэгч авах
router.get("/:id", c.getOne);

// Шинэ хэрэглэгч нэмэх
router.post("/", c.create);

// Хэрэглэгчийн мэдээлэл засах
router.patch("/:id", c.update);

// Хэрэглэгч устгах
router.delete("/:id", c.remove);

// Router-ийг app.js файлд ашиглах боломжтой болгох
export default router;
