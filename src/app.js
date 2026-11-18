
import express from "express";

// ========================================
// СЕМИНАР 11 - SWAGGER UI
// ========================================

import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import fs from "node:fs";

// Номын Router
import booksRouter from "./routes/books.router.js";

// Хэрэглэгчийн Router
import usersRouter from "./routes/users.router.js";

// Семинар 6 - Зохиогчийн Router
import authorsRouter from "./routes/authors.router.js";

// Middleware-ууд
import { logger } from "./middlewares/logger.js";
import { notFound, errorHandler } from "./middlewares/error.js";

// Express application үүсгэх
const app = express();

// JSON өгөгдөл хүлээн авах
app.use(express.json());

// Хүсэлт бүрийг терминалд бүртгэх
app.use(logger);

// ========================================
// СЕМИНАР 11 - OPENAPI / SWAGGER
// ========================================

// openapi.yaml файлыг уншиж YAML -> Object болгох
const spec = YAML.parse(
    fs.readFileSync("./openapi.yaml", "utf8")
);

// Swagger UI-г /docs замд холбох
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(spec)
);

// --------------------------------
// СЕМИНАР 1 - ҮНДСЭН API
// --------------------------------

// Нүүр хуудас
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Library API"
    });
});

// Серверийн төлөв шалгах
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// Профайлын мэдээлэл
app.get("/profile", (req, res) => {
    res.json({
        name: "Student",
        project: "Library API"
    });
});

// Төслийн тухай
app.get("/about", (req, res) => {
    res.json({
        project: "Library API",
        description: "Express, PostgreSQL and Prisma"
    });
});

// Оюутны мэдээлэл
app.get("/students", (req, res) => {
    res.json({
        students: []
    });
});

// Хичээлийн мэдээлэл
app.get("/courses", (req, res) => {
    res.json({
        courses: []
    });
});

// --------------------------------
// СЕМИНАР 3-5 - НОМЫН API
// --------------------------------

// GET, POST, PATCH, DELETE /books
app.use("/books", booksRouter);

// --------------------------------
// СЕМИНАР 3 - ХЭРЭГЛЭГЧИЙН API
// --------------------------------

// Хэрэглэгчийн API
app.use("/users", usersRouter);

// --------------------------------
// СЕМИНАР 6 - ЗОХИОГЧИЙН API
// --------------------------------

// GET /authors
// GET /authors/:id
// POST /authors
// GET /authors/:id/books
app.use("/authors", authorsRouter);

// -------------------------------
// АЛДАА БОЛОВСРУУЛАХ
// -------------------------------

// Байхгүй API-д 404 буцаах
app.use(notFound);

// Серверийн алдааг боловсруулах
app.use(errorHandler);

// -------------------------------
// СЕРВЕР АЖИЛЛУУЛАХ
// -------------------------------

// .env файлаас PORT авах
const PORT = Number(process.env.PORT) || 4000;

// Серверийг эхлүүлэх
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/docs`);
});
