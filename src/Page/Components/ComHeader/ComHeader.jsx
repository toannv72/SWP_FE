import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ShoppingCart from "../../Authenticator/ShoppingCart/ShoppingCart";
import { routs } from "../../../constants/ROUT";
import { ComLink } from "../ComLink/ComLink";
import { Affix, Drawer, Dropdown, FloatButton, Select, Space } from "antd";
import images from "../../../img";
import ComInput from "../ComInput/ComInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { textApp } from "../../../TextContent/textApp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStorage } from "../../../hooks/useLocalStorage";
import { useSocket } from "../../../App";
import axios from "axios";
import { DownOutlined } from '@ant-design/icons';
import { getData } from "../../../api/api";
const navigation = {
  pages: [
    { name: textApp.Header.home, href: "/" },
    { name: "Theo dõi", href: "/follow" },
    { name: "Cửa hàng", href: "/product" },
  ],
};
// const items = [
//   {
//     label: "ád",
//     key: '0',
//   },
//   {
//     label: "ádc",
//     key: '1',
//   },
//   {
//     label:
//       'Nghệ thuật',
//     key: '3',
//   },

// ];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComHeader({ dataCart, updateCart }) {
  const socket = useSocket();
  const [openNotification, setOpenNotification] = useState(false);
  const [items, setCategory] = useState([
    {
      label:
        'Nghệ thuật',
      key: '3',
    },

  ]);

  const link = (e) => {
    console.log('====================================');
    console.log(e);
    console.log('====================================');
  }
  useEffect(() => {
    getData("/category")
      .then((data) => {
        const categoriesWithKeys = data.data.map((category, index) => {
          return { label: <a href={`/category/${category.label}`}> {category.label}</a>, key: index };
        });
        setCategory(categoriesWithKeys)
      })
  }, []);
  const showDrawer = () => {
    setOpenNotification(true);
  };

  const onClose = () => {
    setOpenNotification(false);
  };
  const [sortCate, setSortCate] = useState("all");
  const [countNoti, setCountNoti] = useState(false);
  const [open, setOpen] = useState(false);
  const [shoppingCart, setShoppingCart] = useState(false);
  const [follow, setFollow] = useState(false);
  const [sttLogin, setSttLogin] = useState(
    JSON.parse(localStorage.getItem("user")) || []
  );
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [token, setToken] = useStorage("user", {});

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // window.scrollTo(0, 0);
  }, []);
  const updateShoppingCartStatus = (newStatus) => {
    setShoppingCart(newStatus);
    updateCart && updateCart(newStatus);
  };

  const CreateProductMessenger = yup.object({
    search: yup.string(),
  });
  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
    defaultValues: {
      search: "",
    },
  });
  useEffect(() => {
    if (!token?._doc?._id) {
      // return navigate("/login");
    }
    getData(`/user/${token?._doc?._id}`)
      .then((user) => {
        setFollow(user?.data?.role);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token?._doc?._id]);
  useEffect(() => {
    setSttLogin(JSON.parse(localStorage.getItem("user")) || []);

    if (location.pathname === "/login" && token?.accessToken) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")));
  }, [dataCart, shoppingCart]);

  const { handleSubmit, register } = methods;
  const onSubmit = (data) => {
    if (data.search.trim() !== "") {
      navigate(`/search/${data.search.trim()}`);
    }
  };

  const handleClick = (link) => {
    const url = new URL(link);
    const pathname = url.pathname;
    navigate(pathname);
  };

  const [listNotification, setListNotification] = useState([]);

  useEffect(() => {
    socket?.on("notification", (data) => {
      if (data?.author === token._doc._id) {
        setListNotification((prevNotifications) => [
          ...prevNotifications,
          data,
        ]);
        setCountNoti(true);
      }
    });

    // Đảm bảo hủy lắng nghe khi component unmount
    return () => {
      socket?.off("notification");
    };
  }, [socket, token._doc]);

  useEffect(() => {
    (async () => {
      const res = await axios({
        url: "http://localhost:5000/api/notification",
        method: "get",
      });
      const result = await res.data;

      setListNotification(
        result?.filter((item) => item?.author === token?._doc?._id)
      );
    })();
  }, []);

  const renderType = (type) => {
    switch (type) {
      case 1:
        return "bài viết";
      case 2:
        return "follow";
      case 3:
        return "";

      default:
        break;
    }
  };

  const renderTail = (type) => {
    switch (type) {
      case 1:
        return "của bạn";
      case 2:
        return "bạn";
      case 3:
        return "bài viết";

      default:
        break;
    }
  };

  const changeSelectCate = (value) => {
    value === "" ? navigate("/") : navigate(`/?cate=${value}`);
  };
  return (
    <>
      <ShoppingCart
        show={shoppingCart}
        updateShoppingCart={updateShoppingCartStatus}
      ></ShoppingCart>
      <Affix offsetTop={0}>
        <div className="bg-white ">
          {/* Mobile menu */}
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                    <div className="flex px-4 pb-2 pt-5">
                      <button
                        type="button"
                        className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className=" border-gray-200 px-4 py-6">
                      {navigation.pages.map((page) => (
                        <div key={page.name} className="flow-root ">
                          <Link
                            to={page.href}
                            className=" block p-2 font-medium text-gray-900"
                          >
                            <div
                              className="flex gap-2"
                              style={{
                                fontFamily: `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'`,
                              }}
                            >
                              {page.icon}
                              {page.name}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>

                    {!sttLogin && (
                      <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                        <div className="flow-root">
                          <ComLink
                            to={routs["/login"].link}
                            className="-m-2 block p-2 font-medium text-gray-900"
                          >
                            {routs["/login"].name}
                          </ComLink>
                        </div>
                        <div className="flow-root">
                          <ComLink
                            to={routs["/reissue"].link}
                            className="-m-2 block p-2 font-medium text-gray-900"
                          >
                            {routs["/reissue"].name}
                          </ComLink>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <header className="relative bg-white z-10">
            <nav
              aria-label="Top"
              className="mx-auto max-w-full px-4 sm:px-6 lg:px-8"
            >
              <div className="border-b border-gray-200">
                <div className="flex h-16 items-center">
                  <button
                    type="button"
                    className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                    onClick={() => setOpen(true)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Logo */}
                  <div className="ml-4 flex lg:ml-0">
                    <ComLink to={routs["/"].link}>
                      <span className="sr-only">Your Company</span>
                      <img className="h-16 w-auto " src={images.logo1} alt="" />
                    </ComLink>
                  </div>

                  {/* Flyout menus */}
                  <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                    <div className="flex h-full space-x-8">
                      {navigation.pages.map((page) => (
                        <Link
                          key={page.name}
                          to={page.href}
                          className="flex items-center text-base font-medium text-gray-700 hover:text-gray-800"
                        >
                          <div
                            className="flex gap-2 justify-center"
                            style={
                              location.pathname === page.href
                                ? {
                                    padding: "5px",
                                    background: "#d3e7ff",
                                    borderRadius: "10px",
                                  }
                                : { padding: "5px" }
                            }
                          >
                            {page.icon}
                            <p>{page.name}</p>
                          </div>
                        </Link>
                      ))}
                      <Dropdown menu={{ items }}>
                        <Link
                          className="flex items-center text-base font-medium text-gray-700 hover:text-gray-800"
                          onClick={(e) => link(e)}
                        >
                          <Space>
                            Thể loại
                            <DownOutlined />
                          </Space>
                        </Link>
                      </Dropdown>
                    </div>
                  </Popover.Group>

                  <div className="ml-auto flex items-center">
                    {/* Search */}
                    <div className="flex lg:ml-6">
                      <FormProvider {...methods}>
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="lg:w-96"
                        >
                          <ComInput
                            placeholder={textApp.Header.search}
                            search
                            type="text"
                            {...register("search")}
                          />
                        </form>
                      </FormProvider>
                    </div>
                    <div className="ml-4 flow-root lg:ml-6">
                      <button
                        type="button"
                        className="group -m-2 flex items-center p-2"
                      >
                        <BellIcon
                          onClick={showDrawer}
                          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        {countNoti && (
                          <span
                            className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800"
                            style={{
                              background: "#e13232",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              position: "absolute",
                              top: "20px",
                              right: "140px",
                            }}
                          ></span>
                        )}
                      </button>
                    </div>
                    {/* Cart */}
                    <div className="ml-4 flow-root lg:ml-6">
                      <button
                        onClick={() => {
                          setShoppingCart(true);
                        }}
                        className="group -m-2 flex items-center p-2"
                      >
                        <ShoppingBagIcon
                          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                          {dataCart?.length || cart.length}
                        </span>
                        <span className="sr-only">items in cart, view bag</span>
                      </button>
                    </div>
                    {/* login */}
                    {!sttLogin?._doc && (
                      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6 lg:ml-6">
                        <ComLink
                          to={routs["/login"].link}
                          className="text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                          {routs["/login"].name}
                        </ComLink>
                        <span
                          className="h-6 w-px bg-gray-200"
                          aria-hidden="true"
                        />
                        <ComLink
                          to={routs["/reissue"].link}
                          className="text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                          {routs["/reissue"].name}
                        </ComLink>
                      </div>
                    )}

                    {sttLogin?._doc && (
                      <div>
                        <Menu as="div" className="relative ml-3 z-50">
                          <div>
                            <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <img
                                on
                                className="h-8 w-8 rounded-full"
                                src={token?._doc?.avatar}
                                alt=""
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {sttLogin?._doc?.role === "staff" && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <ComLink
                                      to={routs["/createProduct"].link}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {routs["/createProduct"].name2}
                                    </ComLink>
                                  )}
                                </Menu.Item>
                              )}
                              <Menu.Item>
                                {({ active }) => (
                                  <ComLink
                                    to={"/profile"}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Trang cá nhân
                                  </ComLink>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <ComLink
                                    to={routs["/order"].link}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {routs["/order"].name}
                                  </ComLink>
                                )}
                              </Menu.Item>
                              {follow === "creator" && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <ComLink
                                      to={"/my/order"}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Đơn bán hàng
                                    </ComLink>
                                  )}
                                </Menu.Item>
                              )}
                              {follow === "creator" && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <ComLink
                                      to="/my/product/table"
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Sản phẩm của tôi
                                    </ComLink>
                                  )}
                                </Menu.Item>
                              )}

                              {/* {follow === "creator" && ( */}
                                <Menu.Item>
                                  {({ active }) => (
                                    <ComLink
                                      to={"/orderRequest"}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Đơn hàng theo yêu cầu
                                    </ComLink>
                                  )}
                                </Menu.Item>
                              {/* )} */}
                              <Menu.Item>
                                {({ active }) => (
                                  <ComLink
                                    to={routs["/logout"].link}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {routs["/logout"].name}
                                  </ComLink>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          </header>
        </div>
      </Affix>
      <Drawer title="Notification" onClose={onClose} open={openNotification}>
        {listNotification?.map((item, key) => (
          <div
            style={{ cursor: "pointer", padding: "5px" }}
            className="shadow-md"
            // onClick={() => handleClick(item?.link)}
            key={key}
          >
            <Link
              to={`/author/${item?.pusher?._id}`}
              style={{ color: "#509adb", fontWeight: "500" }}
            >
              {item?.pusher?.name}
            </Link>{" "}
            {item?.textType}{" "}
            <Link
              to={`/artwork/${item?.artwork?._id}`}
              style={{ color: "#509adb", fontWeight: "500" }}
            >
              {renderType(item?.type)} {renderTail(item?.type)}
            </Link>
          </div>
        ))}
      </Drawer>
      <FloatButton.BackTop />
    </>
  );
}
