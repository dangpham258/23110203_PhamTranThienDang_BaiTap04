require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../config/email");

const saltRounds = 10;

const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

const createUserService = async (name, email, password, role = "User") => {
    try {
        //check user exist
        const user = await User.findOne({ email });
        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }
        //hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds);
        //save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role,
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const loginService = async (email1, password, requestedRole = "User") => {
    try {
        //fetch user by email
        const user = await User.findOne({ email: email1 });
        if (user) {
            //compare password
            const isMatchPassword = await bcrypt.compare(
                password,
                user.password,
            );
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ",
                };
            }
            if (user.role !== requestedRole) {
                return {
                    EC: 3,
                    EM: `Vai trò ${requestedRole} không hợp lệ cho tài khoản này.`,
                };
            }
            //create an access token
            const payload = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            };
            const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });
            return {
                EC: 0,
                access_token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            };
        }
        return {
            EC: 1,
            EM: "Email/Password không hợp lệ",
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const forgotPasswordService = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                EC: 1,
                EM: "Email không tồn tại trong hệ thống.",
            };
        }

        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        user.resetOTP = otp;
        user.resetOTPExpire = otpExpire;
        await user.save();

        const subject = "Yêu cầu lấy lại mật khẩu";
        const html = `
            <p>Xin chào ${user.name || "người dùng"},</p>
            <p>Mã OTP để thay đổi mật khẩu của bạn là:</p>
            <h2>${otp}</h2>
            <p>Mã sẽ hết hạn trong 10 phút.</p>
        `;
        await sendEmail({
            to: user.email,
            subject,
            text: `Mã OTP để thay đổi mật khẩu của bạn là: ${otp}. Mã sẽ hết hạn trong 10 phút.`,
            html,
        });

        return {
            EC: 0,
            EM: "Mã OTP đã được gửi tới email của bạn.",
        };
    } catch (error) {
        console.error("forgotPasswordService error:", error);
        return {
            EC: 2,
            EM: "Không thể gửi OTP. Vui lòng kiểm tra cấu hình email và thử lại.",
        };
    }
};

const resetPasswordService = async (email, otp, newPassword) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                EC: 1,
                EM: "Email không tồn tại.",
            };
        }

        if (!user.resetOTP || !user.resetOTPExpire) {
            return {
                EC: 2,
                EM: "Bạn chưa gửi yêu cầu đặt lại mật khẩu.",
            };
        }

        if (new Date() > user.resetOTPExpire) {
            return {
                EC: 3,
                EM: "Mã OTP đã hết hạn. Vui lòng gửi lại.",
            };
        }

        if (user.resetOTP !== otp) {
            return {
                EC: 4,
                EM: "Mã OTP không đúng.",
            };
        }

        user.password = await bcrypt.hash(newPassword, saltRounds);
        user.resetOTP = undefined;
        user.resetOTPExpire = undefined;
        await user.save();

        return {
            EC: 0,
            EM: "Mật khẩu đã được cập nhật thành công.",
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 5,
            EM: "Không thể cập nhật mật khẩu. Vui lòng thử lại.",
        };
    }
};

module.exports = {
    createUserService,
    loginService,
    getUserService,
    forgotPasswordService,
    resetPasswordService,
};
