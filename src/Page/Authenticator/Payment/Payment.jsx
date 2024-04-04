import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComFooter from "../../Components/ComFooter/ComFooter";
import ComHeader from "../../Components/ComHeader/ComHeader";
import { faCreditCard } from "@fortawesome/free-regular-svg-icons";
import { textApp } from "../../../TextContent/textApp";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import ComInput from "../../Components/ComInput/ComInput";
import ComTextArea from "../../Components/ComInput/ComTextArea";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../../api/api";
import { Button, Radio, notification } from "antd";
import { useStorage } from "../../../hooks/useLocalStorage";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
export default function Payment(props) {
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();
  const dataProduct = location?.state?.dataProduct || null;
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || []
  );
  const [checked, setChecked] = useState(1);
  const [token, setToken] = useStorage("user", {});

  const onChange = (e) => {
    setChecked(e.target.value);
  };
  useEffect(() => {
    if (!user?._doc?.username) {
      navigate(`login`);
    }
  }, []);
  const loginMessenger = yup.object({
    name: yup.string().required(textApp.Payment.information.message.name),
    shippingAddress: yup
      .string()
      .required(textApp.Payment.information.message.address),
    phone: yup
      .string()
      .required(textApp.Payment.information.message.phone)
      .min(10, "Số điện thoại phải lớn hơn 9 số!")
      .max(11, "Số điện thoại phải nhỏ hơn 12 số!")
      .matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    email: yup
      .string()
      .email(textApp.Payment.information.message.emailError)
      .required(textApp.Payment.information.message.email),
  });

  const LoginRequestDefault = {
    email: token?._doc?.email,
    phone: token?._doc?.phone,
    shippingAddress: token?._doc?.address,
  };
  const methods = useForm({
    resolver: yupResolver(loginMessenger),
    defaultValues: {
      // code: "",
    },
    values: LoginRequestDefault,
  });
  const promotion = useForm({});
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  const onSubmit = (data) => {
    // ...

    // Tạo mảng các đơn hàng cho từng người dùng
    const orders = finalResult.map((userData) => {
      const productPost = userData.products.map((product, index) => {
        return {
          product: product.productId,
          price: product.productPrice,
          quantity: product.productQuantity,
          name: product.productName,
          _id: product._id,
          seller: userData.userId,
        };
      });

      return {
        ...data,
        amount: userData.totalAmount + userData.shippingFee,
        shippingAddress: data.shippingAddress,
        description: data.description,
        email: data.email,
        phone: data.phone,
        products: productPost,
        totalAmount: userData.totalAmount + userData.shippingFee,
        seller: userData.userId, // Thêm userId cho mỗi đơn hàng
        user: token._doc._id,
      };
    });

    // Lặp qua các đơn hàng và thực hiện đăng ký
    orders.forEach((order) => {
      if (checked === 1) {
        console.log(order);
        postData("/order/user", { ...order, payment: "Cash" })
          .then((data) => {
            navigate(`/order`);
            setDisabled(false);
          })
          .catch((error) => {
            console.log(error);
            api["error"]({
              message: textApp.Payment.error,
              description: error?.response?.data?.error,
            });
            setDisabled(false);
          });
      } else {
        console.log(order);
        postData("/order/user", { ...order, payment: "Paypal" })
          .then((data) => {
            navigate(`/order`);
            setDisabled(false);
          })
          .catch((error) => {
            console.log(error);
            api["error"]({
              message: textApp.Payment.error,
              description: error?.response?.data?.error,
            });
            setDisabled(false);
          });
        // console.log(order);
        // postData("/order/pay", order)
        //   .then((data) => {
        //     window.location.href = data.url;
        //     setDisabled(false);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     api["error"]({
        //       message: textApp.Payment.error,
        //       description: error?.response?.data?.error,
        //     });
        //     setDisabled(false);
        //   });
      }
    });
  };
  function ButtonPayment() {
    const [{ isPending }] = usePayPalScriptReducer();
    const price = parseFloat(calculateTotalToPay() / 23000).toFixed(2);
    const paypalbuttonTransactionProps = {
      style: { layout: "vertical" },
      createOrder(data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: price,
              },
            },
          ],
        });
      },
      onApprove(data, actions) {
        return actions.order.capture({}).then((details) => {
          onSubmit({
            description: methods.getValues("description"),
            email: methods.getValues("email"),
            name: methods.getValues("name"),
            phone: methods.getValues("phone"),
            shippingAddress: methods.getValues("shippingAddress"),
          });
        });
      },
    };
    return (
      <>
        {isPending ? <h2>Load Smart Payment Button...</h2> : null}
        <PayPalButtons {...paypalbuttonTransactionProps} />
      </>
    );
  }
  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    return number?.toLocaleString("en-US", {
      style: "currency",
      currency: "VND",
    });
  }

  const userTotals = {};
  console.log(dataProduct);
  // Lặp qua từng sản phẩm để tính tổng tiền
  dataProduct?.forEach((product) => {
    const userId = product?.user?._id;
    const totalPrice = product.price * product.data;

    // Thêm vào đối tượng userTotals
    if (!userTotals[userId]) {
      userTotals[userId] = {
        userId: userId,
        totalAmount: 0,
        products: [],
      };
    }

    userTotals[userId].totalAmount += totalPrice;
    userTotals[userId].products.push({
      productId: product._id,
      productName: product.name,
      _id: product._id,
      productPrice: product.price,
      productQuantity: product.data,
    });
  });

  // Lặp lại đối tượng userTotals để kiểm tra và áp dụng phí vận chuyển
  for (const userId in userTotals) {
    const totalAmount = userTotals[userId].totalAmount;

    // Kiểm tra và áp dụng phí vận chuyển
    if (totalAmount < 1000000) {
      userTotals[userId].shippingFee = 40000; // Phí shipper là 40k
    } else {
      userTotals[userId].shippingFee = 0; // Miễn phí vận chuyển nếu tổng tiền trên 1 triệu
    }
  }

  // Chuyển đối tượng thành mảng cuối cùng
  const finalResult = Object.values(userTotals);
  console.log("🚀 ~ Payment ~ finalResult:", finalResult)

  const calculateTotalToPay = () => {
    let totalToPay = 0;

    finalResult.forEach((userData) => {
      totalToPay += userData.totalAmount + userData.shippingFee;
    });

    return totalToPay;
  };
  console.log(finalResult);

  return (
    <>
      {contextHolder}
      <ComHeader />
      <div className="flex justify-center flex-col py-5 text-center">
        <FontAwesomeIcon
          icon={faCreditCard}
          size="7x"
          style={{ color: "#6e7887" }}
        />
        <h1 className="text-4xl">{textApp.Payment.title}</h1>
        <p className="text-2xl">{textApp.Payment.message}</p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col p-4 md:w-1/3 order-1 md:order-2 mb-4 md:mb-0">
          <FormProvider {...promotion}>
            <form onSubmit={onSubmit} className="text-black text-lg">
              <h4 className="flex justify-between items-center mb-3 text-gray-600">
                <span>{textApp.Payment.quantity}</span>
                <span className="bg-blue-500 text-white rounded-full py-1 px-2">
                  {dataProduct?.length}
                </span>
              </h4>
              <ul className="list-group mb-3">
                {finalResult.map((userData, index) => (
                  <div key={index} className="user-container">
                    <ul className="list-group">
                      {userData.products.map((product, productIndex) => (
                        <li
                          key={productIndex}
                          className="list-group-item flex justify-between items-center"
                        >
                          <div>
                            <h6 className="my-0">{product.productName}</h6>
                            <small className="text-gray-500">
                              {formatCurrency(product.productPrice)} x{" "}
                              {product.productQuantity}
                            </small>
                          </div>
                          <span className="text-gray-500">
                            {formatCurrency(
                              product.productPrice * product.productQuantity
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="shipping-fee">
                      Tiền giao hàng: {formatCurrency(userData.shippingFee)}
                    </div>
                    <div className="total-amount">
                      Total Amount:{" "}
                      {formatCurrency(
                        userData.totalAmount + userData.shippingFee
                      )}
                    </div>
                    -----------------------------------
                  </div>
                ))}
                <li className="list-group-item flex justify-between items-center text-black text-xl">
                  <span>{textApp.Payment.totalMoney}</span>
                  <strong>{formatCurrency(calculateTotalToPay())}</strong>
                </li>
              </ul>
            </form>
          </FormProvider>
        </div>

        <div className="flex flex-col p-4 md:w-2/3 md:order-1 order-2 md:pl-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h4 className="mb-6 text-black text-2xl">
                {textApp.Payment.information.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <ComInput
                    placeholder={textApp.Payment.information.placeholder.name}
                    label={textApp.Payment.information.label.name}
                    {...register("name")}
                    required
                  />
                </div>
                <div>
                  <ComInput
                    placeholder={
                      textApp.Payment.information.placeholder.address
                    }
                    label={textApp.Payment.information.label.address}
                    {...register("shippingAddress")}
                    required
                  />
                </div>
                <div>
                  <ComInput
                    placeholder={textApp.Payment.information.placeholder.phone}
                    label={textApp.Payment.information.label.phone}
                    type={"numbers"}
                    {...register("phone")}
                    required
                  />
                </div>
                <div>
                  <ComInput
                    placeholder={textApp.Payment.information.placeholder.email}
                    label={textApp.Payment.information.label.email}
                    {...register("email")}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <ComTextArea
                    placeholder={
                      textApp.Payment.information.placeholder.description
                    }
                    label={textApp.Payment.information.label.description}
                    rows={4}
                    defaultValue={""}
                    maxLength={1000}
                    {...register("description")}
                  />
                </div>
              </div>
              <h4 className="mb-3 text-gray-600 text-lg">
                {textApp.Payment.payments}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center mb-2">
                  <Radio.Group
                    onChange={onChange}
                    value={checked}
                    className="grid "
                  >
                    <Radio value={1}>tiền mặt</Radio>
                    <Radio value={2}>Paypal</Radio>
                  </Radio.Group>
                </div>
              </div>
              {checked === 1 ? (
                <div style={{ width: "61%" }}>
                  <Button
                    disabled={disabled}
                    className=" flex justify-center bg-blue-500 h-12 text-white py-3 px-6 rounded-lg w-full "
                    type="primary"
                    htmlType="submit"
                  >
                    {textApp.Payment.orderButton}
                  </Button>
                </div>
              ) : (
                <div>
                  <PayPalScriptProvider
                    options={{
                      "client-id": dataProduct[0].user.paypalAccount,
                      currency: "USD",
                    }}
                  >
                    <ButtonPayment />
                  </PayPalScriptProvider>
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>

      <ComFooter />
    </>
  );
}
