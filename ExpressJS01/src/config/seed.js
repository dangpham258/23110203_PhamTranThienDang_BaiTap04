const User = require("../models/user");
const Product = require("../models/product");
const Category = require("../models/category");
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
    const categoryNames = [
        "Laptop",
        "Smartphone",
        "Headphone",
        "Smartwatch",
        "Tablet",
        "Camera",
    ];

    const existingCategories = await Category.find({
        name: { $in: categoryNames },
    });
    const categoryMap = {};
    await Promise.all(
        categoryNames.map(async (name) => {
            const category =
                existingCategories.find((item) => item.name === name) ||
                (await Category.create({ name }));
            categoryMap[name] = category._id;
        }),
    );

    if (productCount === 0) {
        const sampleProducts = [
            {
                name: "Laptop VivoBook 15",
                brand: "Asus",
                description:
                    "Laptop mỏng nhẹ, cấu hình ổn định cho công việc hàng ngày.",
                price: 13990000,
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=90",
                ],
                category: categoryMap["Laptop"],
                tags: ["promotion", "new"],
                stock: 24,
                sales: 55,
            },
            {
                name: "MacBook Air M2",
                brand: "Apple",
                description:
                    "Laptop mỏng nhẹ, hiệu năng cao với chip M2 và pin dùng cả ngày.",
                price: 29990000,
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=90",
                ],
                category: categoryMap["Laptop"],
                tags: ["bestseller", "new"],
                stock: 15,
                sales: 180,
            },
            {
                name: "ROG Phone 7",
                brand: "Asus",
                description:
                    "Smartphone gaming mạnh mẽ, màn hình AMOLED 165Hz và sạc nhanh.",
                price: 21990000,
                image: "https://images.unsplash.com/photo-1512499617640-c2f999fe9342?auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1512499617640-c2f999fe9342?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1512499617640-c2f999fe9342?auto=format&fit=crop&w=1200&q=90",
                ],
                category: categoryMap["Smartphone"],
                tags: ["promotion", "bestseller"],
                stock: 8,
                sales: 250,
            },
            {
                name: "Galaxy S24 Ultra",
                brand: "Samsung",
                description:
                    "Smartphone cao cấp với camera chuyên nghiệp và pin trâu.",
                price: 32990000,
                image: "https://images.unsplash.com/photo-1512499617640-c2f999fe9342?auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1512499617640-c2f999fe9342?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1512499617640-c2f999fe9342?auto=format&fit=crop&w=1200&q=90",
                ],
                category: categoryMap["Smartphone"],
                tags: ["bestseller", "new"],
                stock: 18,
                sales: 210,
            },
            {
                name: "Sony WH-1000XM5",
                brand: "Sony",
                description:
                    "Tai nghe chống ồn cao cấp với âm thanh chi tiết và pin 30 giờ.",
                price: 7990000,
                image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1200&q=90",
                ],
                category: categoryMap["Headphone"],
                tags: ["promotion"],
                stock: 40,
                sales: 85,
            },
            {
                name: "Apple Watch Series 9",
                brand: "Apple",
                description:
                    "Smartwatch thông minh với màn hình sáng, theo dõi sức khỏe toàn diện.",
                price: 11990000,
                image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=90",
                ],
                category: categoryMap["Smartwatch"],
                tags: ["new"],
                stock: 30,
                sales: 140,
            },
            {
                name: "iPad Pro 11",
                brand: "Apple",
                description:
                    "Tablet hiệu năng cao, màn hình Liquid Retina siêu mịn và nhẹ.",
                price: 24990000,
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=90",
                ],
                category: categoryMap["Tablet"],
                tags: ["bestseller"],
                stock: 20,
                sales: 95,
            },
            {
                name: "Canon EOS R10",
                brand: "Canon",
                description:
                    "Máy ảnh mirrorless nhẹ, lấy nét nhanh, phù hợp quay phim và chụp hình.",
                price: 22990000,
                image: "https://images.unsplash.com/photo-1519183071298-a2962be54afa?auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1519183071298-a2962be54afa?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1519183071298-a2962be54afa?auto=format&fit=crop&w=1200&q=90",
                ],
                category: categoryMap["Camera"],
                tags: ["promotion"],
                stock: 12,
                sales: 60,
            },
        ];
        await Product.create(sampleProducts);
        console.log("Seeded sample electronic products");
    } else {
        const stringCategoryProducts = await Product.find({
            category: { $type: "string" },
        });
        if (stringCategoryProducts.length > 0) {
            await Promise.all(
                stringCategoryProducts.map(async (product) => {
                    const categoryName = product.category;
                    product.category =
                        categoryMap[categoryName] || categoryMap["Laptop"];
                    await product.save();
                }),
            );
            console.log(
                "Updated existing product categories to category references.",
            );
        }
    }
};

module.exports = seedDatabase;
