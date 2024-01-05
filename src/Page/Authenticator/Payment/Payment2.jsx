import { useState } from "react";
import "./Payment.css";
import ComHeader from "../../Components/ComHeader/ComHeader";
function LeftComponent() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  return (
    <div className="left-component">
      <h2>Thông tin thanh toán</h2>
      <div className="input-group">
        <label>Họ tên:</label>
        <input
          placeholder="Nhập họ tên của bạn"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Số điện thoại:</label>
        <input
          placeholder="Nhập số điện thoại của bạn"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Địa chỉ:</label>
        <input
          placeholder="Nhập địa chỉ của bạn"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Email:</label>
        <input
          placeholder="Nhập email của bạn"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Thông tin bổ sung:</label>
        <textarea
          placeholder="Nhập thông tin bổ sung (nếu có)"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>
    </div>
  );
}

function RightComponent() {
  const [paymentMethod, setPaymentMethod] = useState(""); // Lựa chọn phương thức thanh toán

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="right-component">
      <h2
        style={{
          fontWeight: "bold",
          color: "red",
        }}
      >
        Đơn hàng của bạn
      </h2>
      <table>
        <thead>
          <tr>
            <th>Sản Phẩm</th>
            <th>Tạm tính</th>
          </tr>
        </thead>
        <tbody>
          {/* Dòng mẫu, bạn có thể thêm nhiều dòng sản phẩm ở đây */}
          <tr>
            <td>Tên sản phẩm 1</td>
            <td>$100</td>
          </tr>
          <tr>
            <td>Tên sản phẩm 2</td>
            <td>$150</td>
          </tr>
        </tbody>
      </table>
      <div className="payment-options">
        <h3
          // in đậm
          style={{ fontWeight: "bold" }}
        >
          Phương thức thanh toán
        </h3>
        <label>
          <input
            type="radio"
            value="chuyenkhoan"
            checked={paymentMethod === "chuyenkhoan"}
            onChange={handlePaymentMethodChange}
          />
          Chuyển khoản
        </label>
        <label>
          <input
            type="radio"
            value="tienmat"
            checked={paymentMethod === "tienmat"}
            onChange={handlePaymentMethodChange}
          />
          Trả tiền mặt khi nhận hàng
        </label>

        {/* thông báo xác nhận */}
        {paymentMethod === "chuyenkhoan" && (
          <div className="payment-confirm">
            <p>
              Vui lòng chuyển khoản đến tài khoản sau: <br />
              <b>Ngân hàng A, chi nhánh B</b>
              <br />
              Số tài khoản: <b>123456789</b>
              <br />
              Chủ tài khoản: <b>Nguyễn Văn A</b>
              <br />
              Nội dung chuyển khoản: <b>Thanh toan don hang #123456</b>
            </p>
          </div>
        )}
      </div>
      <button className="order-button">Đặt hàng</button>
    </div>
  );
}

function HeaderComponent() {
  return (
    // Thang thanh toán
    <div className="header-component">
      <h1>Thanh toán</h1>
      <div className="breadcrumb">
        <span>Thanh toán</span>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <>
      <ComHeader />
      <HeaderComponent />
      <div
        className="payment-page"
        // chiều rộng của trang thanh toán là 80% chiều rộng của trang
        style={{ width: "80%", margin: "auto" }}
      >
        <LeftComponent />
        <RightComponent />
      </div>
    </>
  );
}
