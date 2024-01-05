
export const routs = {
  "/": { link: "/", name: "Home" },
  "/login": { link: "/login", name: "Đăng nhập" },
  "/reissue": { link: "/reissue", name: "Tạo tài khoản" },
  "/createProduct": { name: 'Tạo sản phẩm', name2: 'ADMIN', link: '/staff/product/create', },
  "/tableProduct": { name: 'Quản lý sản phẩm', link: '/staff/product/table', },
  "/tableOrder": { name: 'Đơn Hàng', link: '/staff/order', },
  "/logout": { name: 'Đăng Xuất', link: '/logout', },
  "/order": { name: 'Đơn hàng', link: '/order', },
  "/orderRequest": { name: 'Đơn hàng theo yêu cầu', link: '/staff/orderRequest', },
  "/showAll": { name: 'Tất cả đơn hàng', link: '/showAll', },
};
