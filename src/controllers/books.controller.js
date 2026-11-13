
import { prisma } from "../db.js";

// =====================================
// GET /books - Бүх номыг авах
// =====================================
export async function list(req, res) {
    // Хайх үг байгаа эсэхийг шалгах
    const q = req.query.q;

    // PostgreSQL database-аас ном авах
    const books = await prisma.book.findMany({
        where: typeof q === "string" && q.trim()
            ? {
                title: {
                    contains: q.trim(),
                    mode: "insensitive"
                }
            }
            : undefined,
        orderBy: { id: "asc" }
    });

    // Номын тоо болон жагсаалтыг буцаах
    res.json({
        count: books.length,
        data: books
    });
}

// =====================================
// GET /books/search?q=node - Ном хайх
// =====================================
export async function search(req, res) {
    const q = req.query.q;

    // Хайх үг оруулсан эсэхийг шалгах
    if (typeof q !== "string" || !q.trim()) {
        return res.status(400).json({
            message: "Search query is required"
        });
    }

    // Номын нэрээр database-аас хайх
    const books = await prisma.book.findMany({
        where: {
            title: {
                contains: q.trim(),
                mode: "insensitive"
            }
        },
        orderBy: { id: "asc" }
    });

    res.json({
        count: books.length,
        data: books
    });
}

// =====================================
// GET /books/:id - Нэг ном авах
// =====================================
export async function getOne(req, res) {
    // URL-аас номын ID авах
    const id = Number(req.params.id);

    // ID зөв эсэхийг шалгах
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    // ID-аар ном хайх
    const book = await prisma.book.findUnique({
        where: { id }
    });

    // Ном олдохгүй бол 404 буцаах
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Олдсон номыг буцаах
    res.json(book);
}

// =====================================
// POST /books - Шинэ ном нэмэх
// =====================================
export async function create(req, res) {
    // Хэрэглэгчээс ирсэн мэдээллийг авах
    const { title, price, author } = req.body ?? {};

    // Номын нэрийг шалгах
    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    // Номын үнийг шалгах
    if (!Number.isInteger(price) || price < 0) {
        return res.status(400).json({
            message: "Valid price is required"
        });
    }

    // Зохиогчийн нэрийг шалгах
    // author талбар заавал байх шаардлагагүй
    if (
        author !== undefined &&
        author !== null &&
        typeof author !== "string"
    ) {
        return res.status(400).json({
            message: "Invalid author"
        });
    }

    // PostgreSQL database-д ном нэмэх
    const book = await prisma.book.create({
        data: {
            title: title.trim(),
            price: price,
            author: typeof author === "string"
                ? author.trim()
                : null
        }
    });

    // Амжилттай нэмэгдсэн номыг буцаах
    res.status(201).json(book);
}

// =====================================
// PATCH /books/:id - Ном засах
// =====================================
export async function update(req, res) {
    // Засах номын ID авах
    const id = Number(req.params.id);

    // ID шалгах
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    // Шинэ мэдээллийг авах
    const { title, price, author, isAvailable } = req.body ?? {};

    // Өөрчлөх мэдээллийг хадгалах объект
    const changes = {};

    // Номын нэр өөрчлөх
    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Invalid title"
            });
        }

        changes.title = title.trim();
    }

    // Номын үнэ өөрчлөх
    if (price !== undefined) {
        if (!Number.isInteger(price) || price < 0) {
            return res.status(400).json({
                message: "Invalid price"
            });
        }

        changes.price = price;
    }

    // Зохиогчийн нэр өөрчлөх
    if (author !== undefined) {
        if (author !== null && typeof author !== "string") {
            return res.status(400).json({
                message: "Invalid author"
            });
        }

        changes.author = typeof author === "string"
            ? author.trim()
            : null;
    }

    // Ном байгаа эсэх мэдээллийг өөрчлөх
    if (isAvailable !== undefined) {
        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "Invalid availability"
            });
        }

        changes.isAvailable = isAvailable;
    }

    // Өөрчлөх мэдээлэл ирсэн эсэхийг шалгах
    if (Object.keys(changes).length === 0) {
        return res.status(400).json({
            message: "No valid fields to update"
        });
    }

    // Database-д ном байгаа эсэхийг шалгах
    const existing = await prisma.book.findUnique({
        where: { id }
    });

    if (!existing) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Номын мэдээллийг шинэчлэх
    try {
        const book = await prisma.book.update({
            where: { id },
            data: changes
        });

        res.json(book);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        throw error;
    }
}

// =====================================
// DELETE /books/:id - Ном устгах
// =====================================
export async function remove(req, res) {
    // Устгах номын ID авах
    const id = Number(req.params.id);

    // ID зөв эсэхийг шалгах
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    // Database-аас ном хайх
    const existing = await prisma.book.findUnique({
        where: { id }
    });

    // Ном байхгүй бол алдаа буцаах
    if (!existing) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Database-аас ном устгах
    try {
        await prisma.book.delete({
            where: { id }
        });

        // Амжилттай устгасан бол 204 буцаах
        res.status(204).send();
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        throw error;
    }
}
