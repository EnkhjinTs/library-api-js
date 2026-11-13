
 // API хүсэлт бүрийг терминал дээр харуулах
export function logger(req, res, next) {

    // Хүсэлт эхэлсэн хугацааг авах
    const start = Date.now();

    // Хариу дууссаны дараа ажиллана
    res.on("finish", () => {

        // Хүсэлтэд зарцуулсан хугацааг тооцоолох
        const ms = Date.now() - start;

        // Хүсэлтийн мэдээллийг терминал дээр хэвлэх
        console.log(
            `${req.method} ${req.url} ` +
            `${res.statusCode} ${ms}ms`
        );
    });

    // Дараагийн middleware эсвэл route руу шилжих
    next();
}
