
import express from "express";

// Ном болон хэрэглэгчийн Router
import booksRouter from "./routes/books.router.js";
import usersRouter from "./routes/users.router.js";

// Middleware-үүд
import { logger } from "./middlewares/logger.js";
import { notFound, errorHandler } from "./middlewares/error.js";

// Express сервер үүсгэх
const app = express();

// 1. JSON өгөгдлийг унших
app.use(express.json());

// 2. Хүсэлт бүрийг бүртгэх
app.use(logger);

// Нүүр хуудас
app.get("/", (req, res) => {
    res.json({
        message: "Library API",
        version: "1.0.0"
    });
});

// Сервер ажиллаж байгаа эсэхийг шалгах
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime()
    });
});

// Хэрэглэгчийн профайл
app.get("/profile", (req, res) => {
    res.json({
        name: "Bat",
        role: "USER",
        email: "bat@example.com"
    });
});

// Төслийн мэдээлэл
app.get("/about", (req, res) => {
    res.json({
        project: "Library API",
        version: "1.0.0",
        author: "Student"
    });
});

// Оюутнуудын мэдээлэл
app.get("/students", (req, res) => {
    res.json([
        { id: 1, name: "Bat" },
        { id: 2, name: "Bold" },
        { id: 3, name: "Saraa" }
    ]);
});

// Хичээлүүдийн мэдээлэл
app.get("/courses", (req, res) => {
    res.json([
        { id: 1, name: "JavaScript" },
        { id: 2, name: "Node.js" }
    ]);
});

// 3. Номын API-г холбох
app.use("/books", booksRouter);

// 4. Хэрэглэгчийн API-г холбох
app.use("/users", usersRouter);

// 5. Байхгүй API хаягт 404 буцаах
app.use(notFound);

// 6. Серверийн алдааг боловсруулах
app.use(errorHandler);

// .env файлаас PORT авах
const PORT = Number(process.env.PORT) || 4000;

// Серверийг ажиллуулах
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
