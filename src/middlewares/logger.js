
// Logger middleware
// API руу ирсэн хүсэлт бүрийг терминалд харуулна

export function logger(req, res, next) {

    // Хүсэлтийн арга болон URL-г хэвлэх
    console.log(`${req.method} ${req.url}`);

    // Дараагийн middleware рүү шилжих
    next();
}
