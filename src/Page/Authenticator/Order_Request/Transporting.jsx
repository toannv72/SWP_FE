import React, { useEffect, useState } from "react";
import { textApp } from "../../../TextContent/textApp";
import { getData, putData } from "../../../api/api";
import { Button } from "antd";
import { Link } from "react-router-dom";
export default function Transporting({ activeTab }) {
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

    getData("customOrder/user/shipped", {})
      .then((orderData) => {
        const newArray =
          orderData.data.userOrders.length > 0
            ? orderData.data.userOrders.map((item) => {
                const updatedItem = { ...item };
                updatedItem.userOrders = true;
                return updatedItem;
              })
            : [];
        const combinedOrders = [
          ...orderData.data.freelancerOrders,
          ...newArray,
        ];
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
  const getProductById = (productId) => {
    // Tìm sản phẩm theo ID trong danh sách sản phẩm
    return products?.docs?.find((product) => product._id === productId);
  };
  const updateStatus = (id, status) => {
    putData("customOrder/user/processing", id, { status })
      .then((data) => {
        console.log(data);
        setOrder(order.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
    setOrder(order.filter((item) => item._id !== id));
  };
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
                Tên Người làm
              </th>
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
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng Thái</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {order?.map((orderData) => (
              <tr key={orderData.index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/author/${orderData.freelancer._id}`}>
                    {orderData.freelancer.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/required/bill/${orderData._id}?view=true`}>
                    {orderData.bird}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/author/${orderData.user}`}>{orderData.name}</Link>
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
                  {/* {orderData.price} */}
                  Thỏa thuận
                </td>
                {orderData?.userOrders && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      type="primary"
                      ghost
                      onClick={() => updateStatus(orderData._id, "Delivered")}
                    >
                      Đã nhận được hàng
                    </Button>
                  </td>
                )}
                <td>
                  <Link to={`/required/bill/${orderData._id}?view=true`}>
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      width="32px"
                      height="32px"
                      viewBox="0,0,256,256"
                    >
                      <g
                        fill="#000000"
                        fillRule="nonzero"
                        stroke="none"
                        strokeWidth={1}
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                        strokeMiterlimit={10}
                        strokeDasharray
                        strokeDashoffset={0}
                        fontFamily="none"
                        fontWeight="none"
                        fontSize="none"
                        textAnchor="none"
                        style={{ mixBlendMode: "normal" }}
                      >
                        <g transform="scale(8,8)">
                          <path d="M6,3v26h10.77148l2,-2h-10.77148v-22h10v6h6v5.4375c0.633,-0.225 1.303,-0.36611 2,-0.41211v-6.43945l-6.58594,-6.58594zM20,6.41406l2.58594,2.58594h-2.58594zM11,14v2h10v-2zM11,18v2h10v-2zM26.5,18c-3,0 -5.5,2.5 -5.5,5.5c0,1.2 0.4,2.19961 1,3.09961l-4,4l1.40039,1.40039l4,-4c0.9,0.6 1.99961,1 3.09961,1c3,0 5.5,-2.5 5.5,-5.5c0,-3 -2.5,-5.5 -5.5,-5.5zM26.5,20c1.9,0 3.5,1.6 3.5,3.5c0,1.9 -1.6,3.5 -3.5,3.5c-1.9,0 -3.5,-1.6 -3.5,-3.5c0,-1.9 1.6,-3.5 3.5,-3.5zM11,22v2h6v-2z" />
                        </g>
                      </g>
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
