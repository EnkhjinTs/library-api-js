
 // Номын массив
const books = [
    { id: 1, title: "Node.js Basics", price: 45000, isAvailable: true },
    { id: 2, title: "Express", price: 52000, isAvailable: true },
    { id: 3, title: "Prisma", price: 61000, isAvailable: false }
];

// 1. Хоёр тоо нэмэх
function sum(a, b) {
    return a + b;
}

// 2. Ном үнэтэй эсэхийг шалгах
function isExpensive(book) {
    return book.price > 50000;
}

// 3. Номын нэрсийг авах
function getTitles(books) {
    return books.map((book) => book.title);
}

// 4. Боломжтой номын тоог олох
function countAvailable(books) {
    return books.filter(
        (book) => book.isAvailable
    ).length;
}

// 5. Үнийг форматлах
const formatPrice = (price) => `${price}₮`;

// Функцүүдийг шалгах
console.log("Нийлбэр:", sum(10, 20));
console.log("Үнэтэй ном:", isExpensive(books[1]));
console.log("Номын нэрс:", getTitles(books));
console.log("Байгаа ном:", countAvailable(books));
console.log("Үнэ:", formatPrice(45000));
