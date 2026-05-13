const { getHomepageDataService } = require("../services/productService");

const getHomepageData = async (req, res) => {
    const data = await getHomepageDataService();
    return res.status(200).json(data);
};

module.exports = {
    getHomepageData,
};
