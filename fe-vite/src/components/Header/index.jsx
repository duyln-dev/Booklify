// React & hooks
import React, { useEffect, useState } from "react";

// React Router
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Ant Design
import {
  Divider,
  Badge,
  Drawer,
  message,
  Avatar,
  Popover,
  Empty,
  Dropdown,
  Space,
  Button,
} from "antd";
import { DownOutlined } from "@ant-design/icons";

// React Icons
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";

// Redux & Services
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout } from "../../services/api";

// Styles
import "./header.scss";

export const useCanHover = () => {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover)");

    const handler = (e) => {
      setCanHover(e.matches); // e.matches: true nếu hover được, false nếu không
    };

    setCanHover(mql.matches); // set ngay lần đầu
    mql.addEventListener("change", handler); // hỗ trợ modern browser

    return () => mql.removeEventListener("change", handler);
  }, []);

  return canHover;
};

const Header = () => {
  const canHover = useCanHover();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const carts = useSelector((state) => state.order.carts);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/login");
    }
  };

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  let items = [
    {
      key: "1",
      label: <span>Quản lý tài khoản</span>,
    },
    {
      key: "2",
      label: <span>Lịch sử mua hàng</span>,
    },

    {
      key: "3",
      danger: true,
      label: (
        <span style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </span>
      ),
    },
  ];

  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const contentPopover = () => {
    return (
      <div className="pop-cart-body">
        <div className="pop-cart-content">
          {carts?.map((book, index) => {
            return (
              <div className="book" key={`book-${index}`}>
                <img
                  className="book-thumbnail"
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    book?.detail?.thumbnail
                  }`}
                />
                <div className="book-info">
                  <div className="book-info-name">{book?.detail?.mainText}</div>
                  <div className="price">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(book?.detail?.price ?? 0)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {carts.length > 0 ? (
          <div className="pop-cart-footer">
            <Button
              color="primary"
              variant="outlined"
              onClick={() => navigate("/order")}
            >
              Xem giỏ hàng
            </Button>
          </div>
        ) : (
          <Empty description="Không có sản phẩm trong giỏ hàng" />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="header">
        <div className="header__logo">
          <span
            className="header-toogle"
            onClick={() => {
              setOpenDrawer(true);
            }}
          >
            ☰
          </span>
          <div className="header__logo-icon">
            <FaReact />
          </div>
          <span className="header__logo-text" onClick={() => navigate("/")}>
            BOOKLIFY
          </span>
        </div>

        <div className="header-search">
          <VscSearchFuzzy className="icon-search" />
          <input
            type="text"
            className="header-search__input"
            placeholder="Hôm nay bạn tìm gì?"
          />
        </div>

        <div className="header-cart">
          <Popover
            title={"Sản phẩm mới thêm"}
            className="popover-carts"
            placement="topRight"
            rootClassName="popover-carts"
            content={contentPopover}
            arrow={true}
            trigger={canHover ? "hover" : "click"}
          >
            <Badge count={carts?.length ?? 0} showZero>
              <FiShoppingCart className="icon-cart" />
            </Badge>
          </Popover>
        </div>

        <div className="header-user">
          {!isAuthenticated ? (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Tài khoản
            </span>
          ) : (
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar src={urlAvatar} />
                  <span style={{ cursor: "pointer" }}>{user?.fullName}</span>
                </Space>
              </a>
            </Dropdown>
          )}
        </div>
      </div>

      <Drawer
        title="BOOKLIFY"
        placement="left"
        closable={true}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        {isAuthenticated ? (
          <>
            {user?.role === "ADMIN" && (
              <>
                <div onClick={() => navigate("/admin")}>Trang quản trị</div>
                <Divider />
              </>
            )}
            <div>Quản lý tài khoản</div>
            <Divider />
            <div onClick={() => navigate("/history")}>Lịch sử mua hàng</div>
            <Divider />
            <div
              style={{ cursor: "pointer", color: "red" }}
              onClick={handleLogout}
            >
              Đăng xuất
            </div>
          </>
        ) : (
          <div onClick={() => navigate("/login")}>Đăng nhập</div>
        )}
      </Drawer>
    </>
  );
};

export default Header;
