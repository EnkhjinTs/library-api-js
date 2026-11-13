
 // Номын мэдээлэл
export const books = [
    { id: 1, title: "Node", price: 45000, isAvailable: true },
    { id: 2, title: "Express", price: 52000, isAvailable: true },
    { id: 3, title: "Prisma", price: 61000, isAvailable: false }
];

// Шинэ номын ID
let nextId = 4;

// ID-аар ном хайх
export function findBookById(id) {
    return books.find(book => book.id === id);
}

// Нэрээр ном хайх
export function searchByTitle(keyword) {
    return books.filter(book =>
        book.title.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Боломжтой номын тоог олох
export function countAvailable() {
    return books.filter(book => book.isAvailable).length;
}

// Шинэ ном нэмэх
export function addBook(input) {
    const book = {
        id: nextId++,
        isAvailable: true,
        ...input
    };

    books.push(book);
    return book;
}

// Номын мэдээлэл засах
export function updateBook(id, changes) {
    const book = findBookById(id);

    if (!book) return null;

    const { title, price, isAvailable } = changes;

    if (title !== undefined) book.title = title;
    if (price !== undefined) book.price = price;
    if (isAvailable !== undefined) {
        book.isAvailable = isAvailable;
    }

    return book;
}

// Ном устгах
export function removeBook(id) {
    const index = books.findIndex(book => book.id === id);

    if (index === -1) return false;

    books.splice(index, 1);
    return true;
}

// Өгөгдлийн сангаас ном авч байгааг дуурайлгах
export function getBooksFromDb() {
    return new Promise(resolve => {
        setTimeout(() => resolve(books), 500);
    });
}

// Ном олдохгүй бол алдаа үүсгэх
export function getBookOrThrow(id) {
    const book = findBookById(id);

    if (!book) throw new Error("Book not found");

    return book;
}
