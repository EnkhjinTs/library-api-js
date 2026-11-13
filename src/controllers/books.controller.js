
import {
    books,
    findBookById,
    searchByTitle,
    addBook,
    updateBook,
    removeBook
} from "../data/books.js";

// GET - Бүх номыг авах эсвэл нэрээр хайх
export function list(req, res) {
    const q = req.query.q;

    const result = typeof q === "string" && q
        ? searchByTitle(q)
        : books;

    res.json({
        count: result.length,
        data: result
    });
}

// GET - ID-аар нэг ном авах
export function getOne(req, res) {
    const id = Number(req.params.id);

    const book = findBookById(id);

    // Ном олдохгүй бол 404 буцаах
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
}

// POST - Шинэ ном нэмэх
export function create(req, res) {
    const { title, price } = req.body ?? {};

    // Номын нэр заавал байх ёстой
    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "title is required"
        });
    }

    const book = addBook({
        title: title.trim(),
        price
    });

    // 201 - Шинэ ном амжилттай нэмэгдсэн
    res.status(201).json(book);
}

// PATCH - Номын мэдээлэл засах
export function update(req, res) {
    const id = Number(req.params.id);

    const updated = updateBook(id, req.body ?? {});

    // Ном байхгүй бол 404 буцаах
    if (!updated) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(updated);
}

// DELETE - Ном устгах
export function remove(req, res) {
    const id = Number(req.params.id);

    const ok = removeBook(id);

    // Ном олдохгүй бол 404 буцаах
    if (!ok) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // 204 - Амжилттай устгасан
    res.status(204).send();
}
