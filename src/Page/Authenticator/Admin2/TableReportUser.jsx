import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Highlighter from "react-highlight-words";
import * as yup from "yup";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { textApp } from "../../../TextContent/textApp";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import { acceptProduct, deleteData, getData, hideArtwork, putData, rejectProduct, unhideArtwork } from "../../../api/api";
import ComButton from "../../Components/ComButton/ComButton";
import ComNumber from "../../Components/ComInput/ComNumber";
import ComSelect from "../../Components/ComInput/ComSelect";
import ComInput from "../../Components/ComInput/ComInput";
import moment from "moment";
import ComUpImg from "../../Components/ComUpImg/ComUpImg";
import ComTextArea from "../../Components/ComInput/ComTextArea";
import ComHeader from "../../Components/ComHeader/ComHeader";
import { useStorage } from "../../../hooks/useLocalStorage";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import ComSideNav from "../../Components/ComSideNav";

export default function TableReportUser() {
  const [disabled, setDisabled] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [image, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [dataRun, setDataRun] = useState(false);
  const [productRequestDefault, setProductRequestDefault] = useState({});
  const [productPrice, setProductPrice] = useState(1000);
  const [productReducedPrice, setProductReducedPrice] = useState(1000);
  const [productQuantity, setProductQuantity] = useState(1);
  const [api, contextHolder] = notification.useNotification();
  const [selectedMaterials, setSelectedMaterials] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [token, setToken] = useStorage("user", {});

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const showModalEdit = (e) => {
    setSelectedMaterials(e.genre);
    setProductPrice(e.price);
    setProductReducedPrice(e.reducedPrice);
    setProductQuantity(e.quantity);
    setProductRequestDefault({
      name: e.name,
      price: e.price,
      price1: e.price,
      reducedPrice1: e.reducedPrice,
      reducedPrice: e.reducedPrice,
      quantity: e.quantity,
      detail: e.detail,
      shape: e.shape,
      models: e.models,
      genre: e.genre,
      accessory: e.accessory,
      description: e.description,
      id: e._id,
    });
    setIsModalOpen(true);
  };

  const showModalDelete = (e) => {
    setProductRequestDefault({
      id: e._id,
    });
    setIsModalOpenDelete(true);
  };

  
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };


  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        style: "currency",
        currency: "VND",
      });
    }
  }
  
  const deleteById = () => {
    setDisabled(true);
    deleteData("feedback", productRequestDefault.id)
      .then((data) => {
        setDisabled(false);
        handleCancelDelete();
        api["success"]({
          message: textApp.TableProduct.Notification.delete.message,
          description: textApp.TableProduct.Notification.delete.description,
        });
      })
      .catch((error) => {
        console.log(error);
        setDisabled(false);
        handleCancelDelete();
        api["error"]({
          message: textApp.TableProduct.Notification.deleteError.message,
          description:
            textApp.TableProduct.Notification.deleteError.description,
        });
      });
    setDataRun(!dataRun);
  };
  useEffect(() => {
    setTimeout(() => {
      getData(`/feedback`, {})
        .then((data) => {
            setProducts(data?.data?.docs?.filter(item=> item?.type=== 2));
        })
        .catch((error) => {
          console.error("Error fetching items:", error);
        });
    }, 100);
  }, [dataRun]);

  const onChange = (data) => {
    const selectedImages = data;
    // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
    const newImages = selectedImages.map((file) => file.originFileObj);
    // Cập nhật trạng thái 'image' bằng danh sách tệp mới
    setImages(newImages);
  };
  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
            <div className="justify-center flex ">
              <SearchOutlined />
              Tìm kiếm
            </div>
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
          color: filtered ? "#1677ff" : undefined,
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
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Link nguời dùng",
      dataIndex: "accuse",
      width: 200,
      key: "accuse",
      fixed: "left",

      render: (_, record) => (
        <div>
          <h1>
            <Link to={"/author/" + record.accuse?._id}>Click tại đây</Link>
          </h1>
        </div>
      ),
    },
    {
      title: "Người báo cáo",
      width: 150,
      dataIndex: "user",
      key: "user",
      render: (_, record) => (
        <div>
          <h1>{record?.user?.username}</h1>
        </div>
      ),
    },
    {
      title: "Lý do",
      width: 100,
      dataIndex: "text",
      key: "text",
      render: (_, record) => (
        <div>
          <h1>{record?.text}</h1>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 110,
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (_, record) => (
        <div className="text-sm text-gray-700 line-clamp-4">
          <p>{moment(record.createdAt).format("l")}</p>
        </div>
      ),
    },
    {
        title: "Trạng thái",
        dataIndex: "hidden",
        key: "hidden",
        width: 300,
        // ...getColumnSearchProps("accept", "trạng thái"),
        // render: (_, record) => (
  
        //     <div className="text-sm text-gray-700 line-clamp-4">
        //         <p className="text-sm text-gray-700 line-clamp-4">{record.description}</p>
        //     </div>
  
        // ),
        ellipsis: {
          showTitle: false,
        },
        render: (record) => (
          <>
            <div>{record=== true && "Đã ẩn"}</div>
            <div>{record=== false && "Chưa ẩn"}</div>
          </>
        ),
      },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,

      render: (_, record) => (
        <div className="flex items-center flex-col">
          <div>
            <Typography.Link
              onClick={async () => {
                const result = await hideArtwork("feedback/hide",record._id, {artwork: record.artwork?._id});
                if (result?.hide === true) {
                  swal("Thông báo", "Ẩn bài post thành công", "success");
                  setDataRun(!dataRun);
                } else {
                  swal("Thông báo", "Có lỗi xảy ra", "error");
                }
              }}
            >
              Ẩn
            </Typography.Link>
          </div>
          <div>
            <Typography.Link
              style={{ whiteSpace: "nowrap" }}
              onClick={async () => {
                const result = await unhideArtwork("feedback/unhide", record._id, {artwork: record.artwork?._id});
                if (result?.unhide === true) {
                  swal("Thông báo", "Huỷ ẩn post thành công", "success");
                  setDataRun(!dataRun);
                } else {
                  swal("Thông báo", "Có lỗi xảy ra", "error");
                }
              }}
            >
              Huỷ ẩn
            </Typography.Link>
          </div>
          <div className="mt-2">
            <Typography.Link onClick={() => showModalDelete(record)}>
              <div className="text-red-600">Xóa</div>
            </Typography.Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <ComHeader />
      <ComSideNav />
      <div className="flex px-5 justify-center ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen bg-gray-50 transition-all duration-200">
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
