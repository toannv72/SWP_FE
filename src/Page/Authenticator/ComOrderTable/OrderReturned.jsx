
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Highlighter from 'react-highlight-words';
import * as yup from "yup"
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Space, Table, Tooltip, Typography, notification } from 'antd';
import { textApp } from '../../../TextContent/textApp';
import { deleteData, getData, postData, putData } from '../../../api/api';
import { firebaseImgs } from '../../../upImgFirebase/firebaseImgs';
import ComHeaderAdmin from '../../Components/ComHeaderAdmin/ComHeaderAdmin';
import ComButton from '../../Components/ComButton/ComButton';
import ComUpImg from '../../Components/ComUpImg/ComUpImg';
import ComInput from '../../Components/ComInput/ComInput';
import ComTextArea from '../../Components/ComInput/ComTextArea';
import ComNumber from '../../Components/ComInput/ComNumber';
import ComSelect from '../../Components/ComInput/ComSelect';
import moment from 'moment/moment';


export default function OrderReturned({ activeTab }) {
    const [disabled, setDisabled] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});
    const [orderModalDetail, setModalOrderDetail] = useState(false);
    const [order, setOrder] = useState([]);
    const [isModalOpenProcessing, setIsModalOpenProcessing] = useState(false);
    const [isModalOpenCanceled, setIsModalOpenCanceled] = useState(false);
    const [isModalOpenProcessingS, setIsModalOpenProcessingS] = useState(false);
    const [isModalOpenCanceledS, setIsModalOpenCanceledS] = useState(false);
    const [dataRun, setDataRun] = useState(false);
    const [orderRequestDefault, setOrderRequestDefault] = useState({});
    const [api, contextHolder] = notification.useNotification();
    const [selectedMaterials, setSelectedMaterials] = useState();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [selected, setSelected] = useState([]);
    const [products, setProducts] = useState([]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {

            setSelected(selectedRowKeys)
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };
    const closeModalDetail = () => {
        setOrderDetail({})
        setModalOrderDetail(false);
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getProductById = (productId) => {
        // Tìm sản phẩm theo ID trong danh sách sản phẩm
        console.log(products?.docs);
        return products?.docs?.find(product => product._id === productId);
    };
    const showModalEdit = (e) => {
        setOrderRequestDefault({
            id: e._id
        })
        setIsModalOpenProcessing(true);
    };

    const handleOpenCanceled = (e) => {

        setOrderRequestDefault({
            id: e._id
        })
        setIsModalOpenCanceled(true);

    };
    const handleCancelCanceled = () => {
        setIsModalOpenCanceled(false);

    };
    const handleCancelProcessing = () => {
        setIsModalOpenProcessing(false);

    };
    const handleCancelCanceledS = () => {
        setIsModalOpenCanceledS(false);

    };
    const handleCancelProcessingS = () => {
        setIsModalOpenProcessingS(false);

    };
    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }
    useEffect(() => {
        if (selected.length > 0) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [selected]);
    // const processing = () => {
    //     putData('/order/admin/put', 'Shipped', { orders: [orderRequestDefault.id] })
    //         .then((e) => {
    //             setDataRun(!dataRun);
    //         })
    //         .catch(err => console.log(err))
    //     setDataRun(!dataRun);
    //     handleCancelProcessingS()
    // }
    // console.log(dataRun);
    // const sttCanceled = () => {
    //     putData('/order/admin/put', 'Pending', { orders: [orderRequestDefault.id] })
    //         .then((e) => {
    //             setDataRun(!dataRun);
    //         })
    //         .catch(err => console.log(err))
    //     setDataRun(!dataRun);
    //     handleCancelCanceled()
    // }isModalOpenProcessing
    const shipped = () => {
        putData('/order/admin/put', 'Delivered', { orders: [orderRequestDefault.id] })
            .then((e) => {
              
                setDataRun(!dataRun);
            })
            .catch(err => console.log(err))
        setDataRun(!dataRun);
        handleCancelProcessing()
    }
    const shippedS = () => {
        putData('/order/admin/put', 'Delivered', { orders: selected })
            .then((e) => {
                setDataRun(!dataRun);
            })
            .catch(err => console.log(err))
        setDataRun(!dataRun);
        handleCancelProcessingS();
        setDisabled(true)
    }

    const pendingS = () => {
        putData('/order/admin/put', 'Canceled', { orders: selected })
            .then((e) => {
                setDataRun(!dataRun);
            })
            .catch(err => console.log(err))
        setDataRun(!dataRun);
        handleCancelCanceledS();
        console.log(selected);
        setDisabled(true)
    }
    useEffect(() => {
        getData('/product/staff', {})
            .then((productData) => {
                setProducts(productData?.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
        getData('/order/admin/Returned', {})
            .then((data) => {
                setOrder(data?.data?.docs)
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
    }, [dataRun,activeTab]);


    const getColumnSearchProps = (dataIndex, title) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Tìm kiếm ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <ComButton
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        // icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        <div className='justify-center flex '><SearchOutlined />Tìm kiếm</div>
                    </ComButton>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Đặt lại
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const showModalDetail = (e) => {
        setOrderDetail({
            detail: e
        })
        setModalOrderDetail(true);
    };
    const columns = [


        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            width: 300,
            key: '_id',
            fixed: 'left',

            ...getColumnSearchProps('_id', 'Mã đơn hàng'),
            render: (_, record) => (

                <div >
                    <Typography.Link onClick={() => showModalDetail(record)}>
                        {record._id}
                    </Typography.Link>
                </div>
            ),
        },
        {
            title: 'Tên Người đặt',
            width: 200,
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name', "tên"),

        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
            width: 110,
            key: 'createdAt',
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
            ...getColumnSearchProps('createdAt', "Ngày đặt hàng"),
            render: (_, record) => (

                <div className="text-sm text-gray-700 line-clamp-4">
                    <p>{moment(record.createdAt).format('l')}</p>
                </div>
            ),
        },
        {
            title: 'Số điện thoại',
            width: 200,
            dataIndex: 'phone',
            key: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone', "phone"),

        },
        {
            title: 'Email',
            width: 200,
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email', "email"),
        },

        {
            title: 'Địa chỉ ',
            width: 300,
            dataIndex: 'shippingAddress',
            key: 'shippingAddress',
            ...getColumnSearchProps('shippingAddress', "Địa chỉ"),

        },
        {
            title: 'Tổng tiền đơn hàng',
            width: 300,
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            // ...getColumnSearchProps('totalAmount', "Địa chỉ"),
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            render: (_, record) => (

                <div >
                    <h1>{formatCurrency(record.totalAmount)}</h1>
                </div>
            )
        },
        {
            title: 'Thông tin bổ sung',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            ...getColumnSearchProps('description', "chi tiết"),
            // render: (_, record) => (

            //     <div className="text-sm text-gray-700 line-clamp-4">
            //         <p className="text-sm text-gray-700 line-clamp-4">{record.description}</p>
            //     </div>

            // ),
            ellipsis: {
                showTitle: false,
            },
            render: (record) => (
                <Tooltip placement="topLeft" title={record}>
                    {record}
                </Tooltip>
            ),

        },
        // {
        //     title: 'Action',
        //     key: 'operation',
        //     fixed: 'right',
        //     width: 150,
        //     render: (_, record) => (

        //         <div className='flex items-center flex-col'>
        //             <div>
        //                 <Typography.Link onClick={() => showModalEdit(record)}>
        //                     Chấp nhận
        //                 </Typography.Link>
        //             </div>
        //             {/* <div className='mt-2'>
        //                 <Typography.Link onClick={() => handleOpenCanceled(record)}>
        //                     <div className='text-red-600'>hủy</div>
        //                 </Typography.Link>
        //             </div> */}
        //         </div>
        //     )
        // },
    ];


    return (
        <>
            {contextHolder}
            <div className='flex gap-2'>
                {/* <Button
                    disabled={disabled}
                    type="primary"
                    onClick={() => setIsModalOpenProcessingS(true)}
                    className={`flex  items-center justify-center rounded-md border border-transparent text-base font-medium text-white ${disabled ? " bg-slate-700" : "hover:to-sky-700 hover:from-sky-800 bg-gradient-to-b from-sky-600 to-sky-700"}  `}
                >
                    Xác nhận
                </Button> */}
                {/* <Button
                    disabled={disabled}
                    type="primary"
                    onClick={() => setIsModalOpenCanceledS(true)}
                    className={`flex  items-center justify-center rounded-md border border-transparent text-base font-medium text-white ${disabled ? " bg-slate-700" : "hover:to-red-700 hover:from-red-800 bg-gradient-to-b from-red-600 to-red-700"}  `}
                >
                    Từ chối
                </Button> */}
            </div>
            <div className='flex p-2 justify-center'>
                <Table
                    // rowSelection={{
                    //     type: "checkbox",
                    //     ...rowSelection,
                    // }}
                    rowKey="_id"
                    columns={columns}
                    dataSource={order}
                    scroll={{
                        x: 1520,
                        y: "55vh",
                    }}
                    bordered
                    pagination={{
                        showSizeChanger: true, // Hiển thị dropdown cho phép chọn số lượng dữ liệu
                        pageSizeOptions: ['10', '20', '50', '100'], // Các tùy chọn số lượng dữ liệu
                    }}
                />
            </div>


            <Modal title="Chấp nhận đơn hàng này"
                okType="primary text-black border-gray-700"
                open={isModalOpenProcessing}
                width={500}
                // style={{ top: 20 }}
                onCancel={handleCancelProcessing}>
                <div className='text-lg p-6'>Bạn có chắc chắn muốn chuyển qua đã vận chuyển không?</div>

                <div className='flex'>
                    <ComButton
                        type="primary"
                        danger
                        onClick={shipped}
                    >
                        xác nhận
                    </ComButton>
                    <ComButton
                        type="primary"
                        onClick={handleCancelProcessing}
                    >
                        hủy
                    </ComButton>
                </div>
            </Modal>
            {/* <Modal title="hủy đơn hàng này"
                okType="primary text-black border-gray-700"
                open={isModalOpenCanceled}
                width={500}
                // style={{ top: 20 }}
                onCancel={handleCancelCanceled}>

                <div className='flex'>
                    <ComButton
                        type="primary"
                        danger
                        onClick={sttCanceled}
                    >
                        Xác nhận
                    </ComButton>
                    <ComButton
                        type="primary"
                        onClick={handleCancelCanceled}
                    >
                        {textApp.TableProduct.modal.cancel}
                    </ComButton>
                </div>
            </Modal> */}

            <Modal title="Chấp nhận đơn hàng"
                okType="primary text-black border-gray-700"
                open={isModalOpenProcessingS}
                width={500}
                // style={{ top: 20 }}
                onCancel={handleCancelProcessingS}>
                <div className='text-lg p-6'>Bạn có chắc chắn muốn chuyển qua đã vận chuyển không?</div>

                <div className='flex'>
                    <ComButton
                        type="primary"
                        danger
                        onClick={shippedS}
                    >
                        xác nhận
                    </ComButton>
                    <ComButton
                        type="primary"
                        onClick={handleCancelProcessingS}
                    >
                        hủy
                    </ComButton>
                </div>
            </Modal>
            {/* <Modal title="Xác nhận hủy đơn hàng"
                okType="primary text-black border-gray-700"
                open={isModalOpenCanceledS}
                width={500}
                // style={{ top: 20 }}
                onCancel={handleCancelCanceledS}>
                <div className='text-lg p-6'>Bạn có chắc chắn muốn hủy đơn hàng đã chọn này không?</div>

                <div className='flex'>
                    <ComButton
                        type="primary"
                        danger
                        onClick={pendingS}
                    >
                        Xác nhận
                    </ComButton>
                    <ComButton
                        type="primary"
                        onClick={handleCancelCanceledS}
                    >
                        {textApp.TableProduct.modal.cancel}
                    </ComButton>
                </div>
            </Modal> */}
            <Modal title="Chi tiết đơn hàng"
                okType="primary text-black border-gray-700"
                open={orderModalDetail}
                width={500}
                // style={{ top: 20 }}
                onCancel={closeModalDetail}>
                <div className=" flex items-center justify-center">
                    <div className="p-4 md:p-8 lg:p-12 rounded-lg  w-full">
                     
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">Thông tin sản phẩm:</h2>
                            {orderDetail?.detail?.products?.map((product, index) => {
                                // Sử dụng getProductById để lấy thông tin sản phẩm đầy đủ
                                const fullProduct = getProductById(product.product);
                                const materials = fullProduct?.material?.join(', ');
                                console.log(product.product)
                                return (
                                    <div key={index} className="mb-4 flex items-center">
                                        <img src={fullProduct?.image} alt={fullProduct?.name} className="w-24 h-24 object-cover rounded-lg" />
                                        <div className="ml-4">
                                            <p className="text-lg font-semibold">{fullProduct?.name}</p>
                                            <p>
                                                {textApp.OrderHistory.product.quantity} {product?.quantity}
                                            </p>
                                            <p>
                                                {textApp.OrderHistory.product.price} {product?.price?.toLocaleString("en-US", { style: "currency", currency: "VND" })}
                                            </p>
                                            <p>
                                                {textApp.Product.page.material}{materials}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-gray-600 mb-2">
                            {textApp.Invoice.orderDate}:{" "}
                            {new Date(orderDetail?.detail?.createdAt).toLocaleDateString("en-US")}
                        </p>
                        <p className="text-gray-600 mb-2">
                            {textApp.Invoice.paymentMethod}
                        </p>
                        <p className="text-gray-600 mb-6">
                            {textApp.OrderHistory.product.amount}:{" "}
                            {orderDetail?.detail?.totalAmount?.toLocaleString("en-US", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </p>

                    </div>
                </div>
                <div className='flex'>
                    <ComButton
                        type="primary"
                        onClick={closeModalDetail}
                    >
                        Đóng
                    </ComButton>
                </div>
            </Modal>
        </>
    )
}
