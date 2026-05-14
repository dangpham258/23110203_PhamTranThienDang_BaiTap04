import { useContext, useEffect, useState } from "react";
import { Button, notification, Table, Tag } from "antd";
import { AuthContext } from "../components/context/auth.context";
import { getAdminProductsApi, updateStockApi } from "../util/api";

const AdminPage = () => {
    const { auth } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            const res = await getAdminProductsApi();
            if (res && res.EC === 0) {
                setProducts(res.products || []);
                setLowStockCount(res.lowStockCount || 0);
                setTotalSales(res.totalSales || 0);
                setSelectedProduct(res.products?.[0] || null);
            } else {
                notification.error({
                    message: "Lỗi tải dữ liệu",
                    description:
                        res?.message ||
                        res?.EM ||
                        "Không thể lấy dữ liệu sản phẩm admin.",
                });
            }
            setLoading(false);
        };
        if (auth.user.role === "Admin") {
            fetchAdminData();
        }
    }, [auth.user.role]);

    const updateStock = async (productId, delta) => {
        setUpdating(true);
        const res = await updateStockApi(productId, delta);
        if (res && res.EC === 0) {
            const updated = res.product;
            setProducts((prev) =>
                prev.map((item) => (item._id === updated._id ? updated : item)),
            );
            if (selectedProduct?._id === updated._id) {
                setSelectedProduct(updated);
            }
            notification.success({
                message: "Cập nhật tồn kho thành công",
                description: `${updated.name} hiện còn ${updated.stock} sản phẩm trên kho.`,
            });
        } else {
            notification.error({
                message: "Cập nhật tồn kho thất bại",
                description:
                    res?.message || res?.EM || "Không thể cập nhật số lượng.",
            });
        }
        setUpdating(false);
    };

    const columns = [
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
            render: (image, record) => (
                <img
                    src={image || record.images?.[0]}
                    alt={record.name}
                    className="h-16 w-24 rounded-xl object-cover"
                />
            ),
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Danh mục",
            dataIndex: "category",
            key: "category",
            render: (category) => <Tag color="blue">{category}</Tag>,
        },
        {
            title: "Kho",
            dataIndex: "stock",
            key: "stock",
            render: (stock) => (
                <span
                    className={
                        stock <= 10
                            ? "text-amber-600 font-semibold"
                            : "text-slate-900"
                    }
                >
                    {stock}
                </span>
            ),
        },
        {
            title: "Đã bán",
            dataIndex: "sales",
            key: "sales",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => updateStock(record._id, 1)}
                        loading={updating}
                    >
                        +
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        onClick={() => updateStock(record._id, -1)}
                        loading={updating}
                        disabled={record.stock <= 0}
                    >
                        -
                    </Button>
                </div>
            ),
        },
    ];

    const similarProducts = selectedProduct
        ? products.filter(
              (product) =>
                  product.category === selectedProduct.category &&
                  product._id !== selectedProduct._id,
          )
        : [];

    if (auth.user.role !== "Admin") {
        return (
            <div className="p-8 text-slate-700">
                <h2 className="mb-4 text-3xl font-semibold">
                    Quyền truy cập bị từ chối
                </h2>
                <p>
                    Chỉ Admin mới có thể xem trang quản trị kho và báo cáo bán
                    hàng.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-3xl font-semibold text-slate-900">
                    Admin Dashboard
                </h1>
                <div className="grid gap-5 md:grid-cols-3 mb-8">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">
                            Tổng sản phẩm
                        </p>
                        <p className="mt-4 text-4xl font-bold text-slate-900">
                            {products.length}
                        </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">
                            Cảnh báo tồn kho
                        </p>
                        <p className="mt-4 text-4xl font-bold text-amber-600">
                            {lowStockCount}
                        </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">
                            Tổng đơn đã bán
                        </p>
                        <p className="mt-4 text-4xl font-bold text-slate-900">
                            {totalSales}
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                                Quản lý sản phẩm
                            </h2>
                            <Table
                                dataSource={products}
                                columns={columns}
                                rowKey="_id"
                                loading={loading}
                                pagination={{ pageSize: 6 }}
                                rowClassName={(record) =>
                                    selectedProduct?._id === record._id
                                        ? "bg-slate-100"
                                        : ""
                                }
                                onRow={(record) => ({
                                    onClick: () => setSelectedProduct(record),
                                })}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                                Chi tiết sản phẩm
                            </h2>
                            {!selectedProduct ? (
                                <p>Chọn sản phẩm bên trái để xem chi tiết.</p>
                            ) : (
                                <div className="space-y-4">
                                    <img
                                        src={
                                            selectedProduct.image ||
                                            selectedProduct.images?.[0]
                                        }
                                        alt={selectedProduct.name}
                                        className="h-52 w-full rounded-3xl object-cover"
                                    />
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Danh mục
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {selectedProduct.category}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Tag color="cyan">
                                            {selectedProduct.brand}
                                        </Tag>
                                        <Tag
                                            color={
                                                selectedProduct.stock <= 10
                                                    ? "volcano"
                                                    : "green"
                                            }
                                        >
                                            Tồn kho {selectedProduct.stock}
                                        </Tag>
                                        <Tag color="blue">
                                            Đã bán {selectedProduct.sales}
                                        </Tag>
                                    </div>
                                    <p className="text-slate-600">
                                        {selectedProduct.description}
                                    </p>
                                </div>
                            )}
                        </div>
                        {selectedProduct && (
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-semibold text-slate-900">
                                    Sản phẩm tương tự
                                </h2>
                                {similarProducts.length === 0 ? (
                                    <p className="text-slate-500">
                                        Không có sản phẩm cùng danh mục.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {similarProducts.map((product) => (
                                            <div
                                                key={product._id}
                                                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <p className="font-semibold text-slate-900">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    {product.category}
                                                </p>
                                                <p className="mt-2 text-base font-medium text-slate-900">
                                                    {new Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        },
                                                    ).format(product.price)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
