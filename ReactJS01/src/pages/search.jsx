import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Select, Slider, Spin, Input, Tag, Empty } from "antd";
import { searchProductsApi } from "../util/api";
import { getCategoryLabel } from "../util/productHelpers";

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 50000000]);
    const [loading, setLoading] = useState(true);

    const query = searchParams.get("q") || "";
    const brand = searchParams.get("brand") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "new";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const [localQuery, setLocalQuery] = useState(query);
    const [localBrand, setLocalBrand] = useState(brand);
    const [localCategory, setLocalCategory] = useState(category);
    const [localSort, setLocalSort] = useState(sort);
    const [localPriceRange, setLocalPriceRange] = useState(
        minPrice && maxPrice
            ? [Number(minPrice), Number(maxPrice)]
            : [0, 50000000],
    );

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const filters = {
                brand: localBrand,
                category: localCategory,
                minPrice: localPriceRange[0],
                maxPrice: localPriceRange[1],
                sort: localSort,
            };
            const res = await searchProductsApi(localQuery, filters);
            if (res && res.EC === 0) {
                setProducts(res.products || []);
                setBrands(res.brands || []);
                setCategories(res.categories || []);
                if (res.priceRange) {
                    setPriceRange([res.priceRange.min, res.priceRange.max]);
                }
            }
            setLoading(false);
        };
        fetchProducts();
    }, [localQuery, localBrand, localCategory, localSort, localPriceRange]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (localQuery) params.append("q", localQuery);
        if (localBrand) params.append("brand", localBrand);
        if (localCategory) params.append("category", localCategory);
        if (localSort) params.append("sort", localSort);
        if (localPriceRange[0] !== 0 || localPriceRange[1] !== 50000000) {
            params.append("minPrice", localPriceRange[0]);
            params.append("maxPrice", localPriceRange[1]);
        }
        setSearchParams(params);
    };

    const handleReset = () => {
        setLocalQuery("");
        setLocalBrand("");
        setLocalCategory("");
        setLocalSort("new");
        setLocalPriceRange([0, 50000000]);
        setSearchParams("");
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Tìm kiếm sản phẩm
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Tìm kiếm và lọc sản phẩm theo nhu cầu của bạn
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-slate-900">
                                Tìm kiếm
                            </h3>
                            <Input.Search
                                placeholder="Nhập tên sản phẩm..."
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                                onSearch={handleSearch}
                                onPressEnter={handleSearch}
                            />
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-slate-900">
                                Danh mục
                            </h3>
                            <Select
                                value={localCategory || undefined}
                                onChange={setLocalCategory}
                                placeholder="Chọn danh mục"
                                className="w-full"
                                options={[
                                    { label: "Tất cả", value: "" },
                                    ...categories.map((cat) => ({
                                        label: cat.name,
                                        value: cat._id,
                                    })),
                                ]}
                            />
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-slate-900">
                                Thương hiệu
                            </h3>
                            <Select
                                value={localBrand || undefined}
                                onChange={setLocalBrand}
                                placeholder="Chọn thương hiệu"
                                className="w-full"
                                options={[
                                    { label: "Tất cả", value: "" },
                                    ...brands.map((b) => ({
                                        label: b,
                                        value: b,
                                    })),
                                ]}
                            />
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-slate-900">
                                Khoảng giá
                            </h3>
                            <Slider
                                range
                                min={priceRange[0]}
                                max={priceRange[1]}
                                value={localPriceRange}
                                onChange={setLocalPriceRange}
                                marks={{
                                    [priceRange[0]]: "0",
                                    [priceRange[1]]: `${(priceRange[1] / 1000000).toFixed(0)}M`,
                                }}
                            />
                            <p className="mt-4 text-sm text-slate-600">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(localPriceRange[0])}
                                {" - "}
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(localPriceRange[1])}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-slate-900">
                                Sắp xếp
                            </h3>
                            <Select
                                value={localSort}
                                onChange={setLocalSort}
                                className="w-full"
                                options={[
                                    { label: "Mới nhất", value: "new" },
                                    {
                                        label: "Giá thấp trước",
                                        value: "price_asc",
                                    },
                                    {
                                        label: "Giá cao trước",
                                        value: "price_desc",
                                    },
                                    { label: "Bán chạy", value: "sales_desc" },
                                ]}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="primary"
                                className="flex-1"
                                onClick={handleSearch}
                            >
                                Tìm kiếm
                            </Button>
                            <Button className="flex-1" onClick={handleReset}>
                                Đặt lại
                            </Button>
                        </div>
                    </aside>

                    <main>
                        <div className="mb-4 flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
                            <p className="text-sm text-slate-600">
                                Tìm thấy{" "}
                                <span className="font-semibold">
                                    {products.length}
                                </span>{" "}
                                sản phẩm
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Spin />
                            </div>
                        ) : products.length === 0 ? (
                            <Empty
                                description="Không tìm thấy sản phẩm"
                                className="rounded-3xl bg-white p-12 shadow-sm"
                            />
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {products.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/product/${product._id}`}
                                        className="group"
                                    >
                                        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition group-hover:scale-110"
                                                />
                                                {product.stock <= 10 && (
                                                    <div className="absolute right-3 top-3 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
                                                        Sắp hết
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <div className="mb-2 flex flex-wrap gap-2">
                                                    <Tag color="blue">
                                                        {getCategoryLabel(
                                                            product.category,
                                                        )}
                                                    </Tag>
                                                    <Tag color="cyan">
                                                        {product.brand}
                                                    </Tag>
                                                </div>
                                                <h4 className="line-clamp-2 text-lg font-semibold text-slate-900">
                                                    {product.name}
                                                </h4>
                                                <div className="mt-3 flex items-end justify-between">
                                                    <p className="text-base font-bold text-cyan-600">
                                                        {new Intl.NumberFormat(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            },
                                                        ).format(product.price)}
                                                    </p>
                                                    <span className="text-xs text-slate-500">
                                                        Bán: {product.sales}
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
