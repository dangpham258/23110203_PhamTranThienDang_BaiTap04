import { notification, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/context/auth.context";
import { getAccountApi, getUserApi } from "../util/api";

const UserPage = () => {
    const { auth } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const profile = await getAccountApi();
            if (profile && !profile.message) {
                setAccount(profile);
                if (profile.role === "Admin") {
                    const res = await getUserApi();
                    if (!res?.message) {
                        setUsers(res);
                    } else {
                        notification.error({
                            message: "Unauthorized",
                            description: res.message,
                        });
                    }
                }
            } else {
                notification.error({
                    message: "Lỗi tải thông tin",
                    description:
                        profile?.message || "Không thể lấy thông tin tài khoản",
                });
            }
        };
        fetchData();
    }, []);

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Role",
            dataIndex: "role",
        },
    ];

    if (!account) {
        return <div className="p-8 text-slate-700">Đang tải thông tin...</div>;
    }

    if (account.role !== "Admin") {
        return (
            <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-md">
                <h2 className="mb-6 text-3xl font-semibold text-slate-900">
                    Thông tin cá nhân
                </h2>
                <div className="space-y-4 text-slate-700">
                    <p>
                        <span className="font-medium">Tên:</span> {account.name}
                    </p>
                    <p>
                        <span className="font-medium">Email:</span>{" "}
                        {account.email}
                    </p>
                    <p>
                        <span className="font-medium">Vai trò:</span>{" "}
                        {account.role}
                    </p>
                    <p className="text-sm text-slate-500">
                        Chỉ admin mới xem được danh sách người dùng. Thành viên
                        chỉ xem được thông tin cá nhân.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="mb-6 text-3xl font-semibold text-slate-900">
                Danh sách người dùng
            </h2>
            <Table
                bordered
                dataSource={users}
                columns={columns}
                rowKey={"_id"}
                className="bg-white"
            />
        </div>
    );
};

export default UserPage;
