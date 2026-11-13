
 // Номын мэдээлэлтэй массив
export const books = [
    {
        id: 1,
        title: "Node",
        price: 45000,
        isAvailable: true
    },
    {
        id: 2,
        title: "Express",
        price: 52000,
        isAvailable: true
    },
    {
        id: 3,
        title: "Prisma",
        price: 61000,
        isAvailable: false
    }
];

// ID-аар ном хайх
export function findBookById(id) {
    return books.find((book) => book.id === id);
}

// Нэрээр ном хайх
export function searchByTitle(keyword) {
    return books.filter((book) =>
        book.title.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Байгаа номын тоог олох
export function countAvailable() {
    return books.filter(
        (book) => book.isAvailable
    ).length;
}

// Өгөгдлийн сангийн үйлдлийг дуурайлгах
export function getBooksFromDb() {
    return new Promise((resolve) => {
        // 0.5 секунд хүлээх
        setTimeout(() => {
            resolve(books);
        }, 500);
    });
}

// Ном байхгүй бол алдаа үүсгэх
export function getBookOrThrow(id) {
    const book = findBookById(id);

    if (!book) {
        throw new Error("Book not found");
    }

    return book;
}
