const Product = require("../models/product");
const Category = require("../models/category");

const getHomepageDataService = async () => {
    try {
        const promotions = await Product.find({ tags: "promotion" })
            .sort({ sales: -1 })
            .limit(4)
            .populate("category");
        const newest = await Product.find()
            .sort({ createdAt: -1 })
            .limit(4)
            .populate("category");
        const bestSellers = await Product.find()
            .sort({ sales: -1 })
            .limit(4)
            .populate("category");

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
        const product = await Product.findById(productId).populate("category");
        if (!product) {
            return {
                EC: 1,
                EM: "Sản phẩm không tồn tại",
            };
        }

        const similarProducts = await Product.find({
            category: product.category._id,
            _id: { $ne: product._id },
        })
            .sort({ sales: -1 })
            .limit(4)
            .populate("category");

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
        const products = await Product.find()
            .sort({ stock: 1, sales: -1 })
            .populate("category");
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

const searchProductsService = async (query = "", filters = {}) => {
    try {
        const searchConditions = {};

        if (query && query.trim()) {
            searchConditions.$or = [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } },
            ];
        }

        if (filters.brand && filters.brand.trim()) {
            searchConditions.brand = filters.brand;
        }

        if (filters.category && filters.category.trim()) {
            searchConditions.category = filters.category;
        }

        const rangeConditions = { ...searchConditions };
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            searchConditions.price = {
                $gte: Number(filters.minPrice),
                $lte: Number(filters.maxPrice),
            };
        }

        let sortOption = { createdAt: -1 };
        if (filters.sort) {
            if (filters.sort === "price_asc") {
                sortOption = { price: 1 };
            } else if (filters.sort === "price_desc") {
                sortOption = { price: -1 };
            } else if (filters.sort === "sales_desc") {
                sortOption = { sales: -1 };
            } else if (filters.sort === "new") {
                sortOption = { createdAt: -1 };
            }
        }

        const products = await Product.find(searchConditions)
            .sort(sortOption)
            .populate("category")
            .lean();

        const distinctBrands = await Product.distinct("brand");
        const categoryDocs = await Category.find().sort({ name: 1 }).lean();

        const priceStats = await Product.aggregate([
            { $match: rangeConditions },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
        ]);

        const priceRange =
            priceStats.length > 0
                ? {
                      min: priceStats[0].minPrice,
                      max: priceStats[0].maxPrice,
                  }
                : { min: 0, max: 0 };

        return {
            EC: 0,
            products,
            brands: distinctBrands,
            categories: categoryDocs.map((item) => ({
                _id: item._id,
                name: item.name,
            })),
            priceRange,
            count: products.length,
        };
    } catch (error) {
        console.error("searchProductsService error:", error);
        return {
            EC: 1,
            EM: "Không thể tìm kiếm sản phẩm",
        };
    }
};

module.exports = {
    getHomepageDataService,
    getProductDetailService,
    getAdminProductListService,
    updateProductStockService,
    searchProductsService,
};
