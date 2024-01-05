import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Page/Authenticator/404/PageNotFound";
import Login from "./Page/Authenticator/Login/Login";
import SendCode from "./Page/Authenticator/sendCode/SendCode";
import TableUser from "./Page/Authenticator/Admin2/TableUser";
import Home from "./Page/Authenticator/Home/Home";
import ProductsAll from "./Page/Authenticator/ProductShow/Productsall";

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
  
]); 
