import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { getHomeApi } from "../util/api";
import { getCategoryLabel } from "../util/productHelpers";

const HomePage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [homepageData, setHomepageData] = useState({
        promotions: [],
        newest: [],
        bestSellers: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeInfo = async () => {
            const res = await getHomeApi();
            if (res && res.EC === 0) {
                setHomepageData({
                    promotions: res.promotions || [],
                    newest: res.newest || [],
                    bestSellers: res.bestSellers || [],
                });
            }
            setLoading(false);
        };
        fetchHomeInfo();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">
                                Cửa hàng Điện tử
                            </p>
                            <h1 className="text-4xl font-semibold sm:text-5xl">
                                Mua đồ công nghệ chính hãng, đa dạng danh mục.
                            </h1>
                            <p className="mt-5 max-w-2xl text-slate-200">
                                Trang chủ shop điện tử với nhiều sản phẩm từ
                                laptop, smartphone, tablet đến smartwatch và tai
                                nghe. Đăng nhập để xem trang quản trị, theo dõi
                                tồn kho và quản lý sản phẩm.
                            </p>
                            {auth.isAuthenticated && (
                                <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
                                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
                                        Xin chào,{" "}
                                        {auth.user.name || auth.user.email}
                                    </p>
                                    <p className="mt-3 text-lg font-medium">
                                        Vai trò của bạn: {auth.user.role}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="rounded-[36px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <h2 className="text-lg font-semibold text-white">
                                        Ưu đãi
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-200">
                                        Những laptop giảm giá mạnh dành cho
                                        khách hàng thông minh.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <h2 className="text-lg font-semibold text-white">
                                        Mới nhất
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-200">
                                        Sản phẩm mới về shop, cấu hình hiện đại
                                        và thiết kế mỏng nhẹ.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <h2 className="text-lg font-semibold text-white">
                                        Bán chạy
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-200">
                                        Top sản phẩm được khách hàng yêu thích
                                        nhất.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <h2 className="text-lg font-semibold text-white">
                                        An toàn
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-200">
                                        Thanh toán bảo mật, hỗ trợ đổi trả
                                        nhanh.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-6xl px-6 py-12">
                <div className="mb-10 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">
                        Sản phẩm điện tử nổi bật
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                        Khuyến mãi và sản phẩm mới
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                        Dữ liệu được lấy trực tiếp từ backend bằng API và hiển
                        thị động cho trang chủ.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-slate-600">
                        Đang tải dữ liệu...
                    </div>
                ) : (
                    <div className="space-y-16">
                        <section>
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-2xl font-semibold text-slate-900">
                                    Khuyến mãi
                                </h3>
                                <span className="text-sm text-slate-500">
                                    Top ưu đãi
                                </span>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                                {homepageData.promotions.map((product) => (
                                    <Link
                                        to={`/product/${product._id}`}
                                        key={product._id}
                                        className="group"
                                    >
                                        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-44 w-full object-cover"
                                            />
                                            <div className="p-5">
                                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                                    {getCategoryLabel(
                                                        product.category,
                                                    )}
                                                </span>
                                                <h4 className="mt-3 text-lg font-semibold text-slate-900">
                                                    {product.name}
                                                </h4>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    {product.brand}
                                                </p>
                                                <p className="mt-3 text-base font-medium text-slate-900">
                                                    {new Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        },
                                                    ).format(product.price)}
                                                </p>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-2xl font-semibold text-slate-900">
                                    Mới nhất
                                </h3>
                                <span className="text-sm text-slate-500">
                                    Sản phẩm mới về
                                </span>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                                {homepageData.newest.map((product) => (
                                    <Link
                                        to={`/product/${product._id}`}
                                        key={product._id}
                                        className="group"
                                    >
                                        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-44 w-full object-cover"
                                            />
                                            <div className="p-5">
                                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                                    {getCategoryLabel(
                                                        product.category,
                                                    )}
                                                </span>
                                                <h4 className="mt-3 text-lg font-semibold text-slate-900">
                                                    {product.name}
                                                </h4>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    {product.brand}
                                                </p>
                                                <p className="mt-3 text-base font-medium text-slate-900">
                                                    {new Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        },
                                                    ).format(product.price)}
                                                </p>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-2xl font-semibold text-slate-900">
                                    Bán chạy nhất
                                </h3>
                                <span className="text-sm text-slate-500">
                                    Sản phẩm được săn nhiều
                                </span>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                                {homepageData.bestSellers.map((product) => (
                                    <Link
                                        to={`/product/${product._id}`}
                                        key={product._id}
                                        className="group"
                                    >
                                        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-44 w-full object-cover"
                                            />
                                            <div className="p-5">
                                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                                    {getCategoryLabel(
                                                        product.category,
                                                    )}
                                                </span>
                                                <h4 className="mt-3 text-lg font-semibold text-slate-900">
                                                    {product.name}
                                                </h4>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    {product.brand}
                                                </p>
                                                <p className="mt-3 text-base font-medium text-slate-900">
                                                    {new Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        },
                                                    ).format(product.price)}
                                                </p>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
