import React, { useState } from "react";
import "./layoutAdmin.scss";
import { Layout, theme } from "antd";
import { FireFilled } from "@ant-design/icons";
import { Menu } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";

import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  PayCircleOutlined,
  EditOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { FaMoon, FaSun } from "react-icons/fa";

import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { message } from "antd";

const { Header, Sider, Content } = Layout;

const Logo = () => {
  return (
    <div className="logo">
      <div className="logo-icon">
        <FireFilled />
      </div>
    </div>
  );
};

const MenuList = (props) => {
  const { darkTheme } = props;
  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menu-bar"
      items={[
        {
          key: "dashboard",
          icon: <HomeOutlined />,
          label: <Link to="/admin">Dashboard</Link>,
        },
        {
          key: "manage-user",
          icon: <AppstoreOutlined />,
          label: <Link to="/admin/user">Manage Users</Link>,
          // children: [
          //   {
          //     key: "manage-user-crud",
          //     icon: <EditOutlined />,
          //     label: <Link to="/admin/user">CRUD</Link>,
          //   },
          //   {
          //     key: "manage-user-file",
          //     icon: <FileOutlined />,
          //     label: <Link to="/admin/manage-user/file">File</Link>,
          //   },
          // ],
        },
        {
          key: "manage-book",
          icon: <PayCircleOutlined />,
          label: <Link to="/admin/book">Manage Books</Link>,
        },
        {
          key: "manage-orders",
          icon: <SettingOutlined />,
          label: <Link to="/admin/order">Manage Order</Link>,
        },
      ]}
    />
  );
};

const ToggleThemeButton = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="toggle-theme-btn">
      <Button onClick={toggleTheme}>
        {darkTheme ? <FaSun /> : <FaMoon />}
      </Button>
    </div>
  );
};

const LayoutAdmin = () => {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.user);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/login");
      console.log("Call");
    }
  };

  const items = [
    {
      key: "1",
      label: <span>Quản lý tài khoản</span>,
    },
    {
      key: "homepage",
      label: <span>Trang chủ</span>,
    },
    {
      key: "logout",
      danger: true,
      label: <span>Đăng xuất</span>, // Không dùng <Link> ở đây
    },
  ];

  return (
    <>
      <Layout style={{ height: "100vh" }}>
        <Sider
          collapsed={collapsed}
          collapsible
          trigger={null}
          className="sidebar"
          theme={darkTheme ? "dark" : "light"}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Logo />
          <MenuList darkTheme={darkTheme} />
          <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: "margin-left 0.2s",
          }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              position: "fixed",
              top: 0,
              right: 0,
              left: collapsed ? 80 : 200,
              zIndex: 1000,
              transition: "left 0.2s",
            }}
          >
            <div className="admin-header-container">
              <Button
                type="text"
                className="toogle"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
              <Dropdown
                trigger={["hover", "click"]}
                menu={{
                  items,
                  onClick: ({ key }) => {
                    if (key === "logout") {
                      handleLogout();
                    } else if (key === "homepage") {
                      navigate("/");
                    }
                  },
                }}
              >
                <div className="account">
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="dropdown-trigger"
                  >
                    {user?.fullName || "Tài khoản"}
                    <DownOutlined />
                  </a>
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content
            style={{
              margin: "16px",
              marginTop: "80px", // Để tránh bị che bởi fixed header
              padding: "24px",
              background: "#f0f2f5",
              minHeight: "calc(100vh - 96px)", // 80px cho header + 16px margin
              overflow: "auto", // Cho phép scroll trong content
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default LayoutAdmin;
