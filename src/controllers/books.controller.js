
import { prisma } from "../db.js";

// ===================================================
// СЕМИНАР 9 — НОМ ШҮҮХ ФУНКЦ
// ===================================================

function buildWhere(query) {
    const where = {};

    // 1. Зохиолчийн ID-аар шүүх
    if (query.authorId !== undefined) {
        const id = Number(query.authorId);

        if (
            typeof query.authorId !== "string" ||
            !query.authorId.trim() ||
            !Number.isInteger(id) ||
            id <= 0
        ) {
            throw {
                status: 400,
                message: "authorId зөв тоо байх ёстой"
            };
        }

        where.authorId = id;
    }

    // 2. Ном боломжтой эсэхээр шүүх
    if (query.available !== undefined) {
        if (
            query.available !== "true" &&
            query.available !== "false"
        ) {
            throw {
                status: 400,
                message: "available true эсвэл false байх ёстой"
            };
        }

        where.isAvailable = query.available === "true";
    }

    // 3. Номын нэрээр хайх
    if (query.q !== undefined) {
        if (typeof query.q !== "string") {
            throw {
                status: 400,
                message: "q текст байх ёстой"
            };
        }

        if (query.q.trim()) {
            where.title = {
                contains: query.q.trim(),
                mode: "insensitive"
            };
        }
    }

    // 4. Зохиолчийн нэрээр хайх
    if (query.author !== undefined) {
        if (typeof query.author !== "string") {
            throw {
                status: 400,
                message: "author текст байх ёстой"
            };
        }

        if (query.author.trim()) {
            where.author = {
                name: {
                    contains: query.author.trim(),
                    mode: "insensitive"
                }
            };
        }
    }

    // 5. Үнийн хүрээгээр шүүх
    const price = {};

    if (query.minPrice !== undefined) {
        const min = Number(query.minPrice);

        if (
            typeof query.minPrice !== "string" ||
            !query.minPrice.trim() ||
            !Number.isFinite(min) ||
            min < 0
        ) {
            throw {
                status: 400,
                message: "minPrice зөв тоо байх ёстой"
            };
        }

        price.gte = min;
    }

    if (query.maxPrice !== undefined) {
        const max = Number(query.maxPrice);

        if (
            typeof query.maxPrice !== "string" ||
            !query.maxPrice.trim() ||
            !Number.isFinite(max) ||
            max < 0
        ) {
            throw {
                status: 400,
                message: "maxPrice зөв тоо байх ёстой"
            };
        }

        price.lte = max;
    }

    // Доод үнэ дээд үнээс их байж болохгүй
    if (
        price.gte !== undefined &&
        price.lte !== undefined &&
        price.gte > price.lte
    ) {
        throw {
            status: 400,
            message: "minPrice maxPrice-аас их байж болохгүй"
        };
    }

    if (Object.keys(price).length > 0) {
        where.price = price;
    }

    // 6. БИЕ ДААЛТ — Олон номын ID-аар шүүх
    // Жишээ: GET /books?ids=1,3,5
    if (query.ids !== undefined) {
        if (
            typeof query.ids !== "string" ||
            !query.ids.trim()
        ) {
            throw {
                status: 400,
                message: "ids хоосон байж болохгүй"
            };
        }

        const ids = query.ids.split(",").map(value => {
            const part = value.trim();
            return part === "" ? NaN : Number(part);
        });

        if (
            ids.some(id =>
                !Number.isInteger(id) || id <= 0
            )
        ) {
            throw {
                status: 400,
                message: "ids зөв бүхэл тоонууд байх ёстой"
            };
        }

        where.id = {
            in: ids
        };
    }

    return where;
}

// ===================================================
// СЕМИНАР 9 — НОМ ЭРЭМБЭЛЭХ ФУНКЦ
// ===================================================

function buildOrderBy(query) {
    const allowed = ["title", "price", "createdAt"];

    // Анхдагч эрэмбэлэлт
    let sort = typeof query.sort === "string"
        ? query.sort
        : "createdAt";

    let order = query.order === "asc" ? "asc" : "desc";

    // Бие даалт: ?sort=-price
    if (sort.startsWith("-")) {
        sort = sort.slice(1);
        order = "desc";
    }

    // Бие даалт: ?sort=+price
    else if (sort.startsWith("+")) {
        sort = sort.slice(1);
        order = "asc";
    }

    // Зөвшөөрөгдөөгүй талбар бол анхдагч утга
    if (!allowed.includes(sort)) {
        sort = "createdAt";
        order = "desc";
    }

    return {
        [sort]: order
    };
}

// ===================================================
// GET /books
// СЕМИНАР 9 — ШҮҮЛТҮҮР, ХАЙЛТ, ЭРЭМБЭЛЭЛТ
// ===================================================

export async function list(req, res) {
    try {
        // Query параметрүүдээр шүүх нөхцөл
        const where = buildWhere(req.query);

        // Эрэмбэлэх нөхцөл
        const orderBy = buildOrderBy(req.query);

        // Номуудыг database-аас авах
        const books = await prisma.book.findMany({
            where,

            // Зохиогчийн мэдээллийг хамт авах
            include: {
                author: true
            },

            orderBy
        });

        // Номын тоо болон мэдээлэл буцаах
        res.json({
            count: books.length,
            data: books
        });

    } catch (error) {
        // Буруу query параметр
        if (error.status === 400) {
            return res.status(400).json({
                message: error.message
            });
        }

        // Бусад алдааг middleware рүү дамжуулах
        throw error;
    }
}

// ===================================================
// GET /books/search?q=node
// СЕМИНАР 1–6 — НОМЫН НЭРЭЭР ХАЙХ
// ===================================================

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

// ===================================================
// GET /books/:id
// СЕМИНАР 1–6 — НЭГ НОМ АВАХ
// ===================================================

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

// ===================================================
// POST /books
// СЕМИНАР 1–6 — ШИНЭ НОМ НЭМЭХ
// ===================================================

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

// ===================================================
// PATCH /books/:id
// СЕМИНАР 1–6 — НОМЫН МЭДЭЭЛЭЛ ЗАСАХ
// ===================================================

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

    // Ном боломжтой эсэхийг өөрчлөх
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

// ===================================================
// DELETE /books/:id
// СЕМИНАР 1–6 — НОМ УСТГАХ
// ===================================================

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
