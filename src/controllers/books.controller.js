
import { prisma } from "../db.js";

// GET /books
// Бүх номыг зохиогчийн мэдээлэлтэй авах
export async function list(req, res) {

    // Хайлтын үг авах
    const q = req.query.q;

    // Номуудыг database-аас авах
    const books = await prisma.book.findMany({
        where: typeof q === "string" && q.trim()
            ? {
                title: {
                    contains: q.trim(),
                    mode: "insensitive"
                }
            }
            : undefined,

        // Зохиогчийн мэдээллийг хамт авах
        include: {
            author: true
        },

        // ID-аар эрэмбэлэх
        orderBy: { id: "asc" }
    });

    // Номын тоо болон мэдээллийг буцаах
    res.json({
        count: books.length,
        data: books
    });
}

// GET /books/search?q=node
// Номын нэрээр хайх
export async function search(req, res) {

    // Хайлтын үг авах
    const q = req.query.q;

    // Хайлтын үг хоосон эсэхийг шалгах
    if (typeof q !== "string" || !q.trim()) {
        return res.status(400).json({
            message: "Search query is required"
        });
    }

    // Ном хайх
    const books = await prisma.book.findMany({
        where: {
            title: {
                contains: q.trim(),
                mode: "insensitive"
            }
        },

        // Зохиогчийг хамт авах
        include: {
            author: true
        },

        orderBy: { id: "asc" }
    });

    res.json({
        count: books.length,
        data: books
    });
}

// GET /books/:id
// Нэг номыг зохиогчтой нь авах
export async function getOne(req, res) {

    // URL-аас номын ID авах
    const id = Number(req.params.id);

    // ID зөв эсэхийг шалгах
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    // Номыг зохиогчийн хамт хайх
    const book = await prisma.book.findUnique({
        where: { id },

        include: {
            author: true
        }
    });

    // Ном олдохгүй бол 404 буцаах
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Номын мэдээллийг буцаах
    res.json(book);
}

// POST /books
// Шинэ ном нэмэх
export async function create(req, res) {

    // Хэрэглэгчийн оруулсан мэдээлэл
    const { title, price, authorId } = req.body ?? {};

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

    // Зохиогчийн ID шалгах
    if (!Number.isInteger(authorId) || authorId <= 0) {
        return res.status(400).json({
            message: "Valid authorId is required"
        });
    }

    try {
        // Шинэ номыг зохиогчтой холбож хадгалах
        const book = await prisma.book.create({
            data: {
                title: title.trim(),
                price: price,

                // Зохиогчийн ID-г холбох
                authorId: authorId
            },

            // Хариунд зохиогчийг хамт харуулах
            include: {
                author: true
            }
        });

        // Амжилттай нэмэгдсэн бол 201
        res.status(201).json(book);

    } catch (error) {

        // Байхгүй зохиогчийн ID оруулсан бол
        if (error.code === "P2003" || error.code === "P2025") {
            return res.status(400).json({
                message: "Author not found"
            });
        }

        throw error;
    }
}

// PATCH /books/:id
// Номын мэдээлэл засах
export async function update(req, res) {

    // URL-аас номын ID авах
    const id = Number(req.params.id);

    // ID зөв эсэхийг шалгах
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    // Засах мэдээллийг авах
    const { title, price, authorId, isAvailable } = req.body ?? {};

    // Өөрчлөлтүүдийг хадгалах объект
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

    // Зохиогч өөрчлөх
    if (authorId !== undefined) {
        if (!Number.isInteger(authorId) || authorId <= 0) {
            return res.status(400).json({
                message: "Invalid authorId"
            });
        }

        changes.authorId = authorId;
    }

    // Ном байгаа эсэхийг өөрчлөх
    if (isAvailable !== undefined) {
        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "Invalid availability"
            });
        }

        changes.isAvailable = isAvailable;
    }

    // Засах мэдээлэл ирээгүй бол
    if (Object.keys(changes).length === 0) {
        return res.status(400).json({
            message: "No valid fields to update"
        });
    }

    // Ном байгаа эсэхийг шалгах
    const existing = await prisma.book.findUnique({
        where: { id }
    });

    if (!existing) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    try {
        // Номын мэдээллийг шинэчлэх
        const book = await prisma.book.update({
            where: { id },
            data: changes,

            include: {
                author: true
            }
        });

        // Шинэчлэгдсэн номыг буцаах
        res.json(book);

    } catch (error) {

        // Ном устсан эсвэл олдохгүй бол
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Байхгүй зохиогчийн ID бол
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "Author not found"
            });
        }

        throw error;
    }
}

// DELETE /books/:id
// Ном устгах
export async function remove(req, res) {

    // URL-аас номын ID авах
    const id = Number(req.params.id);

    // ID зөв эсэхийг шалгах
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    // Ном байгаа эсэхийг шалгах
    const existing = await prisma.book.findUnique({
        where: { id }
    });

    if (!existing) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    try {
        // Номыг database-аас устгах
        await prisma.book.delete({
            where: { id }
        });

        // Амжилттай устгасан бол 204
        res.status(204).send();

    } catch (error) {

        // Ном олдохгүй бол
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        throw error;
    }
}
