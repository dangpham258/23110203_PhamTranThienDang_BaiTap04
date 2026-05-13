const User = require("../models/user");
const Product = require("../models/product");
const bcrypt = require("bcrypt");

const seedDatabase = async () => {
    const adminExists = await User.findOne({ role: "Admin" });
    if (!adminExists) {
        const defaultPassword = process.env.ADMIN_PASSWORD || "Admin@123";
        const hashPassword = await bcrypt.hash(defaultPassword, 10);
        await User.create({
            name: "Administrator",
            email: "admin@shop.com",
            password: hashPassword,
            role: "Admin",
        });
        console.log("Seeded default admin: admin@shop.com / Admin@123");
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
        const sampleProducts = [
            {
                name: "Laptop VivoBook 15",
                brand: "Asus",
                description:
                    "Laptop mỏng nhẹ, cấu hình ổn định cho công việc hàng ngày.",
                price: 13990000,
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
                tags: ["promotion", "new"],
                sales: 55,
            },
            {
                name: "MacBook Air M2",
                brand: "Apple",
                description:
                    "Laptop mạnh mẽ với chip M2, thời lượng pin ấn tượng.",
                price: 29990000,
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                tags: ["bestseller", "new"],
                sales: 180,
            },
            {
                name: "ThinkPad X1 Carbon",
                brand: "Lenovo",
                description:
                    "Laptop doanh nhân siêu bền, bàn phím cao cấp, cấu hình cao.",
                price: 34990000,
                image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80",
                tags: ["promotion", "bestseller"],
                sales: 130,
            },
            {
                name: "Gaming Laptop ROG Strix",
                brand: "Asus",
                description:
                    "Laptop gaming hiệu năng cao, tản nhiệt tốt, thiết kế hầm hố.",
                price: 25990000,
                image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=800&q=80",
                tags: ["bestseller"],
                sales: 220,
            },
            {
                name: "Dell XPS 13",
                brand: "Dell",
                description:
                    "Ultrabook cao cấp với màn hình sắc nét và thân máy mỏng nhẹ.",
                price: 27990000,
                image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80",
                tags: ["new"],
                sales: 95,
            },
        ];
        await Product.create(sampleProducts);
        console.log("Seeded sample laptop products");
    }
};

module.exports = seedDatabase;
