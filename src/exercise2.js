
 // 4 номын массив
const books = [
    { id: 1, title: "Node.js Basics", price: 45000, isAvailable: true },
    { id: 2, title: "Express", price: 52000, isAvailable: true },
    { id: 3, title: "Prisma", price: 61000, isAvailable: false },
    { id: 4, title: "JavaScript", price: 39000, isAvailable: true }
];

// Зөвхөн нэрсийг авах
const titles = books.map((book) => book.title);

// Нэр болон үнийг нэг текст болгох
const labels = books.map(
    (book) => `${book.title} — ${book.price}`
);

// Үр дүнг хэвлэх
console.log(titles);
console.log(labels);

// Нийт номын тоо
console.log(books.length);
