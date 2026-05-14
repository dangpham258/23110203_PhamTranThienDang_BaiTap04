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

const getProductDetailService = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                EC: 1,
                EM: "Sản phẩm không tồn tại",
            };
        }

        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
        })
            .sort({ sales: -1 })
            .limit(4);

        return {
            EC: 0,
            product,
            similarProducts,
        };
    } catch (error) {
        console.error("getProductDetailService error:", error);
        return {
            EC: 1,
            EM: "Không thể lấy chi tiết sản phẩm",
        };
    }
};

const getAdminProductListService = async () => {
    try {
        const products = await Product.find().sort({ stock: 1, sales: -1 });
        const lowStockCount = products.filter(
            (product) => product.stock <= 10,
        ).length;
        const totalSales = products.reduce(
            (sum, product) => sum + product.sales,
            0,
        );

        return {
            EC: 0,
            products,
            lowStockCount,
            totalSales,
        };
    } catch (error) {
        console.error("getAdminProductListService error:", error);
        return {
            EC: 1,
            EM: "Không thể lấy dữ liệu sản phẩm admin",
        };
    }
};

const updateProductStockService = async (productId, delta) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                EC: 1,
                EM: "Sản phẩm không tồn tại",
            };
        }
        const quantityChange = Number(delta) || 0;
        const newStock = product.stock + quantityChange;
        if (newStock < 0) {
            return {
                EC: 1,
                EM: "Số lượng không thể âm",
            };
        }
        product.stock = newStock;
        await product.save();

        return {
            EC: 0,
            product,
        };
    } catch (error) {
        console.error("updateProductStockService error:", error);
        return {
            EC: 1,
            EM: "Không thể cập nhật số lượng tồn kho",
        };
    }
};

module.exports = {
    getHomepageDataService,
    getProductDetailService,
    getAdminProductListService,
    updateProductStockService,
};
