
 // Номын object үүсгэх
const book = {
    id: 1,
    title: "Node.js Basics",
    author: "Bat",
    price: 45000,
    isAvailable: true
};

// Номын нэрийг хоёр аргаар унших
console.log(book.title);
console.log(book["title"]);

// Байхгүй талбарыг унших
console.log(book.isbn);

// Үнийг өөрчлөх
book.price = 50000;

console.log(book.price);
