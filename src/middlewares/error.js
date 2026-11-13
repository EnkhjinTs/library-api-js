
 // API хаяг олдохгүй үед ажиллах middleware
export function notFound(req, res) {

    // 404 - Хүссэн API хаяг байхгүй
    res.status(404).json({
        message: "Route not found",
        path: req.url
    });
}

// Серверийн алдааг боловсруулах middleware
export function errorHandler(error, req, res, next) {

    // Алдааны мэдээллийг терминал дээр харуулах
    console.error(error);

    // JSON буруу бичигдсэн үед 400 буцаах
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            message: "Invalid JSON"
        });
    }

    // Бусад серверийн алдаанд 500 буцаах
    res.status(500).json({
        message: "Internal server error"
    });
}
