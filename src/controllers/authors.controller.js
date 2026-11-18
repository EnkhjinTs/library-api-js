
import { prisma } from "../db.js";

// ===================================================
// ID ЗӨВ ЭСЭХИЙГ ШАЛГАХ ТУСЛАХ ФУНКЦ
// ===================================================

function validId(id) {
    return Number.isInteger(id) && id > 0;
}

// ===================================================
// GET /authors
// СЕМИНАР 9 — ЗОХИОГЧИЙН НЭРЭЭР ХАЙХ
// ===================================================

export async function getAuthors(req, res) {

    // URL-аас хайлтын үг авах
    const q = req.query.q;

    // Хайлтын параметр зөв эсэхийг шалгах
    if (q !== undefined && typeof q !== "string") {
        return res.status(400).json({
            message: "Search query must be a string"
        });
    }

    // Хайлтын нөхцөл үүсгэх
    const where = q && q.trim()
        ? {
            name: {
                contains: q.trim(),
                mode: "insensitive"
            }
        }
        : {};

    // Зохиогчдыг database-аас хайх
    const authors = await prisma.author.findMany({
        where,

        // Зохиогч бүрийн номын тоог авах
        include: {
            _count: {
                select: {
                    books: true
                }
            }
        },

        // ID-аар эрэмбэлэх
        orderBy: {
            id: "asc"
        }
    });

    // Нийт тоо болон мэдээллийг буцаах
    res.json({
        count: authors.length,
        data: authors
    });
}

// ===================================================
// GET /authors/:id
// НЭГ ЗОХИОГЧИЙН МЭДЭЭЛЭЛ АВАХ
// ===================================================

export async function getAuthor(req, res) {

    // URL-аас ID авах
    const id = Number(req.params.id);

    // ID зөв эсэхийг шалгах
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

// ===================================================
// POST /authors
// ШИНЭ ЗОХИОГЧ НЭМЭХ
// ===================================================

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

        // Амжилттай үүссэн бол 201
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

// ===================================================
// GET /authors/:id/books
// ЗОХИОГЧИЙН БҮХ НОМЫГ АВАХ
// ===================================================

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
        include: {
            books: true
        }
    });

    // Зохиогч олдохгүй бол
    if (!author) {
        return res.status(404).json({
            message: "Author not found"
        });
    }

    // Зохиогчийн бүх номыг буцаах
    res.json(author.books);
}

// ===================================================
// POST /authors/:id/books
// ТУХАЙН ЗОХИОГЧИД ШИНЭ НОМ НЭМЭХ
// ===================================================

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

            // Зохиогчийн мэдээллийг хамт авах
            include: {
                author: true
            }
        });

        // Амжилттай нэмэгдсэн бол 201
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

// ===================================================
// DELETE /authors/:id
// ЗОХИОГЧ УСТГАХ
// ===================================================

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
                select: {
                    books: true
                }
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

        // Устгахын өмнө ном нэмэгдсэн бол
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
