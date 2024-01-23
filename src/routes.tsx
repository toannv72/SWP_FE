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
    element: <ProductSold/>, 
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
    path: "/order",
    element: <Order />,
  }, 
  {
    path: "/follow",
    element: <Follow />,
  }, 
  {
    path: "/my/order",
    element: <TableOrder />,
  },
]); 
