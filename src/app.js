
import express from "express";

// Номын module-оос функцүүд импортлох
import {
    getBooksFromDb,
    getBookOrThrow,
    searchByTitle
} from "./books.js";

// Хэрэглэгчийн module-оос импортлох
import {
    users,
    findUserById
} from "./users.js";

// Express сервер үүсгэх
const app = express();

// JSON өгөгдөл унших
app.use(express.json());

// Нүүр хуудас
app.get("/", (req, res) => {
    res.json({
        message: "Library API",
        version: "1.0.0"
    });
});

// Серверийн төлөв шалгах
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime()
    });
});

// Хэрэглэгчийн жишээ мэдээлэл
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

// Бүх ном авах эсвэл нэрээр хайх
app.get("/books", async (req, res) => {
    try {
        // Promise-ийн үр дүнг хүлээх
        const allBooks = await getBooksFromDb();

        // URL-аас хайх үг авах
        const q = req.query.q;

        // Хайх үг байвал номыг шүүх
        if (typeof q === "string" && q) {
            return res.json(searchByTitle(q));
        }

        // Бүх номыг буцаах
        res.json(allBooks);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// ID-аар ном хайх
app.get("/books/:id", async (req, res) => {
    try {
        // Өгөгдөл ирэхийг хүлээх
        await getBooksFromDb();

        // ID-г тоо болгох
        const id = Number(req.params.id);

        // Ном хайх, олдохгүй бол алдаа үүсгэнэ
        const book = getBookOrThrow(id);

        // Номыг буцаах
        res.json(book);

    } catch (error) {
        // Ном олдохгүй бол 404 буцаах
        res.status(404).json({
            message: error.message
        });
    }
});

// Бүх хэрэглэгчийг авах
app.get("/users", (req, res) => {
    // Password талбарыг хариунаас хасах
    const safeUsers = users.map(({ password, ...user }) => user);

    res.json(safeUsers);
});

// ID-аар хэрэглэгч хайх
app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    // Хэрэглэгч хайх
    const user = findUserById(id);

    // Хэрэглэгч олдохгүй бол 404
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    // Password талбарыг буцаахгүй
    const { password, ...safeUser } = user;

    res.json(safeUser);
});

// Серверийг ажиллуулах
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
