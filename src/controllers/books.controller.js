
import {
    books,
    findBookById,
    searchByTitle,
    addBook,
    updateBook,
    removeBook
} from "../data/books.js";

// GET /books - Бүх номыг авах
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

// GET /books/search - Нэрээр ном хайх
export function search(req, res) {
    const q = req.query.q;

    // Хайх үг оруулаагүй бол 400 буцаах
    if (typeof q !== "string" || !q.trim()) {
        return res.status(400).json({
            message: "Search query is required"
        });
    }

    const result = searchByTitle(q);

    res.json({
        count: result.length,
        data: result
    });
}

// GET /books/:id - ID-аар ном авах
export function getOne(req, res) {
    // URL-аас ирсэн ID-г тоо болгох
    const id = Number(req.params.id);

    const book = findBookById(id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
}

// POST /books - Шинэ ном нэмэх
export function create(req, res) {
    const { title, price } = req.body ?? {};

    // Номын нэрийг шалгах
    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "title is required"
        });
    }

    const book = addBook({
        title: title.trim(),
        price
    });

    res.status(201).json(book);
}

// PATCH /books/:id - Номын мэдээлэл засах
export function update(req, res) {
    const id = Number(req.params.id);

    const updated = updateBook(id, req.body ?? {});

    if (!updated) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(updated);
}

// DELETE /books/:id - Ном устгах
export function remove(req, res) {
    const id = Number(req.params.id);

    const ok = removeBook(id);

    if (!ok) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(204).send();
}
