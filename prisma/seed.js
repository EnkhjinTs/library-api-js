
import { prisma } from "../src/db.js";

// ===================================================
// СЕМИНАР 9 — ТУРШИЛТЫН ӨГӨГДӨЛ
// Өмнөх Семинар 6-ийн өгөгдлийг хадгална
// ===================================================

async function main() {

    // 1. БАТ зохиолч
    const bat = await prisma.author.upsert({
        where: { email: "bat@mail.mn" },
        update: {},
        create: {
            name: "Бат",
            email: "bat@mail.mn"
        }
    });

    // 2. САРАА зохиолч
    const saraa = await prisma.author.upsert({
        where: { email: "saraa@mail.mn" },
        update: {},
        create: {
            name: "Сараа",
            email: "saraa@mail.mn"
        }
    });

    // 3. БОЛД зохиолч — Семинар 9
    const bold = await prisma.author.upsert({
        where: { email: "bold@mail.mn" },
        update: {},
        create: {
            name: "Болд",
            email: "bold@mail.mn"
        }
    });

    console.log("3 зохиолч бэлэн боллоо!");

    // Өмнөх номуудыг авах
    const books = await prisma.book.findMany({
        orderBy: { id: "asc" }
    });

    // Өмнөх зохиолчгүй номуудыг холбох
    for (let i = 0; i < books.length; i++) {

        const authorId = i < 2 ? bat.id : saraa.id;

        if (books[i].authorId === null) {
            await prisma.book.update({
                where: { id: books[i].id },
                data: { authorId }
            });
        }
    }

    console.log("Өмнөх номууд хадгалагдлаа!");

    // ===================================================
    // СЕМИНАР 9 — 6 ШИНЭ НОМ
    // ===================================================

    const newBooks = [
        {
            title: "Node.js Testing",
            price: 58000,
            authorId: bat.id,
            isAvailable: true
        },
        {
            title: "REST API Design",
            price: 39000,
            authorId: saraa.id,
            isAvailable: false
        },
        {
            title: "SQL Joins",
            price: 27000,
            authorId: saraa.id,
            isAvailable: true
        },
        {
            title: "Express Security",
            price: 66000,
            authorId: bold.id,
            isAvailable: true
        },
        {
            title: "Prisma Relations",
            price: 48000,
            authorId: bold.id,
            isAvailable: true
        },
        {
            title: "Node Streams",
            price: 72000,
            authorId: bold.id,
            isAvailable: false
        }
    ];

    // Ижил нэр, зохиолчтой ном давхар нэмэхгүй
    for (const book of newBooks) {

        const existing = await prisma.book.findFirst({
            where: {
                title: book.title,
                authorId: book.authorId
            }
        });

        if (!existing) {
            await prisma.book.create({
                data: book
            });

            console.log("Ном нэмэгдлээ:", book.title);
        } else {
            console.log("Өмнө нь байсан:", book.title);
        }
    }

    // Нийт зохиолчийн тоо
    const authorCount = await prisma.author.count();

    // Нийт номын тоо
    const bookCount = await prisma.book.count();

    console.log("---------------------------");
    console.log("Нийт зохиолч:", authorCount);
    console.log("Нийт ном:", bookCount);
    console.log("Семинар 9 seed амжилттай!");
}

// Үндсэн функцийг ажиллуулах
main()
    .catch((error) => {
        console.error("Seed алдаа:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
