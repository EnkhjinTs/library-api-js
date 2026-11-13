
 // Номын массив
const books = [
    { id: 1, title: "Node.js Basics", price: 45000, isAvailable: true },
    { id: 2, title: "Express", price: 52000, isAvailable: true },
    { id: 3, title: "Prisma", price: 61000, isAvailable: false },
    { id: 4, title: "JavaScript", price: 39000, isAvailable: true }
];

// 50000-аас хямд номнууд
const cheap = books.filter(
    (book) => book.price < 50000
);

// Байгаа номнууд
const available = books.filter(
    (book) => book.isAvailable === true
);

// ID нь 3 гэсэн ном
const book3 = books.find(
    (book) => book.id === 3
);

// Байхгүй ID хайх
const book99 = books.find(
    (book) => book.id === 99
);

console.log("Хямд номнууд:", cheap);
console.log("Байгаа номнууд:", available);
console.log("ID 3 ном:", book3);
console.log("ID 99 ном:", book99 ?? "not found");
