
import { prisma } from "../db.js";

// ID зөв эсэхийг шалгах туслах функц
function validId(id) {
    return Number.isInteger(id) && id > 0;
}

// ------------------------------------
// GET /authors
// Бүх зохиогчийг номын тоотой авах
// ------------------------------------
export async function getAuthors(req, res) {

    // Зохиогчдыг номын тоотой нь авах
    const authors = await prisma.author.findMany({
        include: {
            _count: {
                select: { books: true }
            }
        },
        orderBy: { id: "asc" }
    });

    // Нийт тоо болон мэдээллийг буцаах
    res.json({
        count: authors.length,
        data: authors
    });
}

// ------------------------------------
// GET /authors/:id
// Нэг зохиогчийн мэдээлэл авах
// ------------------------------------
export async function getAuthor(req, res) {

    // URL-аас ID авах
    const id = Number(req.params.id);

    // ID шалгах
    if (!validId(id)) {
        return res.status(400).json({
            message: "Invalid author ID"
        });
    }

    // Зохиогч хайх
    const author = await prisma.author.findUnique({
        where: { id }
    });

    // Зохиогч олдохгүй бол
    if (!author) {
        return res.status(404).json({
            message: "Author not found"
        });
    }

    // Зохиогчийн мэдээллийг буцаах
    res.json(author);
}

// ------------------------------------
// POST /authors
// Шинэ зохиогч нэмэх
// ------------------------------------
export async function createAuthor(req, res) {

    // Хүсэлтээс нэр, имэйл авах
    const { name, email } = req.body ?? {};

    // Мэдээлэл зөв эсэхийг шалгах
    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof email !== "string" ||
        !email.trim()
    ) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    try {
        // Шинэ зохиогч үүсгэх
        const author = await prisma.author.create({
            data: {
                name: name.trim(),
                email: email.trim()
            }
        });

        // 201 - Амжилттай үүссэн
        res.status(201).json(author);

    } catch (error) {

        // Давхардсан имэйл
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        throw error;
    }
}

// ------------------------------------
// GET /authors/:id/books
// Зохиогчийн бүх номыг авах
// ------------------------------------
export async function getAuthorBooks(req, res) {

    // URL-аас зохиогчийн ID авах
    const id = Number(req.params.id);

    // ID шалгах
    if (!validId(id)) {
        return res.status(400).json({
            message: "Invalid author ID"
        });
    }

    // Зохиогчийг номуудын хамт хайх
    const author = await prisma.author.findUnique({
        where: { id },
        include: { books: true }
    });

    // Зохиогч олдохгүй бол
    if (!author) {
        return res.status(404).json({
            message: "Author not found"
        });
    }

    // Номуудыг буцаах
    res.json(author.books);
}

// ------------------------------------
// POST /authors/:id/books
// Тухайн зохиогчид шинэ ном нэмэх
// ------------------------------------
export async function createAuthorBook(req, res) {

    // URL-аас зохиогчийн ID авах
    const id = Number(req.params.id);

    // Хүсэлтээс номын мэдээлэл авах
    const { title, price } = req.body ?? {};

    // Зохиогчийн ID шалгах
    if (!validId(id)) {
        return res.status(400).json({
            message: "Invalid author ID"
        });
    }

    // Номын нэр шалгах
    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    // Номын үнэ шалгах
    if (!Number.isInteger(price) || price < 0) {
        return res.status(400).json({
            message: "Valid price is required"
        });
    }

    // Зохиогч байгаа эсэхийг шалгах
    const author = await prisma.author.findUnique({
        where: { id }
    });

    if (!author) {
        return res.status(404).json({
            message: "Author not found"
        });
    }

    try {
        // Зохиогчтой холбож шинэ ном үүсгэх
        const book = await prisma.book.create({
            data: {
                title: title.trim(),
                price,
                authorId: id
            },
            include: { author: true }
        });

        // Амжилттай нэмсэн бол 201
        res.status(201).json(book);

    } catch (error) {

        // Зохиогч байхгүй болсон бол
        if (error.code === "P2003") {
            return res.status(404).json({
                message: "Author not found"
            });
        }

        throw error;
    }
}

// ------------------------------------
// DELETE /authors/:id
// Зохиогч устгах
// ------------------------------------
export async function deleteAuthor(req, res) {

    // URL-аас ID авах
    const id = Number(req.params.id);

    // ID шалгах
    if (!validId(id)) {
        return res.status(400).json({
            message: "Invalid author ID"
        });
    }

    // Зохиогчийг номын тоотой хайх
    const author = await prisma.author.findUnique({
        where: { id },
        include: {
            _count: {
                select: { books: true }
            }
        }
    });

    // Зохиогч олдохгүй бол
    if (!author) {
        return res.status(404).json({
            message: "Author not found"
        });
    }

    // Номтой зохиогчийг устгахгүй
    if (author._count.books > 0) {
        return res.status(409).json({
            message: "Author has books and cannot be deleted"
        });
    }

    try {
        // Номгүй зохиогчийг устгах
        await prisma.author.delete({
            where: { id }
        });

        // Амжилттай устгасан бол 204
        res.status(204).send();

    } catch (error) {

        // Устгахын өмнө ном нэмэгдсэн байж болно
        if (error.code === "P2003") {
            return res.status(409).json({
                message: "Author has books and cannot be deleted"
            });
        }

        // Зохиогч олдохгүй болсон бол
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Author not found"
            });
        }

        throw error;
    }
}
