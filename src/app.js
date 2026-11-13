
import express from "express";

// Ном болон хэрэглэгчийн Router
import booksRouter from "./routes/books.router.js";
import usersRouter from "./routes/users.router.js";

// Middleware-үүд
import { logger } from "./middlewares/logger.js";
import { notFound, errorHandler } from "./middlewares/error.js";

// Express апп үүсгэх
const app = express();

// JSON мэдээлэл унших
app.use(express.json());

// API хүсэлт бүрийг бүртгэх
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

// Номын CRUD API-г холбох
app.use("/books", booksRouter);

// Хэрэглэгчийн CRUD API-г холбох
app.use("/users", usersRouter);

// Байхгүй API хаягийг боловсруулах
app.use(notFound);

// Серверийн алдааг боловсруулах
app.use(errorHandler);

// Серверийг 4000 порт дээр ажиллуулах
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
