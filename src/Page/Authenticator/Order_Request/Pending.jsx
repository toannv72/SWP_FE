import React, { useEffect, useState } from "react";
import { textApp } from "../../../TextContent/textApp";
import { getData, putData } from "../../../api/api";
import { Button } from "antd";
import { Link } from "react-router-dom";
export default function Pending({ activeTab }) {
  const [order, setOrder] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getData("/product", {})
      .then((productData) => {
        setProducts(productData?.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    getData("customOrder/user/pending", {})
      .then((orderData) => {
        const newArray =
          orderData.data.freelancerOrders.length > 0
            ? orderData.data.freelancerOrders.map((item) => {
                const updatedItem = { ...item };
                updatedItem.freelancerOrders = true;
                return updatedItem;
              })
            : [];
        const combinedOrders = [...orderData.data.userOrders, ...newArray];
        setOrder(combinedOrders);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
    // }
  }, [activeTab]);

  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        style: "currency",
        currency: "VND",
      });
    }
  }
  const updateStatus = (id,status) => {
      putData("customOrder/user/processing", id, { status })
        .then((data) => {
          setOrder(order.filter((item) => item._id !== id));
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
        setOrder(order.filter((item) => item._id !== id));
}
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        {textApp.OrderHistory.title}
      </h1>
      {order?.length === 0 ? (
        <div class="flex items-center justify-center">
          <img
            src="https://scontent.xx.fbcdn.net/v/t1.15752-9/387617289_1488249585293161_8412229123543921784_n.png?stp=dst-png_p206x206&_nc_cat=110&ccb=1-7&_nc_sid=510075&_nc_ohc=hHxANJqwuwkAX_sXNHt&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdQeoEZATHmwgJLQhLl8DtJKleoOXNx0srTVU-mC4LAZeQ&oe=65636A95"
            alt=""
          />
        </div>
      ) : order?.error ? (
        <p>Error: {order?.error.message}</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên Đơn Hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên Người Đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số Điện Thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Địa Chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày Đặt Hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số Lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số Tiền{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {order?.map((orderData) => (
              <tr key={orderData.index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/required/bill/${orderData._id}`}>
                    View Details
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orderData.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orderData.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orderData.shippingAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orderData.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orderData.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orderData.price === 0
                    ? "0"
                    : formatCurrency(orderData.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orderData.status}
                </td>
                {orderData?.freelancerOrders && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      type="primary"
                      ghost
                      onClick={() => updateStatus(orderData._id, "Processing")}
                    >
                      Chấp nhận
                    </Button>
                    <span style={{ padding: "2px" }}></span>
                    <Button
                      danger
                      onClick={() => updateStatus(orderData._id, "Canceled")}
                    >
                      Từ chối
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
