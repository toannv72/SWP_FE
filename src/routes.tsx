import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Page/Authenticator/404/PageNotFound";
import Login from "./Page/Authenticator/Login/Login";
import SendCode from "./Page/Authenticator/sendCode/SendCode";
import TableUser from "./Page/Authenticator/Admin2/TableUser";
import Home from "./Page/Authenticator/Home/Home";
import Logout from "./Page/Authenticator/Logout/Logout";
import Artwork from "./Page/Authenticator/Artwork/Artwork";
import Product from "./Page/Authenticator/Product/Product";
import ProductSold from "./Page/Authenticator/ProductShow/Productsold";
import TableProduct from "./Page/Authenticator/Product/TableProduct";
import Reissue from "./Page/Authenticator/Reissue/Reissue";
import Payment from "./Page/Authenticator/Payment/Payment";
import Author from "./Page/Authenticator/Author/Author";
import Profile from "./Page/Authenticator/Profile/Profile";
import InvoicePage from "./Page/Authenticator/Payment/Invoice";
import Order from "./Page/Authenticator/Order/Order";
import Follow from "./Page/Authenticator/Follow/Follow";
import TableOrder from "./Page/Authenticator/ComOrderTable/TableOrder";
import Search from "./Page/Authenticator/Search/Search";
import SearchGenre from "./Page/Authenticator/Search/Search2";
import SearchUser from "./Page/Authenticator/Search/Search3";
import OrderRequest from "./Page/Authenticator/Order_Request/OrderRequest";
import Required from "./Page/Authenticator/Required/Required";
import RequiredSuccess from "./Page/Authenticator/Required/RequiredSuccess";
import TableProductAdmin from "./Page/Authenticator/Admin2/TableProduct";
import TableFeedBack from "./Page/Authenticator/Admin2/TableFeedBack";
import TableReportUser from "./Page/Authenticator/Admin2/TableReportUser";
import TableArtwork from "./Page/Authenticator/Admin2/TableArtwork";
import Painting from "./Page/Authenticator/Home/Painting";
import Art from "./Page/Authenticator/Home/Art";
import Decorate from "./Page/Authenticator/Home/Decorate";
import ForgotPassword from "./Page/Authenticator/Login/forgotPassword";
import ResetPassword from "./Page/Authenticator/Login/resetPassword";
import Dashboard from "./Page/Dashboard/Dashboard";
import TableCategory from "./Page/Authenticator/Category/TableCategory";

export const routers = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/reissue",
    element: <Reissue />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/artwork/:id",
    element: <Artwork />,
  },
  {
    path: "/Table",
    element: <TableUser />,
  },
  {
    path: "/product/:slug",
    element: <Product />,
  },
  {
    path: "/author/:id",
    element: <Author />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/payment/bill/:id",
    element: <InvoicePage />,
  },
  {
    path: "/my/product/table",
    element: <TableProduct />,
  },
  {
    path: "/product",
    element: <ProductSold />,
  },
  {
    path: "/SendCode",
    element: <SendCode />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/admin/tableUser",
    element: <TableUser />,
  },
  {
    path: "/admin/category",
    element: <TableCategory />,
  },
  {
    path: "/admin/tableProduct",
    element: <TableProductAdmin />,
  },
  {
    path: "/admin/tableFeedback",
    element: <TableFeedBack />,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin/tablereportuser",
    element: <TableReportUser />,
  },
  {
    path: "/admin/tableartwork",
    element: <TableArtwork />,
  },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/orderRequest",
    element: <OrderRequest />,
  },
  {
    path: "/require",
    element: <Required />,
  },
  {
    path: "/required/bill/:id",
    element: <RequiredSuccess />,
  },
  {
    path: "/follow",
    element: <Follow />,
  },
  {
    path: "/my/order",
    element: <TableOrder />,
  },
  {
    path: "/search/:search",
    element: <Search />,
  },
  {
    path: "/searchGenre/:search",
    element: <SearchGenre />,
  },
  {
    path: "/searchUser/:search",
    element: <SearchUser />,
  },
  // {
  //   path: "/category/painting",
  //   element: <Painting />,
  // },
  // {
  //   path: "/category/decorate",
  //   element: <Decorate />,
  // },
  // {
  //   path: "/category/art",
  //   element: <Art />,
  // },
  {
    path: "/category/:id",
    element: <Painting />,
  },
]); 
