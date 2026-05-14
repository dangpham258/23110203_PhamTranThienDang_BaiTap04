const express = require("express");
const {
    createUser,
    handleLogin,
    getUser,
    forgotPassword,
    resetPassword,
    getAccount,
} = require("../controllers/userController");
const {
    getHomepageData,
    getProductDetail,
    getAdminProductList,
    updateProductStock,
} = require("../controllers/productController");
const auth = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.all(/(.*)/, auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/reset-password", resetPassword);
routerAPI.get("/home", getHomepageData);
routerAPI.get("/products", getAdminProductList);
routerAPI.get("/products/:id", getProductDetail);
routerAPI.patch("/products/:id/stock", updateProductStock);
routerAPI.get("/user", getUser);
routerAPI.get("/account", getAccount);

module.exports = routerAPI; //export default
