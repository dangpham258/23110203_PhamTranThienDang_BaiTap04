require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const white_lists = [
        "/",
        "/register",
        "/login",
        "/forgot-password",
        "/reset-password",
        "/home",
        "/search",
    ];
    const urlPath = req.originalUrl.split("?")[0];
    const isPublicRoute = white_lists.some(
        (item) => urlPath === `/v1/api${item}` || urlPath === item,
    );
    const isPublicProductDetail =
        req.method === "GET" && /^\/v1\/api\/products\/[^/]+$/.test(urlPath);

    if (isPublicRoute || isPublicProductDetail) {
        next();
    } else {
        if (req?.headers?.authorization?.split(" ")?.[1]) {
            const token = req.headers.authorization.split(" ")[1];
            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role,
                };
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token bị hết hạn/hoặc không hợp lệ",
                });
            }
        } else {
            return res.status(401).json({
                message:
                    "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn",
            });
        }
    }
};

module.exports = auth;
