import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import ComHeader from "../../Components/ComHeader/ComHeader";
import ComImage from "../../Components/ComImage/ComImage";
import { getData, postData, putData } from "../../../api/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { textApp } from "../../../TextContent/textApp";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ComNumber from "../../Components/ComInput/ComNumber";
import { Button, Dropdown, Image, Menu, Modal, notification } from "antd";
import PageNotFound from "../404/PageNotFound";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { CalendarDays } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";
import { useStorage } from "../../../hooks/useLocalStorage";
import ComUpImgOne from "../../Components/ComUpImg/ComUpImgOne";
import ComButton from "../../Components/ComButton/ComButton";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import { FieldError } from "../../Components/FieldError/FieldError";
import ComInput from "../../Components/ComInput/ComInput";
import ComTextArea from "../../Components/ComInput/ComTextArea";
import ComSelect from "../../Components/ComInput/ComSelect";
export default function Card({ artwork, load,setLoad, index }) {
  const [Author, setAuthor] = useState([]);
  const { id } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const [error, setError] = useState(false);
  const [error1, setError1] = useState("");
  const [products, setProducts] = useState([]);
  const [productUpdate, setProductUpdate] = useState({
    content: "",
    genre: [],
  });
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [likedProducts, setLikedProducts] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [token, setToken] = useStorage("user", {});
  const [likedProductIds, setLikedProductIds] = useState([]);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [image, setImages] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState();
  const loginMessenger = yup.object({
    // code: yup.string().required(textApp.Login.message.username).min(5, "Username must be at least 5 characters"),
    name: yup
      .string()
      .required(textApp.Reissue.message.username)
      .min(6, textApp.Reissue.message.usernameMIn),
    phone: yup
      .string()
      .required(textApp.Reissue.message.phone)
      .min(10, "Số điện thoại phải lớn hơn 9 số!")
      .max(10, "Số điện thoại phải nhỏ hơn 11 số!")
      .matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    email: yup
      .string()
      .email(textApp.Reissue.message.emailFormat)
      .required(textApp.Reissue.message.email),
  });
    // const methods = useForm({
    //   resolver: yupResolver(loginMessenger),
    //   defaultValues: {
    //     // code: "",
    //     name: token?._doc?.name,
    //     phone: token?._doc?.phone,
    //     email: token?._doc?.email,
    //   },
    // });
  const methods = useForm();
  useEffect(() => {
    if (productUpdate) {
      setSelectedMaterials(productUpdate.genre);
      methods.reset({
        content: productUpdate.content,
        genre: productUpdate.genre,
      });
    }
  }, [productUpdate, methods]);
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  useEffect(() => {
    if (!token?._doc?._id) {
      navigate("/login");
    }
  });
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleOk1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  useEffect(() => {
    if (image.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [image]);
  const fetchData = async (pageNumber) => {
    try {
      const response = await getData(
        `/artwork/user/${token?._doc?._id}?page=${pageNumber}&limit=10`
      );

      return response.data.docs;
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const initialProducts = await fetchData(page);
      setProducts(initialProducts);
      const userLikesArray = initialProducts?.map((product) =>
        product.likes.some((like) => like.user === token?._doc?._id)
      );
      const likesCountArray = initialProducts?.map(
        (product) => product.likes.length
      );
      setLikedProductIds(likesCountArray);
      setLikedProducts(userLikesArray);
    };
    loadInitialData();
  }, []); // Run only once on component mount

  const getUserById = (array, userId) => {
    // Sử dụng find để tìm user với _id tương ứng
    const user = array.find((item) => item._id === userId);
    return user;
  };

  useEffect(() => {
    getData("/user", {})
      .then((data) => {
        setAllUser(data?.data?.docs);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
    // return response.data.docs;
  }, []);

  // useEffect để thiết lập mảng likedProducts có độ dài bằng độ dài của mảng products và mỗi phần tử có giá trị ban đầu là false

  const handleLike = (index, id_artwork, id_user) => {
    const updatedLikedProducts = [...likedProducts];
    updatedLikedProducts[index] = !updatedLikedProducts[index];
    setLikedProducts(updatedLikedProducts);

    const updatedLikedProductIds = [...likedProductIds];
    updatedLikedProductIds[index] = updatedLikedProductIds[index] + 1;
    setLikedProductIds(updatedLikedProductIds);
    postData(`/artwork/likeArtwork/${id_artwork}/${id_user}`, {})
      .then((e) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnLike = (index, id_artwork, id_user) => {
    const updatedLikedProducts = [...likedProducts];
    updatedLikedProducts[index] = !updatedLikedProducts[index];
    setLikedProducts(updatedLikedProducts);

    const updatedLikedProductIds = [...likedProductIds];
    updatedLikedProductIds[index] = updatedLikedProductIds[index] - 1;
    setLikedProductIds(updatedLikedProductIds);
    postData(`/artwork/unlikeArtwork/${id_artwork}/${id_user}`, {})
      .then((e) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  const onChange = (data) => {
    const selectedImages = data;

    // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
    // const newImages = selectedImages.map((file) => file.originFileObj);
    // Cập nhật trạng thái 'image' bằng danh sách tệp mới
    console.log([selectedImages]);
    setImages([selectedImages]);
    // setFileList(data);
  };
  useEffect(() => {
    getData(`/user/${token?._doc?._id}`)
      .then((user) => {
        setAuthor(user.data);
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });
  }, [token?._doc?._id]);

  if (error) {
    return <PageNotFound />;
  }
  const handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        showModal2();
        break;
      case "2":
        console.log(3);
        break;
      case "3":
        console.log(3);
        break;
      default:
        break;
    }
  };

  const items = [
    {
      label: "Chỉnh sửa bài",
      key: "1",
    },
  ];
  const options = [
    {
      label: "Tranh",
      value: "Tranh",
    },
    {
      label: "Trang trí",
      value: "Trang trí",
    },
    {
      label: "Nghệ thuật",
      value: "Nghệ thuật",
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

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const onSubmit2 = (data) => {
    setDisabled(true);
    firebaseImgs(image).then((img) => {
      handleCancel2();
      setImages([]);
      methods.reset({
        content: undefined,
        genre: undefined,
      });
      putData("/artwork",artwork._id, {
        content: data.content,
        genre: data.genre,
        image: img.length > 0 ? img : artwork.image,
      })
        .then((r) => {
          api["success"]({
            message: "chỉnh sửa bài thành công",
            description: "Bài viết của bạn đã chỉnh sửa thành công",
          });
          setLoad(!load);
          handleCancel2();
          setDisabled(false);
        })
        .catch((error) => {
          setDisabled(false);

          api["error"]({
            message: "Lỗi",
            description: error.response.data.error,
          });
        });
    });
  };
  return (
    <>
      <div
        key={index}
        className=" w-screen bg-[#f3f9f140] sm:w-[600px] lg:w-[900px] xl:w-[1000px] xl:gap-x-8 shadow-md rounded-lg border-solid border-2 border-[#89898936] "
      >
        <HoverCard>
          <div
            className="px-2 py-1 flex items-center gap-2 w-auto"
            style={{ justifyContent: "space-between" }}
          >
            <div>
              <HoverCardTrigger>
                <Link to={`/author/${artwork.user}`}>
                  <img
                    className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white"
                    src={getUserById(allUser, artwork.user)?.avatar}
                    alt=""
                  />
                </Link>{" "}
              </HoverCardTrigger>
              <HoverCardTrigger>
                <Link to={`/author/${artwork.user}`} className="text-2xl">
                  {getUserById(allUser, artwork.user)?.name}
                </Link>
              </HoverCardTrigger>
            </div>
            <Dropdown
              trigger={["click"]}
              menu={menuProps}
              // overlay={
              //   <Menu>
              //     <Menu.Item key="1">Option 1</Menu.Item>
              //     <Menu.Item key="2">Option 2</Menu.Item>
              //     <Menu.Item key="3">Option 3</Menu.Item>
              //   </Menu>
              // }
              onClick={() => setProductUpdate(artwork)}
            >
              <button
                className="border border-gray-400 p-2 rounded text-gray-300 hover:text-gray-300 bg-gray-100 bg-opacity-10 hover:bg-opacity-20"
                title="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  ></path>
                </svg>
              </button>
            </Dropdown>
          </div>

          <HoverCardContent className="relative transform  rounded-lg bg-slate-100 text-left shadow-xl transition-all p-2 z-50 ">
            <div className="flex justify-between space-x-4">
              <img
                className="inline-block h-12 w-12 object-cover rounded-full ring-2 ring-white"
                src={getUserById(allUser, artwork.user)?.avatar}
                alt=""
              />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  {getUserById(allUser, artwork.user)?.name}
                </h4>
                <p className="text-sm">
                  The React Framework – created and maintained by @vercel.
                </p>
                <div className="flex items-center pt-2">
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-muted-foreground">
                    {getUserById(allUser, artwork.user)?.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            padding: "6px",
          }}
        >
          {artwork.content}
        </pre>
        <div
          key={artwork._id}
          className="w-auto  xl:gap-x-8 shadow-md  border-solid  border-white "
        >
          <div className="relative overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 flex justify-center ">
            <Image.PreviewGroup items={artwork.image}>
              <Image
                maskClassName="w-full h-full object-cover object-center lg:h-full lg:w-full "
                src={artwork.image}
                alt={artwork.imageAlt}
              />
            </Image.PreviewGroup>
          </div>
        </div>
        <div className="flex justify-around mb-1 p-1 gap-10 mt-2 ">
          <p>
            {likedProductIds[index]} {artwork?.likes ? "Like" : ""}
          </p>
          <p>
            {artwork?.comments.length} {artwork?.comments ? "comment" : ""}
          </p>
        </div>
        <div className="flex justify-center">
          <div className=" w-11/12 h-[1px] bg-[#999998] my-2"></div>
        </div>
        <div className="flex justify-around mb-1 p-1 gap-2">
          <button
            className={`flex gap-2 w-1/2  items-center  h-8  justify-center rounded-lg hover:bg-[#f1f0f0] ${
              likedProducts[index] ? "text-[#08c]" : ""
            }`}
            onClick={() => {
              !likedProducts[index]
                ? handleLike(index, artwork._id, token?._doc?._id)
                : handleUnLike(index, artwork._id, token?._doc?._id);
            }}
          >
            {likedProducts[index] ? (
              <LikeOutlined style={{ fontSize: "20px" }} />
            ) : (
              <LikeOutlined style={{ fontSize: "20px" }} />
            )}
            <p style={likedProducts[index] ? { color: "#08c" } : {}}>
              {likedProducts[index] ? "Đã thích" : "Thích"}
            </p>
          </button>
          <button
            onClick={() => navigate(`/artwork/${artwork._id}`)}
            className="flex gap-2 w-1/2 items-center h-8  justify-center rounded-lg hover:bg-[#f1f0f0]"
          >
            <CommentOutlined style={{ fontSize: "20px" }} />
            Bình luận
          </button>
        </div>
      </div>
      <Modal
        title="Chỉnh sửa thông tin bài"
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
      >
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-2 w-full"
            onSubmit={handleSubmit(onSubmit2)}
          >
            <ComTextArea
              placeholder={"Bạn nghĩ gì?"}
              rows={6}
              {...register("content")}
            />
            <div className="sm:col-span-2">
              <ComSelect
                size={"large"}
                style={{
                  width: "100%",
                }}
                label="Thể loại"
                placeholder="Thể loại"
                onChangeValue={handleChange}
                value={selectedMaterials}
                mode="tags"
                options={options}
                {...register("genre")}
              />
            </div>
            <ComUpImgOne numberImg={1} onChange={onChange} />
            <ComButton htmlType="submit" type="primary">
              Đăng
            </ComButton>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
}
