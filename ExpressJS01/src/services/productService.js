const Product = require("../models/product");

const getHomepageDataService = async () => {
    try {
        const promotions = await Product.find({ tags: "promotion" })
            .sort({ sales: -1 })
            .limit(4);
        const newest = await Product.find().sort({ createdAt: -1 }).limit(4);
        const bestSellers = await Product.find().sort({ sales: -1 }).limit(4);

        return {
            EC: 0,
            promotions,
            newest,
            bestSellers,
        };
    } catch (error) {
        console.error("getHomepageDataService error:", error);
        return {
            EC: 1,
            EM: "Không thể lấy dữ liệu homepage",
        };
    }
};

module.exports = {
    getHomepageDataService,
};
