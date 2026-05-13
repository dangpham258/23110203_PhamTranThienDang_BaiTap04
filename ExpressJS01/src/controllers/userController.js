const {
    createUserService,
    loginService,
    getUserService,
    forgotPasswordService,
    resetPasswordService,
} = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    if (!data) {
        return res.status(400).json({ EC: 1, EM: "Tạo tài khoản thất bại hoặc email đã tồn tại." });
    }
    return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
    const { email, password, role } = req.body;
    const requestedRole = role || "User";
    const data = await loginService(email, password, requestedRole);
    return res.status(200).json(data);
};

const getUser = async (req, res) => {
    if (req.user?.role !== "Admin") {
        return res.status(403).json({ message: "Chỉ Admin mới xem được danh sách người dùng." });
    }
    const data = await getUserService();
    return res.status(200).json(data);
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const data = await forgotPasswordService(email);
    return res.status(200).json(data);
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const data = await resetPasswordService(email, otp, newPassword);
    return res.status(200).json(data);
};

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
};

module.exports = {
    createUser,
    handleLogin,
    getUser,
    forgotPassword,
    resetPassword,
    getAccount,
};
