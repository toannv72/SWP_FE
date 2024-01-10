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
]); 
