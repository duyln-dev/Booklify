import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import "antd/dist/reset.css";
import LoginPage from "./pages/login";
import ContactPage from "./pages/contact/index";
import BookPage from "./pages/book";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import RegisterPage from "./pages/register";
import { callFetchAccount } from "./services/api";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import UserTable from "./components/Admin/User/UserTable";
import DetailBook from "./components/Book/DetailBook";
import ViewOrder from "./components/Order/ViewOrder";
import OrderHistory from "./components/Order/OrderHistory";
import BookTable from "./components/Admin/Book/BookTable";
import OrderTable from "./components/Admin/Order/OrderTable";
import DashboardAdmin from "./components/Admin/DashboardAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.account.isLoading);

  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;

    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },

        {
          path: "book",
          element: <BookPage />,
        },

        {
          path: "book/:slug",
          element: <DetailBook />,
        },
        {
          path: "order",
          element: <ViewOrder />,
        },
        {
          path: "history",
          element: <OrderHistory />,
        },
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          ),
        },

        {
          path: "user",
          element: <UserTable />,
        },

        {
          path: "book",
          element: <BookTable />,
        },

        {
          path: "order",
          element: <OrderTable />,
        },
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ||
      window.location.pathname.startsWith("/book") ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
