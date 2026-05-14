const {
    getHomepageDataService,
    getProductDetailService,
    getAdminProductListService,
    updateProductStockService,
} = require("../services/productService");

const getHomepageData = async (req, res) => {
    const data = await getHomepageDataService();
    return res.status(200).json(data);
};

const getProductDetail = async (req, res) => {
    const productId = req.params.id;
    const data = await getProductDetailService(productId);
    if (data.EC !== 0) {
        return res.status(404).json(data);
    }
    return res.status(200).json(data);
};

const getAdminProductList = async (req, res) => {
    if (req.user?.role !== "Admin") {
        return res
            .status(403)
            .json({ message: "Chỉ Admin mới truy cập được dữ liệu này." });
    }
    const data = await getAdminProductListService();
    return res.status(200).json(data);
};

const updateProductStock = async (req, res) => {
    if (req.user?.role !== "Admin") {
        return res
            .status(403)
            .json({ message: "Chỉ Admin mới cập nhật tồn kho." });
    }
    const productId = req.params.id;
    const { delta } = req.body;
    const data = await updateProductStockService(productId, delta);
    if (data.EC !== 0) {
        return res.status(400).json(data);
    }
    return res.status(200).json(data);
};

module.exports = {
    getHomepageData,
    getProductDetail,
    getAdminProductList,
    updateProductStock,
};
