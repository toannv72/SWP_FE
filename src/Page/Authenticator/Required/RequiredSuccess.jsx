import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ComHeader from "../../Components/ComHeader/ComHeader";
import ComFooter from "../../Components/ComFooter/ComFooter";
import { textApp } from "../../../TextContent/textApp";
import { getData } from "../../../api/api"; // Import hàm lấy dữ liệu từ API (điều này phụ thuộc vào cách bạn lưu trữ dữ liệu đơn hàng)
import { Image } from "antd";

const RequiredSuccess = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const orderIdFromPath = location.pathname.split("/").pop();

    // Lấy thông tin đơn hàng từ nguồn dữ liệu (hoặc API)
    getData(`/customOrder/user/${orderIdFromPath}`)
      .then((data) => {
        setOrderDetails(data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      });
  }, [location]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ComHeader />
      <div className="flex items-center justify-center">
        <div
          className="bg-white p-4 md:p-8 lg:p-12 rounded-lg shadow-md w-full md:w-3/4 lg-w-1/2 xl:w-1/3"
          style={{ margin: "100px" }}
        >
          <h1 className="bg-blue-500 text-white py-2 px-4 rounded-md text-center block w-full text-2xl font-semibold mb-4">
            {location.search ? "Thông Tin Đơn Hàng" : textApp.Invoice.title}
          </h1>
          {location.search ? (
            ""
          ) : (
            <>
              <p className="text-gray-600 mb-2">{textApp.Invoice.status}</p>
              <p className="text-gray-600 mb-6">{textApp.Invoice.thankyou}</p>
            </>
          )}
          <h2 className="text-lg font-semibold mb-2">
            Thông tin người đặt hàng
          </h2>
          <p className="text-gray-600 mb-2">
            Tên người đặt hàng: {orderDetails.name}
          </p>
          <p className="text-gray-600 mb-2">
            Số điện thoại: {orderDetails.phone}
          </p>
          <p className="text-gray-600 mb-2">
            Địa chỉ: {orderDetails.shippingAddress}
          </p>
          <p className="text-gray-600 mb-6">
            Ngày đặt hàng:{" "}
            {new Date(orderDetails.createdAt).toLocaleDateString("en-US")}
          </p>
          <h2 className="text-lg font-semibold mb-2">{textApp.Invoice.info}</h2>
          <div className="mb-4 flex items-center">
            {/* Hiển thị hình ảnh */}

            <div className="w-24 h-24 object-cover rounded-lg flex items-center" >
              <Image.PreviewGroup
                items={orderDetails.image}

              >
                <Image
                  maskClassName="w-full h-full object-cover object-center lg:h-full lg:w-full "
                  src={orderDetails.image}
                  alt={orderDetails.image}
                />
              </Image.PreviewGroup>
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold">
                Tên sản phẩm: {orderDetails.bird}
              </p>
              <p className="text-gray-600 mb-2">
                Số lượng: {orderDetails.quantity}
              </p>
              <p className="text-gray-600 mb-2">
                Thể loại: {orderDetails.material.join(", ")}
              </p>
            </div>


            <div className="w-40">

            </div>
            {/* <Image
              width={200}
              style={{
                display: "none",
              }}
              src={orderDetails.image}
              preview={{
                visible,
                src: orderDetails.image,
                onVisibleChange: (value) => {
                  setVisible(value);
                },
              }}
            /> */}
          </div>
          <p className="text-gray-600 mb-2">
            Mô tả: {orderDetails.description}
          </p>
          <Link
            to="/"
            className="bg-blue-500 hover-bg-blue-600 text-white py-2 px-4 rounded-md text-center block w-full max-w-xs mx-auto"
          >
            {textApp.Invoice.button}
          </Link>
        </div>
      </div>
      <ComFooter />
    </>
  );
};

export default RequiredSuccess;
