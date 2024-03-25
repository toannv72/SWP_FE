import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import ComHeader from "../../Components/ComHeader/ComHeader";
import ComImage from "../../Components/ComImage/ComImage";
import { getData } from "../../../api/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { textApp } from "../../../TextContent/textApp";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ComNumber from "../../Components/ComInput/ComNumber";
import { Button, notification } from "antd";
import PageNotFound from "../404/PageNotFound";
import { useStorage } from "../../../hooks/useLocalStorage";

export default function Product() {
  const [Product, setProduct] = useState([]);
  console.log("🚀 ~ Product ~ Product:", Product)
  const [image, setImage] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const { slug } = useParams();
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [token, setToken] = useStorage("user", {});
  const [sttCart, setSttCart] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || []
  );
  const [error, setError] = useState(false);
  const [allUser, setAllUser] = useState([]);

  const location = useLocation();

  const navigate = useNavigate();

  const productQuantity = yup.object({
    quantity: yup
      .number()
      .max(
        Product?.quantity,
        `Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này`
      )
      .min(1, textApp.Product.message.min)
      .typeError(textApp.Product.message.quantity),
  });
  const LoginRequestDefault = {
    // quantity: "1",
  };
  const methods = useForm({
    resolver: yupResolver(productQuantity),
    defaultValues: {
      quantity: 1,
    },
    values: LoginRequestDefault,
  });
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  useEffect(() => {
    getData("/user", {})
      .then((data) => {
        setAllUser(data?.data?.docs);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
    // return response.data.docs;
  }, []);
  useEffect(() => {
    getData(`/product/${slug}`)
      .then((product) => {
        setProduct(product.data);
        if (product?.data?.quantity < 1) {
          setDisabled(true);
        }
        console.log(product);
      })
      .catch((error) => {
        setError(true);
      });
  }, [slug]);

  useEffect(() => {
    if (Product?.image) {
      setImage(
        Product?.image.map((image) => ({
          original: image,
          thumbnail: image,
          className: "w-24 h-24",
        }))
      );
    }
  }, [Product]);

  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        style: "currency",
        currency: "VND",
      });
    }
  }
  const onSubmit = (data) => {
    getData(`/product/${slug}`)
      .then((product) => {
        if (product?.data?.user?.hidden) {
          api["error"]({
            message: "sản phẩm đang bị khóa",
            description: "sản phẩm đang bị khóa hoặc chủ sản phẩm đang bị khóa",
          });
        } else {
          if (!user?._doc?.username) {
            return navigate("/login", { state: location.pathname });
          }
          console.log(data);
          const product = [{ ...Product, data: data.quantity }];
          navigate("/payment", { state: { dataProduct: product } });
        }
      })
      .catch((error) => {
        setError(true);
      });
  };
  const addToCart = (data) => {
    const existingProductIndex = cart.findIndex(
      (item) => item._id === Product?._id
    );
    const updatedCart = [...cart];
    console.log(existingProductIndex);
    console.log(updatedCart);
    getData(`/product/${slug}`)
      .then((product) => {
        if (product?.data?.user?.hidden) {
          api["error"]({
            message: "sản phẩm đang bị khóa",
            description: "sản phẩm đang bị khóa hoặc chủ sản phẩm đang bị khóa",
          });
        } else {
          if (existingProductIndex !== -1) {
            if (
              updatedCart[existingProductIndex].quantityCart === data.quantity
            ) {
              api["warning"]({
                message: textApp.Product.Notification.m3.message,
                description: textApp.Product.Notification.m3.description,
              });
              return;
            }

            updatedCart[existingProductIndex].data = 1;
            setCart(updatedCart);
            api["success"]({
              message: textApp.Product.Notification.m2.message,
              description: textApp.Product.Notification.m2.description,
            });
          }
          if (existingProductIndex === -1) {
            const updatedCart = [...cart, { ...Product, data: 1 }];
            setCart(updatedCart);
            api["success"]({
              message: textApp.Product.Notification.m1.message,
              description: textApp.Product.Notification.m1.description,
            });
          }
        }
      })
      .catch((error) => {
        setError(true);
      });
  };
  const updateCart = (data) => {
    setSttCart(!sttCart);
  };
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")));
  }, [sttCart]);
  if (error || !Product || Product?.user?.hidden) {
    return <PageNotFound />;
  }
  const getUserById = (array, userId) => {
    // Sử dụng find để tìm user với _id tương ứng
    const user = array.find((item) => item._id === userId);
    return user;
  };
  console.log("====================================");
  console.log(Product);
  console.log("====================================");
  return (
    <>
      {contextHolder}
      <ComHeader dataCart={cart} updateCart={updateCart} />
      <div className="bg-white">
        <div className="">
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-8">
            <div className="product">
              <ComImage product={image} />
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {Product?.name}
              </h3>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Người Bán:{" "}
                <Link
                  to={`/author/${Product?.user?._id}`}
                  className="text-2xl font-bold tracking-tight text-cyan-600 sm:text-3xl"
                >
                  {/* {getUserById(allUser, Product.user)?.name} */}
                  {Product?.user?.name}
                </Link>
              </h3>
              <div className="flex gap-6">
                <p className="text-3xl tracking-tight text-gray-900 ">
                  {Product?.price && formatCurrency(Product?.price)}
                </p>
              </div>
              <div className="flex pt-2">
                Đã bán: <h2 className="text-indigo-600 "> {Product?.sold}</h2>
              </div>
              <div className="flex pt-2">
                {textApp.Product.page.genre}
                <div className="text-indigo-600 ">
                  {Product?.genre?.map((e) => ` #${e}`)}
                </div>
                {/* {Product?.material?.[1]},{Product?.material?.[2]}. */}
              </div>
              <FormProvider {...methods}>
                <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <div className="flex gap-4 items-center">
                      <h3 className="text-sm font-medium text-gray-900 ">
                        {textApp.Product.page.quantity}
                      </h3>

                      <ComNumber
                        className="w-24 text-sm"
                        min={disabled ? 0 : 1}
                        defaultValue={1}
                        max={Product?.quantity}
                        {...register("quantity")}
                      />
                      <div className="">
                        {Product?.quantity} sản phẩm có sẵn
                      </div>
                      <Button
                        type="button"
                        onClick={addToCart}
                        disabled={token?._doc?._id === Product?.user?._id}
                        className={`flex h-10 items-center justify-center rounded-md border border-transparent  px-4 py-2 text-base font-medium text-white  focus:outline-none 
                                                 hover:to-orange-500 hover:from-orange-600 bg-gradient-to-b from-orange-400 to-orange-500 
                                                 ${token?._doc?._id === Product?.user?._id
                            ? " hidden"
                            : ""
                          } 
                          ${!token?._doc?._id
                            ? " hidden"
                            : ""
                          }
                          
                          `}
                      >
                        {textApp.Product.button.add}
                      </Button>
                    </div>
                  </div>
                  {token?._doc?._id !== Product?.user?._id ? <></> : <p className="text-red-600 ">Bạn không thể mua sản phẩm của chính mình</p>}
                  <Button
                    disabled={
                      disabled || token?._doc?._id === Product?.user?._id
                    }
                    htmlType="submit"
                    type="primary"
                    className={`mt-10 flex w-full h-12 items-center justify-center rounded-md border border-transparent  px-8 py-3 text-base font-medium text-white ${disabled
                      ? " bg-slate-700"
                      : "hover:to-sky-700 hover:from-sky-800 bg-gradient-to-b from-sky-600 to-sky-700"
                      }  `}
                  >
                    {textApp.Product.button.pay}
                  </Button>
                </form>
              </FormProvider>
            </div>
          </div>
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="py-10 lg:col-span-2 lg:col-start-1   lg:pb-16  lg:pt-6 ">
              <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Mô tả chi tiết
              </p>
              <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {Product?.description}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
