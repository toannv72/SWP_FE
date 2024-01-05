import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button, Checkbox, InputNumber } from 'antd'
import { textApp } from '../../../TextContent/textApp'
import { Link, useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import { useStorage } from '../../../hooks/useLocalStorage'


Modal.setAppElement('#root');


export default function ShoppingCart({ show, updateShoppingCart }) {
  const [open, setOpen] = useState(show)
  const [disabled, setDisabled] = useState(false);
  const [check, setCheck] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [cart, setCart] = useStorage('cart', []);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const nonDisabledProducts = cart.filter(product => product.quantity > 0);
  const checkAll = nonDisabledProducts.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < nonDisabledProducts.length;
  const removeProduct = (productId) => {
    // Sử dụng window.confirm() để xác nhận xóa sản phẩm
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
    if (confirmDelete) {
      const removedProduct = cart.find(item => item._id === productId);
      const updatedCart = cart.filter(item => item._id !== productId);
      setCart(updatedCart);
    
    }
  };
  const onChange = (list) => {
    setCheckedList(list);

  };
  const onCheckAllChange = (e) => {
    const nonDisabledProducts = cart.filter(product => product.quantity > 0);
    setCheckedList(e.target.checked ? nonDisabledProducts : []);
  };
  useEffect(
    () => {
      if (checkedList.length === 0) {

        setDisabled(true)
      } else {
        setDisabled(false)

      }
    }, [checkedList]);

  useEffect(() => {
    // Kiểm tra xem có ít nhất một sản phẩm được chọn hay không
    if (checkedList.length > 0) {
      setDisabled(false); // Khi có ít nhất một sản phẩm được chọn, kích hoạt nút "Xóa tất cả"
    } else {
      setDisabled(true);
    }
    let total = 0;
    for (const product of checkedList) {
      total += product.reducedPrice*product.data;
    }
    setTotalAmount(total)
  }, [checkedList]);
  // Hàm để chọn hoặc bỏ chọn sản phẩm
  const toggleProductSelection = (productId) => {
    if (checkedList.includes(productId)) {
      // Bỏ chọn sản phẩm nếu đã chọn
      setCheckedList(checkedList.filter((id) => id !== productId));
    } else {
      // Chọn sản phẩm nếu chưa chọn
      setCheckedList([...checkedList, productId]);
    }
  };

  const removeAllSelectedProducts = () => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa các sản phẩm này?');
    if (confirmDelete) {
      // Lấy danh sách các ID sản phẩm đã chọn
      const selectedProductIds = checkedList.map((product) => product._id);
      // Lọc ra các sản phẩm không nằm trong danh sách đã chọn
      const updatedCart = cart.filter((product) => !selectedProductIds.includes(product._id));
      console.log(updatedCart);
      setCart(updatedCart);
      setCheckedList([]); // Bỏ chọn tất cả sau khi xóa
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Cập nhật dữ liệu trong localStorage
      
    }
  };


  useEffect(
    () => {
      setOpen(show)
      if (show) {
        setCheckedList([])
        // updateShoppingCart(true);
      }
      setCart(JSON.parse(localStorage.getItem('cart')))
    }, [show]);
  const handleCartClose = () => {
    // Gọi hàm callback để cập nhật giá trị shoppingCart thành false
    updateShoppingCart(false);
  };
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(1111111111111111,cart);
    
  }, [cart,check])



  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);

  };
  const selectedProducts = checkedList.map(product => {
    const cartProduct = cart.find(item => item._id === product._id);
    return {
      ...cartProduct, quantityCart: product.quantityCart  // Cập nhật quantityCart theo giá trị từ checkedList
    };
  });
  const onSubmit = () => {
    setOpen(false);
    handleCartClose();
    const selectedProductIds = checkedList.map((product) => product._id);
    const updatedCart = cart.filter((product) => !selectedProductIds.includes(product._id));
    setCart(updatedCart);
    setCheckedList([]); // Bỏ chọn tất cả sản phẩm đã chọn
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Cập nhật dữ liệu trong localStorage
    // Thực hiện các hành động liên quan đến thanh toán ở đây
    // Chuyển người dùng đến trang thanh toán hoặc thực hiện các hành động cần thiết
    navigate('/payment', { state: { dataProduct: selectedProducts } })
  }

  const handleQuantityChange = (productId, newQuantity) => {
    console.log(productId);

    // Tìm sản phẩm trong cart có id là productId và cập nhật giá trị quantityCart
    const updatedCart = cart.slice().map(product => {
      if (product._id === productId) {
        return { ...product, data: newQuantity };
      }
      return product;
    });
    console.log(updatedCart);
    setCart(updatedCart);
  };
  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    return number
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND',
      });
  }
  const calculateTotalAmount = () => {
    let total = 0;
    for (const product of cart) {
      total += product.reducedPrice;
    }
    return total;
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { setOpen(false); handleCartClose(); }}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">{textApp.ShoppingCart.tile}</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => { setOpen(false); handleCartClose(); }}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                        {textApp.ShoppingCart.checkbox}
                      </Checkbox>

                      {disabled ? null : ( // Hiển thị nút "Xóa tất cả" nếu không bị vô hiệu hóa
                        <Button
                          onClick={removeAllSelectedProducts}
                          disabled={disabled}
                          className="font-medium text-indigo-600 hover:text-indigo-500 border-none"
                        >
                          Xóa các sản phẩm đã chọn
                        </Button>
                      )}
                      <div className="mt-8">
                        <div className="flow-root">
                          <div role="list" className="-my-6 divide-y divide-gray-200">
                            <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={onChange}>
                              {cart.slice().reverse().map((product, index) => (
                                <div className='flex gap-2' key={index}>
                                  <Checkbox value={product} disabled={product.quantity === 0 ? true : false} />
                                  <li key={product.id} className="flex py-4">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={product.image}
                                        alt={product.image}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3 className='w-44'>
                                            <Link onClick={() => { setOpen(false); handleCartClose(); }} to={`/product/${product._id}`}
                                            >{product.name}</Link>
                                          </h3>
                                          <p className="ml-4">{formatCurrency(product.reducedPrice)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center gap-2 text-gray-500">
                                          <InputNumber
                                            className="w-14 text-sm"
                                            min={1}
                                            onChange={(newQuantity) => handleQuantityChange(product._id, newQuantity)}
                                            value={product?.data}
                                            max={product.quantity}
                                          />
                                          {product.quantity} Sản phẩm
                                        </div>

                                        <div className="flex">
                                          <button
                                            onClick={() => removeProduct(product._id)}
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                          >
                                            Xóa
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </div>
                              ))}
                            </Checkbox.Group>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Tổng cộng</p>
                        <p>{formatCurrency(totalAmount)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Vận chuyển và thuế được tính khi thanh toán.</p>
                      <div className="mt-6">
                        <Button
                          onClick={() => { onSubmit() }}
                          disabled={disabled}
                          className="flex h-12 items-center w-full justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Thanh toán
                        </Button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          hoặc
                          <button
                            type="primary"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => { setOpen(false); handleCartClose(); }}
                          >
                            Tiếp tục mua sắm
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
