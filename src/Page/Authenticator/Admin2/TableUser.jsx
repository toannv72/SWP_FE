
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Highlighter from 'react-highlight-words';
import * as yup from "yup"
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Popconfirm, Radio, Space, Table, Typography, notification } from 'antd';
import moment from 'moment/moment';
import ComInput from '../../Components/ComInput/ComInput';
import { textApp } from '../../../TextContent/textApp';
import { deleteData, getData, hideArtwork, postData, unblockData, unhideArtwork } from '../../../api/api';
import ComButton from '../../Components/ComButton/ComButton';
import ComHeader from '../../Components/ComHeader/ComHeader';
import AdminHeader from '../../Components/ComHeader/AdminHeader';
import swal from 'sweetalert';


export default function TableUser() {
    const [disabled, setDisabled] = useState(false);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenUnblock, setIsModalOpenUnblock]= useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [dataRun, setDataRun] = useState(false);
    const [productRequestDefault, setProductRequestDefault] = useState({});
    const [api, contextHolder] = notification.useNotification();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [error, setError] = useState("");
    const [valueSelect, setValueSelect] = useState('manager');
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValueSelect(e.target.value);
    };
    console.log(productRequestDefault);
    const showModalEdit = (e) => {
        setIsModalOpen(true);
    };

    const showModalDelete = (e) => {
        setProductRequestDefault({
            id: e._id
        })
        setIsModalOpenDelete(true);
    };

    const showModalUnblock= (e)=> {
        setProductRequestDefault({
            id: e._id
        })
        setIsModalOpenUnblock(true);
    }

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleCancelUnblock = () => {
        setIsModalOpenUnblock(false);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const deleteById = () => {
        setDisabled(true)
        deleteData("feedback", productRequestDefault.id)
          .then((data) => {
            setDisabled(false);
            handleCancelDelete();
            api["success"]({
              message: textApp.TableProduct.Notification.delete.message,
              description: "Đã khóa tài khoản thành công",
            });
          })
          .catch((error) => {
            console.log(error);
            setDisabled(false);
            handleCancelDelete();
            api["error"]({
              message: textApp.TableProduct.Notification.deleteError.message,
              description: "Không thể khóa tài khoản này",
            });
          });
        setDataRun(!dataRun)

    }
    const unblockById = () => {
        setDisabled(true)
        unblockData('user', productRequestDefault.id)
            .then((data) => {
                setDisabled(false)
                handleCancelUnblock()
                api["success"]({
                    message: textApp.TableProduct.Notification.delete.message,
                    description:
                        "Đã mở khóa tài khoản thành công"
                });
            })
            .catch((error) => {
                console.log(error);
                setDisabled(false)
                handleCancelUnblock()
                api["error"]({
                    message: textApp.TableProduct.Notification.deleteError.message,
                    description:
                        "Không thể mở khóa tài khoản này"
                });
            })
        setDataRun(!dataRun)

    }
    const loginMessenger = yup.object({
        username: yup.string().required(textApp.Reissue.message.username).min(6, textApp.Reissue.message.usernameMIn),
        phone: yup.string().required(textApp.Reissue.message.phone).min(10, "Số điện thoại phải lớn hơn 9 số!").max(10, "Số điện thoại phải nhỏ hơn 11 số!").matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
        // .matches(/^[0-9]+$/, 'Số điện thoại phải chứa chỉ số'),
        password: yup.string().required(textApp.Reissue.message.password).min(5, textApp.Reissue.message.passwordMIn),
        password2: yup.string().required(textApp.Reissue.message.password2).min(5, textApp.Reissue.message.passwordMIn),
        email: yup.string().email(textApp.Reissue.message.emailFormat).required(textApp.Reissue.message.email),
    })
    const LoginRequestDefault = {
        // code: "",
        password: "",
        phone: "",
        username: "",
        email: "",

    };
    const methods = useForm({
        resolver: yupResolver(loginMessenger),
        defaultValues: {
            // code: "",
            username: "",
            phone: "",
            password: "",
            email: "",
        },
        values: productRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods


    useEffect(() => {
        setTimeout(() => {
            getData('/user', {})
                .then((data) => {
                    setProducts(data?.data?.docs)
                })
                .catch((error) => {
                    console.error("Error fetching items:", error);
                });

        }, 100);
    }, [dataRun]);

    const onSubmit = (data) => {
        if (data.password2 !== data.password) {
            return setError(textApp.Reissue.message.passwordCheck)
        }
        setDisabled(true)
        setError("")

        postData('/reg', { ...data, role: valueSelect }, {})
            .then((data) => {
                api["success"]({
                    message: 'Thành công!',
                    description:
                        "Tạo tài khoản thành công"
                });
                setDisabled(false)
                handleCancel()
                setProductRequestDefault({}) 
            })
            .catch((error) => {
                setError(error?.response?.data?.error||'Tài khoản đã tồn tại')
                console.error("Error fetching items:", error);
                setDisabled(false)
            });
        setDataRun(!dataRun)
    }
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
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
    const columns = [
      {
        title: "username",
        dataIndex: "username",
        key: "username",
        width: 100,
        fixed: "left",
        ...getColumnSearchProps("name", ""),
      },
      {
        title: "name",
        dataIndex: "name",
        key: "name",
        width: 100,
        fixed: "left",
        ...getColumnSearchProps("name", ""),
      },
      // {
      //     title: 'password',
      //     dataIndex: 'password',
      //     width: 100,
      //     key: 'password',

      //     render: (_, record) => (
      //         <div >
      //             <h1>**********</h1>
      //         </div>
      //     ),
      // },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        width: 110,
        key: "createdAt",
        sorter: (a, b) =>
          moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        render: (_, record) => (
          <div className="text-sm text-gray-700 line-clamp-4">
            <p>{moment(record.createdAt).format("l")}</p>
          </div>
        ),
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        width: 110,
        key: "phone",
      },
      {
        title: "Gmail",
        dataIndex: "email",
        width: 110,
        key: "email",
      },
      {
        title: <div className="flex justify-center ">trạng thái</div>,
        dataIndex: "",
        key: "",
        width: 100,
        render: (_, record) => (
          <div className="flex items-center flex-col">
            {console.log(record)}
            {record?.hidden === true && (
              <div className="mt-2">
                <div className="text-red-600">Đã khóa</div>
              </div>
            )}
            {record?.hidden === false && (
              <div className="mt-2">
                <div className="">Hoạt động</div>
              </div>
            )}
          </div>
        ),
      },
      {
        title: <div className="flex justify-center ">Tài khoản</div>,
        dataIndex: "",
        key: "",
        width: 100,
        render: (_, record) => (
          <div>
            <div className="flex justify-center text-lg">{record.role}</div>
          </div>
        ),
      },
      {
        title: <div className="flex justify-center">Action</div>,
        key: "operation",
        width: 50,
        render: (_, record) => (
          <div className="flex items-center flex-col">
            {record?.hidden === true && (
              <div className="mt-2">
                <Popconfirm
                  title="UnBlock the user"
                  description="Are you sure to unblock this user?"
                  onConfirm={async () => {
                    const result = await hideArtwork("feedback/unhide", {
                      accuse: record._id,
                    });
                    if (result?.hide === true) {
                      swal("Thông báo", "Ẩn bài post thành công", "success");
                      setDataRun(!dataRun);
                    } else {
                      swal("Thông báo", "Có lỗi xảy ra", "error");
                    }
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" ghost>
                    Mở khoá
                  </Button>
                </Popconfirm>
              </div>
            )}
            {record?.hidden === false && (
              <Popconfirm
                title="Block the user"
                description="Are you sure to block this user?"
                onConfirm={async () => {
                  const result = await hideArtwork("feedback/hide", {
                    accuse: record._id,
                  });
                  if (result?.hide === true) {
                    swal("Thông báo", "Ẩn bài post thành công", "success");
                    setDataRun(!dataRun);
                  } else {
                    swal("Thông báo", "Có lỗi xảy ra", "error");
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>khoá</Button>
              </Popconfirm>
            )}
          </div>
        ),
      },
    ];

    return (
      <>
        {contextHolder}
        <AdminHeader />
        {/* <ComButton type="primary" className='mt-2' onClick={() => { showModalEdit() }} >Add Account</ComButton> */}
        <div className="flex p-5 justify-center">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={products}
            scroll={{
              x: 1520,
              y: "70vh",
            }}
            bordered
            pagination={{
              showSizeChanger: true, // Hiển thị dropdown cho phép chọn số lượng dữ liệu
              pageSizeOptions: ["10", "20", "50", "100"], // Các tùy chọn số lượng dữ liệu
            }}
          />
        </div>
        <Modal
          title="Thêm tài khoản"
          okType="primary text-black border-gray-700"
          open={isModalOpen}
          width={800}
          style={{ top: 20 }}
          onCancel={handleCancel}
        >
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <FormProvider {...methods}>
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ComInput
                  placeholder={textApp.Reissue.placeholder.username}
                  label={textApp.Reissue.label.username}
                  type="text"
                  // search
                  maxLength={26}
                  onchange={() => {
                    setError("");
                  }}
                  {...register("username")}
                  required
                />

                <ComInput
                  placeholder={textApp.Reissue.placeholder.phone}
                  label={textApp.Reissue.label.phone}
                  type="numbers"
                  maxLength={16}
                  {...register("phone")}
                  required
                />
                <ComInput
                  placeholder={textApp.Reissue.placeholder.email}
                  label={textApp.Reissue.label.email}
                  type="text"
                  {...register("email")}
                  required
                />
                <ComInput
                  placeholder={textApp.Reissue.placeholder.password}
                  label={textApp.Reissue.label.password}
                  type="password"
                  maxLength={26}
                  {...register("password")}
                  required
                />
                <ComInput
                  placeholder={textApp.Reissue.placeholder.password2}
                  label={textApp.Reissue.label.password2}
                  type="password"
                  maxLength={26}
                  {...register("password2")}
                  required
                />
                <Radio.Group onChange={onChange} value={valueSelect}>
                  <Space direction="vertical">
                    <Radio value={"manager"}>Manager</Radio>
                    <Radio value={"staff"}>Staff</Radio>
                  </Space>
                </Radio.Group>
                <h1 className="text-red-500">{error}</h1>
                <ComButton disabled={disabled} htmlType="submit" type="primary">
                  {textApp.Reissue.pageTitle}
                </ComButton>
              </form>
            </FormProvider>
          </div>
        </Modal>

        <Modal
          title="Khóa tài khoản?"
          okType="primary text-black border-gray-700"
          open={isModalOpenDelete}
          width={800}
          style={{ top: 20 }}
          onCancel={handleCancelDelete}
        >
          <div className="text-lg p-6">
            Bạn có chắc chắn muốn Khóa người dùng này không?
          </div>
          <div className="flex">
            <ComButton
              disabled={disabled}
              type="primary"
              danger
              onClick={deleteById}
            >
              Khóa
            </ComButton>
            <ComButton
              type="primary"
              disabled={disabled}
              onClick={handleCancelDelete}
            >
              {textApp.TableProduct.modal.cancel}
            </ComButton>
          </div>
        </Modal>
        {/*  */}
        <Modal
          title="Mở khoá tài khoản?"
          okType="primary text-black border-gray-700"
          open={isModalOpenUnblock}
          width={800}
          style={{ top: 20 }}
          onCancel={handleCancelUnblock}
        >
          <div className="text-lg p-6">
            Bạn có chắc chắn muốn mở khoá người dùng này không?
          </div>
          <div className="flex">
            <ComButton
              disabled={disabled}
              type="primary"
              danger
              onClick={unblockById}
            >
              Mở khoá
            </ComButton>
            <ComButton
              type="primary"
              disabled={disabled}
              onClick={handleCancelUnblock}
            >
              {textApp.TableProduct.modal.cancel}
            </ComButton>
          </div>
        </Modal>
      </>
    );
}
