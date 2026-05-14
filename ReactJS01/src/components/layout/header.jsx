import React, { useContext, useState } from "react";
import {
    UsergroupAddOutlined,
    HomeOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const isAdmin = auth.isAuthenticated && auth.user.role === "Admin";
    const displayName = auth?.user?.name || auth?.user?.email || "Khách";
    const items = [
        {
            label: <Link to={"/"}>Home Page</Link>,
            key: "home",
            icon: <HomeOutlined />,
        },
        ...(isAdmin
            ? [
                  {
                      label: <Link to={"/admin"}>Admin Dashboard</Link>,
                      key: "admin",
                      icon: <SettingOutlined />,
                  },
                  {
                      label: <Link to={"/user"}>Users</Link>,
                      key: "user",
                      icon: <UsergroupAddOutlined />,
                  },
              ]
            : []),
        {
            label: `Xin chào ${displayName}`,
            key: "SubMenu",
            icon: <SettingOutlined />,
            children: auth.isAuthenticated
                ? [
                      {
                          label: (
                              <span
                                  onClick={() => {
                                      localStorage.removeItem("access_token");
                                      setAuth({
                                          isAuthenticated: false,
                                          user: {
                                              email: "",
                                              name: "",
                                              role: "",
                                          },
                                      });
                                      navigate("/");
                                  }}
                              >
                                  Đăng xuất
                              </span>
                          ),
                          key: "logout",
                      },
                  ]
                : [
                      {
                          label: <Link to={"/login"}>Đăng nhập</Link>,
                          key: "login",
                      },
                  ],
        },
    ];

    const [current, setCurrent] = useState("mail");
    const onClick = (e) => {
        if (e.key === "logout") {
            localStorage.removeItem("access_token");
            setAuth({
                isAuthenticated: false,
                user: { email: "", name: "", role: "" },
            });
            navigate("/");
        }
        setCurrent(e.key);
    };

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};

export default Header;
