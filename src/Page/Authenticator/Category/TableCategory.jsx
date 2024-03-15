
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Highlighter from 'react-highlight-words';
import * as yup from "yup"
import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Layout,
  Typography,
  notification,
} from "antd";
import { textApp } from '../../../TextContent/textApp';
import { firebaseImgs } from '../../../upImgFirebase/firebaseImgs';
import { deleteData, getData, putData } from '../../../api/api';
import ComButton from '../../Components/ComButton/ComButton';
import ComNumber from '../../Components/ComInput/ComNumber';
import ComSelect from '../../Components/ComInput/ComSelect';
import ComInput from '../../Components/ComInput/ComInput';

import { useStorage } from '../../../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import CreateCategory from './CreateCategory';
import AdminHeader from '../../Components/ComHeader/AdminHeader';

import styles from "../Admin2/layout.module.css";
import Sidenav from '../../Components/sidenav/sidenav';
import Header from '../../Components/ComHeader/header';
const { Header: AntHeader, Content, Sider } = Layout;

export default function TableCategory() {
    const [disabled, setDisabled] = useState(false);
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [image, setImages] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [dataRun, setDataRun] = useState(false);
    const [productRequestDefault, setProductRequestDefault] = useState({});
    const [productPrice, setProductPrice] = useState(1000);
    const [productQuantity, setProductQuantity] = useState(1);
    const [api, contextHolder] = notification.useNotification();
    const [selectedMaterials, setSelectedMaterials] = useState();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [token, setToken] = useStorage("user", {});
    const navigate = useNavigate();

    useEffect(() => {
        if (!token?._doc?._id) {
            return navigate('/login')
        }
    }, []);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const showModalEdit = (e) => {

        setProductRequestDefault({
            value: e.value,
            id: e._id

        })
        setIsModalOpen(true);
    };

    const showModalDelete = (e) => {
        setProductRequestDefault({
            id: e._id
        })
        setIsModalOpenDelete(true);
    };
    const options = [
   
    ];

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleCancelAdd = () => {
        setIsModalOpenAdd(false);
        setDataRun(!dataRun);
    };

    const CreateProductMessenger = yup.object({

        value: yup.string().required("Thể loại không được để trống"),

    })

    const methods = useForm({
        resolver: yupResolver(CreateProductMessenger),
        defaultValues: {
            value: "",

        },
        values: productRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    const onSubmitUp = (data) => {

        const isDuplicate = products.some((product, i) => product._id !== productRequestDefault.id && product.value === data.value);
        setDisabled(true)
        if (!isDuplicate) {
            putData('/category', productRequestDefault.id, {
                "label": data.value,
                "value": data.value
            })
                .then(() => {
                    api["success"]({
                        message: textApp.TableProduct.Notification.update.message,
                        description:
                            "Chỉnh sửa thể loại thành công"
                    });
                    setDataRun(!dataRun)
                })
                .catch((error) => {
                    api["error"]({
                        message: textApp.TableProduct.Notification.updateFail.message,
                        description:
                            textApp.TableProduct.Notification.updateFail.description
                    });
                    console.error("Error fetching items:", error);
                    setDisabled(false)
                });
        } else {
            api["error"]({
                message: textApp.TableProduct.Notification.updateFail.message,
                description:
                    "Đã có thể loại này rồi"
            });
        }
        setImages([]);
        setDisabled(false)
        setIsModalOpen(false);
    }

    const deleteById = () => {
        setDisabled(true)
        deleteData('category', productRequestDefault.id)
            .then((data) => {
                setDisabled(false)
                handleCancelDelete()
                api["success"]({
                    message: textApp.TableProduct.Notification.delete.message,
                    description:
                        "Xóa thể loại thành công"
                });

            })
            .catch((error) => {
                console.log(error);
                setDisabled(false)
                handleCancelDelete()
                api["error"]({
                    message: textApp.TableProduct.Notification.deleteError.message,
                    description:
                        textApp.TableProduct.Notification.deleteError.description
                });
            })
        setDataRun(!dataRun)

    }
    useEffect(() => {
        setTimeout(() => {
            getData(`/category`, {})
                .then((data) => {
                    setProducts(data?.data)
                })
                .catch((error) => {
                    console.error("Error fetching items:", error);
                });

        }, 100);


    }, [dataRun]);


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
    console.log(products);
    const columns = [


        {
            title: 'Thể loại',
            dataIndex: 'value',
            width: 200,
            key: 'value',
            fixed: 'left',
            render: (_, record) => (

                <div >
                    <h1>{record.value}</h1>
                </div>
            ),
            ...getColumnSearchProps('value', 'tên thể loại'),
        },

        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,

            render: (_, record) => (

                <div className='flex items-center flex-col'>
                    <div>
                        <Typography.Link onClick={() => showModalEdit(record)}>
                            Chỉnh sửa
                        </Typography.Link>
                    </div>
                    <div className='mt-2'>
                        <Typography.Link onClick={() => showModalDelete(record)}>
                            <div className='text-red-600'>  Xóa</div>
                        </Typography.Link>
                    </div>
                </div>
            )
        },
    ];

    const handleChange = (e, value) => {
        console.log(value);
        setSelectedMaterials(value);
        if (value.length === 0) {
            setValue("genre", null, { shouldValidate: true });
        } else {
            setValue("genre", value, { shouldValidate: true });

        }
    };
    return (
      <>
        <Layout className={styles.layoutDashboard}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            trigger={null}
            theme="light"
            className={`${styles.siderPrimary} `}
          >
            <Sidenav />
          </Sider>
          <Layout>
            <AntHeader><Header/></AntHeader>
            <Content className={styles.contentAnt}>
              <ComButton
                className="m-2"
                onClick={() => setIsModalOpenAdd(true)}
              >
                Thêm thể loại
              </ComButton>
              <div className="flex px-5 justify-center">
                <Table
                  rowKey="_id"
                  columns={columns}
                  dataSource={products}
                  scroll={{
                    x: 550,
                    y: "70vh",
                  }}
                  bordered
                  pagination={{
                    showSizeChanger: true, // Hiển thị dropdown cho phép chọn số lượng dữ liệu
                    pageSizeOptions: ["10", "20", "50", "100"], // Các tùy chọn số lượng dữ liệu
                  }}
                />
              </div>
            </Content>
          </Layout>
        </Layout>
        {contextHolder}
        {/* <AdminHeader /> */}

        <Modal
          title={textApp.TableProduct.title.change}
          okType="primary text-black border-gray-700"
          open={isModalOpen}
          width={800}
          style={{ top: 20 }}
          onCancel={handleCancel}
        >
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmitUp)}
              className="mx-auto mt-4 max-w-xl sm:mt-8"
            >
              <div className=" overflow-y-auto p-4">
                <div
                  className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
                  style={{}}
                >
                  <div className="sm:col-span-2">
                    <div className="mt-2.5">
                      <ComInput
                        type="text"
                        label={"Tên thể loại"}
                        placeholder={"Vui lòng nhập thể loại"}
                        {...register("value")}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <ComButton
                  disabled={disabled}
                  htmlType="submit"
                  type="primary"
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Chỉnh sửa
                </ComButton>
              </div>
            </form>
          </FormProvider>
        </Modal>

        <Modal
          title="Thêm thể loại "
          okType="primary text-black border-gray-700"
          open={isModalOpenAdd}
          width={800}
          style={{ top: 20 }}
          onCancel={handleCancelAdd}
        >
          <CreateCategory onCancel={handleCancelAdd} />
        </Modal>

        <Modal
          title={textApp.TableProduct.title.delete}
          okType="primary text-black border-gray-700"
          open={isModalOpenDelete}
          width={500}
          // style={{ top: 20 }}
          onCancel={handleCancelDelete}
        >
          <div className="text-lg p-6">
            Bạn có chắc chắn muốn xóa sản phẩm đã chọn này không?
          </div>

          <div className="flex">
            <ComButton
              disabled={disabled}
              type="primary"
              danger
              onClick={deleteById}
            >
              {textApp.TableProduct.modal.submitDelete}
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
      </>
    );
}
