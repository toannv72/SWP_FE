import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Page/Authenticator/404/PageNotFound";
import Login from "./Page/Authenticator/Login/Login";
import SendCode from "./Page/Authenticator/sendCode/SendCode";
import TableUser from "./Page/Authenticator/Admin2/TableUser";
import Home from "./Page/Authenticator/Home/Home";
import ProductsAll from "./Page/Authenticator/ProductShow/Productsall";
import Logout from "./Page/Authenticator/Logout/Logout";
import Product from "./Page/Authenticator/Product/Product";

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
    element: <Product />, 
  }, 
  { 
    path: "/follow", 
    element: <ProductsAll />, 
  },
  { 
    path: "/Table", 
    element: <TableUser />, 
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
