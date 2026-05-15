import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Spin, Tag } from "antd";
import { getProductDetailApi } from "../util/api";
import { getCategoryLabel } from "../util/productHelpers";

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            const res = await getProductDetailApi(id);
            if (res && res.EC === 0) {
                setProduct(res.product);
                setSimilarProducts(res.similarProducts || []);
                setActiveIndex(0);
            }
            setLoading(false);
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spin />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen p-8 text-slate-700">
                <p>Không tìm thấy sản phẩm.</p>
                <Button onClick={() => navigate(-1)} className="mt-4">
                    Quay lại
                </Button>
            </div>
        );
    }

    const images =
        product.images?.length > 0
            ? product.images
            : product.image
              ? [product.image]
              : [];
    const activeImage = images[activeIndex] || product.image;

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">
                            Chi tiết sản phẩm
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                            {product.name}
                        </h1>
                    </div>
                    <Button type="default" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
                        <div className="rounded-3xl border border-slate-200 overflow-hidden">
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="h-96 w-full object-cover"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {images.map((image, index) => (
                                    <button
                                        key={image}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        className={`overflow-hidden rounded-3xl border p-1 transition ${
                                            index === activeIndex
                                                ? "border-cyan-500"
                                                : "border-slate-200"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name}-${index}`}
                                            className="h-20 w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Tag color="blue">
                                    {getCategoryLabel(product.category)}
                                </Tag>
                                <Tag color="cyan">{product.brand}</Tag>
                                <Tag
                                    color={
                                        product.stock <= 10
                                            ? "volcano"
                                            : "green"
                                    }
                                >
                                    Tồn kho: {product.stock}
                                </Tag>
                                <Tag color="geekblue">
                                    Đã bán: {product.sales}
                                </Tag>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(product.price)}
                            </p>
                            <p className="text-slate-600">
                                {product.description}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                                Thông tin sản phẩm
                            </h2>
                            <div className="space-y-3 text-slate-700">
                                <p>
                                    <span className="font-semibold">
                                        Danh mục:
                                    </span>{" "}
                                    {getCategoryLabel(product.category)}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Thương hiệu:
                                    </span>{" "}
                                    {product.brand}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Tồn kho:
                                    </span>{" "}
                                    {product.stock}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Lượt bán:
                                    </span>{" "}
                                    {product.sales}
                                </p>
                            </div>
                        </div>
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                                Sản phẩm tương tự
                            </h2>
                            {similarProducts.length === 0 ? (
                                <p className="text-slate-500">
                                    Không có sản phẩm tương tự trong danh mục.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {similarProducts.map((item) => (
                                        <Link
                                            key={item._id}
                                            to={`/product/${item._id}`}
                                            className="block rounded-3xl border border-slate-200 p-4 transition hover:border-cyan-500"
                                        >
                                            <p className="font-semibold text-slate-900">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {getCategoryLabel(
                                                    item.category,
                                                )}
                                            </p>
                                            <p className="mt-2 text-base font-medium text-slate-900">
                                                {new Intl.NumberFormat(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    },
                                                ).format(item.price)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
