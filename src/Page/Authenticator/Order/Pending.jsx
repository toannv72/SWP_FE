import React, { useEffect, useState } from "react";
import { textApp } from "../../../TextContent/textApp";
import { getData, putData } from '../../../api/api';
import { notification, Button, Modal } from "antd";

export default function Pending({ activeTab }) {
  const [order, setOrder] = useState([]);
  const [runData, setRunData] = useState(true);
  const [products, setProducts] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    getData('/product/staff', {})
      .then((productData) => {
        setProducts(productData?.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    getData('/order/user/pending', {})
      .then((orderData) => {
        setOrder(orderData?.data?.docs);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, [activeTab, runData]);

  const getProductById = (productId) => {
    return products?.docs?.find(product => product._id === productId);
  };

  const formatCurrency = (number) => {
    if (typeof number === "number") {
      return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND',
      });
    }
  };

  const showCancelConfirm = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    putData(`/order/user/put`, selectedOrderId)
      .then((response) => {
        api["success"]({
          message: textApp.CreateProduct.Notification.m2.message,
          description: "Đơn hàng đã hủy thành công"
        });
        setRunData(!runData);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error cancelling order:', error);
        setIsModalOpen(false);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      {contextHolder}

      <h1 className="text-2xl font-semibold mb-4">{textApp.OrderHistory.title}</h1>
      {order.length === 0 ? (
        <div className="flex items-center justify-center">
          <img src="https://scontent.xx.fbcdn.net/v/t1.15752-9/387617289_1488249585293161_8412229123543921784_n.png?stp=dst-png_p206x206&_nc_cat=110&ccb=1-7&_nc_sid=510075&_nc_ohc=hHxANJqwuwkAX_sXNHt&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdQeoEZATHmwgJLQhLl8DtJKleoOXNx0srTVU-mC4LAZeQ&oe=65636A95" alt="" />
        </div>
      ) : order.error ? (
        <p>Error: {order.error.message}</p>
      ) : (
        <ul role="list" className="divide-y divide-gray-200">
          {order.map((orderData) => (
            <li key={orderData.index} className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="col-span-2">
                  <h2 className="text-lg font-semibold mb-2">{textApp.OrderHistory.product.amount} {formatCurrency(orderData.totalAmount)}</h2>
                  <ul className="space-y-4">
                    {orderData.products.map((product, id) => {
                      const productInfo = getProductById(product.product);
                      const materials = productInfo?.material?.join(', ');
                      return (
                        <li key={id} className="flex items-center space-x-4">
                          <img
                            className="w-16 h-16 rounded-full bg-gray-200"
                            src={productInfo?.image}
                            alt=""
                          />
                          <div className="flex-1">
                            <p className="text-lg font-semibold">{productInfo?.name}</p>
                            <p className="text-gray-500">{materials}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {textApp.OrderHistory.product.quantity} {product?.quantity}
                          </div>
                          <div className="text-sm text-gray-900">
                            {textApp.OrderHistory.product.price} {formatCurrency(productInfo?.reducedPrice)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="col-span-1 mt-4 md:mt-0">
                  <div className="flex flex-col items-end mb-4">
                    <div className="flex-none bg-yellow-400 text-white rounded-full px-3 py-1 mb-2">
                      {textApp.OrderHistory.label.status}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 mt-4 md:mt-0">
                  <div className="flex flex-col items-end mb-4">
                    <div className="flex items-center space-x-2">
                      {orderData.status !== 'Canceled' && (
                        <button
                          className="bg-orange-400 text-white rounded-md px-2 py-1"
                          onClick={() => showCancelConfirm(orderData._id)}>
                          {textApp.OrderHistory.button.cancel}
                        </button>
                      )}
                      <button className="text-gray-900 font-semibold rounded-md">
                        {textApp.OrderHistory.button.contact}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        title="Xác nhận hủy đơn hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng?</p>
        <Button

                        type="primary"
                        danger
                        onClick={handleOk}
                    >
                        Xác nhận
                    </Button>
                    <Button
                        type="default"
                        primary
                        onClick={handleCancel}
                    >
                       Hủy
                    </Button>
      </Modal>
    </div>
  );
}
