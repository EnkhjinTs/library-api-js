
import { prisma } from "../src/db.js";

// Семинар 6 - Зохиогчийн жишээ өгөгдөл нэмэх
async function main() {

    // Бат зохиогчийг үүсгэх эсвэл байгаа бол авах
    const bat = await prisma.author.upsert({
        where: { email: "bat@mail.mn" },
        update: {},
        create: {
            name: "Бат",
            email: "bat@mail.mn"
        }
    });

    // Сараа зохиогчийг үүсгэх эсвэл байгаа бол авах
    const saraa = await prisma.author.upsert({
        where: { email: "saraa@mail.mn" },
        update: {},
        create: {
            name: "Сараа",
            email: "saraa@mail.mn"
        }
    });

    // Өмнөх номуудыг database-аас авах
    const books = await prisma.book.findMany({
        orderBy: { id: "asc" }
    });

    // Өмнөх номуудыг устгахгүйгээр зохиогчтой холбох
    for (let i = 0; i < books.length; i++) {

        // Эхний 2 номыг Баттай, бусдыг Сараатай холбох
        const authorId = i < 2 ? bat.id : saraa.id;

        // Зөвхөн зохиогчгүй номыг шинэчлэх
        if (books[i].authorId === null) {
            await prisma.book.update({
                where: { id: books[i].id },
                data: { authorId }
            });
        }
    }

    console.log("Зохиогчид амжилттай нэмэгдлээ!");
    console.log("Өмнөх номууд зохиогчидтой холбогдлоо!");
}

// Үндсэн функцийг ажиллуулах
main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
