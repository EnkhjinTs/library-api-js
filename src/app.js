
import express from "express";

// Express сервер үүсгэх
const app = express();

// Серверийн порт
const PORT = 4000;//PORT нь сервер ямар дугаартай портоор хүсэлт хүлээн авахыг заадаг. Бид 3000 портыг 4000 болгож өөрчилсөн.//

// Үндсэн хуудасны GET route
app.get("/", (req, res) => {
    res.json({
        message: "Library API",
        version: "1.0.0"
    });
});

 // Сервер ажиллаж байгаа эсэхийг шалгах
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime()
    });
});

 // Хэрэглэгчийн мэдээлэл буцаах
app.get("/profile", (req, res) => {
    res.json({
        name: "Bat",
        role: "USER",
        email: "bat@example.com"
    });
});

 // Номын мэдээллийг ID-аар авах
app.get("/books/:id", (req, res) => {

    // URL-аас номын ID-г авч тоо болгох
    const id = Number(req.params.id);

    // Номын мэдээллийг JSON хэлбэрээр буцаах
    res.json({
        id: id,
        title: "Node.js Basics"
    });
});

 // Төслийн тухай мэдээлэл буцаах
app.get("/about", (req, res) => {
    res.json({
        project: "Library API",
        version: "1.0.0",
        author: "Student"
    });
});///about endpoint нь төслийн нэр, хувилбар болон зохиогчийн мэдээллийг JSON хэлбэрээр буцаадаг.//

 // 3 оюутны мэдээлэл буцаах
app.get("/students", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Bat",
            age: 20
        },
        {
            id: 2,
            name: "Bold",
            age: 21
        },
        {
            id: 3,
            name: "Saraa",
            age: 19
        }
    ]);
});//students нь 3 оюутны мэдээллийг массив (array) хэлбэрээр JSON болгон буцаадаг GET endpoint юм.//

 // 2 хичээлийн мэдээлэл буцаах
app.get("/courses", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Backend Programming"
        },
        {
            id: 2,
            name: "Web Development"
        }
    ]);
});//courses endpoint нь хоёр хичээлийн мэдээллийг массив хэлбэрээр JSON болгон буцаадаг. Хичээл бүр id болон name гэсэн талбартай.//

// Серверийг асаах
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
//Express API дээр дөрвөн GET endpoint үүсгэж, хөтөчөөр шалгасан. Байгаа endpoint-ууд 200 OK, байхгүй endpoint 404 Not Found хариу буцааж байгааг туршсан.//
