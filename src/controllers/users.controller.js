
import {
    users,
    findUserById,
    findByEmail,
    addUser,
    updateUser,
    removeUser
} from "../data/users.js";

// Password талбарыг нуух функц
function safeUser(user) {
    const { password, ...result } = user;
    return result;
}

// GET - Бүх хэрэглэгчийг авах
export function list(req, res) {
    res.json(users.map(safeUser));
}

// GET - ID-аар хэрэглэгч хайх
export function getOne(req, res) {
    const id = Number(req.params.id);
    const user = findUserById(id);

    // Хэрэглэгч олдохгүй бол 404
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(safeUser(user));
}

// POST - Шинэ хэрэглэгч нэмэх
export function create(req, res) {
    const { name, email } = req.body ?? {};

    // Email оруулсан эсэхийг шалгах
    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
            message: "email is required"
        });
    }

    const cleanEmail = email.trim();

    // Email давхардсан эсэхийг шалгах
    if (findByEmail(cleanEmail)) {
        return res.status(409).json({
            message: "Email already exists"
        });
    }

    // Шинэ хэрэглэгч үүсгэх
    const user = addUser({
        name,
        email: cleanEmail
    });

    // 201 - Амжилттай нэмэгдсэн
    res.status(201).json(safeUser(user));
}

// PATCH - Хэрэглэгчийн мэдээлэл засах
export function update(req, res) {
    const id = Number(req.params.id);
    const changes = req.body ?? {};

    // Хэрэглэгч байгаа эсэхийг шалгах
    if (!findUserById(id)) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    // Email өөрчлөх үед давхардлыг шалгах
    if (changes.email !== undefined) {
        if (typeof changes.email !== "string" ||
            !changes.email.trim()) {
            return res.status(400).json({
                message: "Valid email is required"
            });
        }

        changes.email = changes.email.trim();

        const existing = findByEmail(changes.email);

        if (existing && existing.id !== id) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
    }

    // Хэрэглэгчийн мэдээллийг шинэчлэх
    const user = updateUser(id, changes);

    res.json(safeUser(user));
}

// DELETE - Хэрэглэгч устгах
export function remove(req, res) {
    const id = Number(req.params.id);

    const ok = removeUser(id);

    // Хэрэглэгч олдохгүй бол 404
    if (!ok) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    // Амжилттай устгасан
    res.status(204).send();
}
