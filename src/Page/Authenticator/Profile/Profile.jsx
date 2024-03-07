
import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import ComHeader from '../../Components/ComHeader/ComHeader'
import ComImage from '../../Components/ComImage/ComImage'
import { getData, postData, putData } from '../../../api/api'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { textApp } from '../../../TextContent/textApp'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import ComNumber from '../../Components/ComInput/ComNumber'
import { Button, Dropdown, Image, Menu, Modal, notification } from 'antd'
import PageNotFound from '../404/PageNotFound'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { CalendarDays } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  LikeOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { useStorage } from '../../../hooks/useLocalStorage'
import ComUpImgOne from '../../Components/ComUpImg/ComUpImgOne'
import ComButton from '../../Components/ComButton/ComButton'
import { firebaseImgs } from '../../../upImgFirebase/firebaseImgs'
import { FieldError } from '../../Components/FieldError/FieldError'
import ComInput from '../../Components/ComInput/ComInput'
import ComTextArea from '../../Components/ComInput/ComTextArea'
import ComSelect from '../../Components/ComInput/ComSelect'
import Card from './card'
export default function Profile() {
  const [Author, setAuthor] = useState([])
  const { id } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const [error, setError] = useState(false);
  const [error1, setError1] = useState('');
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
  const [likedProductIds, setLikedProductIds] = useState([])
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [image, setImages] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [load, setLoad] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState();
  const loginMessenger = yup.object({

    // code: yup.string().required(textApp.Login.message.username).min(5, "Username must be at least 5 characters"),
    name: yup.string().required(textApp.Reissue.message.username).min(6, textApp.Reissue.message.usernameMIn),
    phone: yup.string().required(textApp.Reissue.message.phone).min(10, "Số điện thoại phải lớn hơn 9 số!").max(10, "Số điện thoại phải nhỏ hơn 11 số!").matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    email: yup.string().email(textApp.Reissue.message.emailFormat).required(textApp.Reissue.message.email),
  })
  const methods = useForm({
    resolver: yupResolver(loginMessenger),
    defaultValues: {
      // code: "",
      name: token?._doc?.name,
      phone: token?._doc?.phone,
      email: token?._doc?.email,
    },
  })
  const methodPost = useForm();
  useEffect(() => {
    if (productUpdate) {
      setSelectedMaterials(productUpdate.genre);
      methodPost.reset({
        content: productUpdate.content,
        genre: productUpdate.genre,
      });
    }
  }, [productUpdate, methodPost]);
  const { handleSubmit, register, setFocus, watch, setValue } = methods
  useEffect(() => {
    if (!token?._doc?._id) {
      navigate('/login')
    }
  },);
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
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [image]);
  const fetchData = async (pageNumber) => {
    try {
      const response = await getData(`/artwork/user/${token?._doc?._id}?page=${pageNumber}&limit=10`);
      const newArray =
        response.data.docs.length > 0
          ? response.data.docs.filter((item) => item.hidden !== true)
          : [];
      return newArray;
    } catch (error) {

      return [];
    }
  };
  const fetchMoreProducts = async () => {
    const newProducts = await fetchData(page + 1);
    if (newProducts.length === 0) {
      setHasMore(false); // No more data to load
    } else {
      setProducts([...products, ...newProducts]);
      const userLikesArray = newProducts?.map(product => product.likes.some(like => like.user === token?._doc?._id));

      const likesCountArray = newProducts?.map(product => product.likes.length);
      setLikedProducts([...likedProducts, ...userLikesArray])
      setLikedProductIds([...likedProductIds, ...likesCountArray])
      setPage(page + 1);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const initialProducts = await fetchData(page);
      // const newArray =
      //   initialProducts.length > 0
      //     ? initialProducts.filter(
      //         (item) => item.hidden !== true
      //       )
      //     : [];
      setProducts(initialProducts);
      const userLikesArray = initialProducts?.map(product => product.likes.some(like => like.user === token?._doc?._id));
      const likesCountArray = initialProducts?.map(product => product.likes.length);
      setLikedProductIds(likesCountArray)
      setLikedProducts(userLikesArray)
    };
    loadInitialData();
  }, [load]); // Run only once on component mount

  const getUserById = (array, userId) => {
    // Sử dụng find để tìm user với _id tương ứng
    const user = array.find(item => item._id === userId);
    return user;
  };


  useEffect(() => {
    getData('/user', {})
      .then((data) => {
        setAllUser(data?.data?.docs)
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
      .then((e) => {
      })
      .catch(err => {
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
      .then((e) => {
      })
      .catch(err => {
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
  }
  useEffect(() => {
    getData(`/user/${token?._doc?._id}`)
      .then((user) => {
        setAuthor(user.data)

      })
      .catch((error) => {
        setError(true)
        console.log(error);
      })

  }, [token?._doc?._id]);

  if (error) {
    return <PageNotFound />;
  }
  const handleMenuClick = (e) => {

    switch (e.key) {
      case '1':
        showModal()
        break;
      case '2':
        showModal1()
        break;
      case '3':
        console.log(3);
        break;
      default:
        break;
    }
  };
  const handleMenuPostClick = (e) => {
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
      label: 'Đổi ảnh đại diện',
      key: '1',
    },
    {
      label: 'Đổi thông tin cá nhân',
      key: '2',
    },
    // {
    //     label: 'Đổi mật khẩu',
    //     key: '2',
    // },
  ]
  const itemPosts = [
    {
      label: "Chỉnh sửa bài",
      key: "1",
    },
    {
      label: "Ẩn bài",
      key: "2",
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
  const menuPost = {
    items: itemPosts,
    onClick: handleMenuPostClick,
  };
  const onSubmit = () => {
    setDisabled(true)
    firebaseImgs(image)
      .then((img) => {

        putData(`/user`, token?._doc?._id, { avatar: img[0] })
          .then((data) => {
            api["success"]({
              message: "Thành công",
              description:
                "Ảnh đại diện của bạn đã được thanh đổi"
            });
            setToken(data)

            setTimeout(() => {
              navigate(`/author/${token?._doc?._id}`)
            }, 2000);

          })
          .catch((error) => {
            setDisabled(false)

            api["error"]({
              message: "Lỗi",
              description:
                "Hiện đang gặp phải vấn đề vui lòng thử lại sau"
            });

          });


      });


  }
  const onSubmit2 = (data) => {
    setDisabled(true);

    firebaseImgs(image).then((img) => {
      console.log({ ...data, user: token._doc._id, image: img });
      handleCancel2();
      setImages([]);
      methodPost.reset({
        content: undefined,
        genre: undefined,
      });
      // postData("/artwork", { ...data, user: token._doc._id, image: img })
      //   .then((r) => {
      //     api["success"]({
      //       message: "Đăng bài thành công",
      //       description: "Bài viết của bạn đã đăng thành công",
      //     });
      //     setTimeout(() => {
      //       navigate("/profile");
      //     }, 3000);
      //     handleCancel();
      //     setDisabled(false);
      //   })
      //   .catch((error) => {
      //     setDisabled(false);

      //     api["error"]({
      //       message: "Lỗi",
      //       description: error.response.data.error,
      //     });
      //   });
    });
  };
  const onSubmit1 = (data) => {
    setError("")
    putData(`/user`, token?._doc?._id, data)
      .then((data) => {
        if (data?.keyValue?.email) {
          setError1('Tài khoản mail này đã có người sửa dụng')
        }

        if (data?.keyValue?.phone) {
          setError1('Số điện thoại này đã có người sửa dụng')
        }
        if (data?._doc) {
          api["success"]({
            message: "Thành công",
            description:
              "Thông tin thay đổi thành công"
          });
          setToken(data)
          setTimeout(() => {
            navigate(`/author/${token?._doc?._id}`)
          }, 2000);
        }


      })
      .catch((error) => {
        setError1(error?.response?.data?.error)
        if (error?.response?.data?.keyValue?.email) {
          setError1('Tài khoản mail này đã có người sửa dụng')
        }

        if (error?.response?.data?.keyValue?.phone) {
          setError1('Số điện thoại này đã có người sửa dụng')
        }
        console.error("Error fetching items:", error);

      });

  }
  if (Author.hidden) {
    // return <PageNotFound />
  }
  return (
    <>
      {contextHolder}
      <ComHeader />

      <div className="bg-white rounded-lg shadow-xl pb-8">
        <div
          x-data="{ openSettings: false }"
          className="absolute right-12 mt-4 rounded"
        >
          <Dropdown trigger={["click"]} menu={menuProps}>
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
        <div className="w-full h-[250px]">
          <img
            src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
            className=" object-cover w-full h-full rounded-tl-lg rounded-tr-lg"
            alt=""
          />
        </div>
        <div className="flex flex-col items-center -mt-20">
          <button>
            {" "}
            <img
              onClick={() => setVisible(true)}
              src={Author?.avatar}
              className="w-40 object-cover h-40 border-4 border-white rounded-full"
              alt=""
            />
          </button>
          <Image
            width={200}
            style={{
              display: "none",
            }}
            src={Author?.avatar}
            preview={{
              visible,
              src: Author?.avatar,
              onVisibleChange: (value) => {
                setVisible(value);
              },
            }}
          />

          <div className="flex items-center space-x-2 mt-2">
            <p className="text-2xl">{Author?.name}</p>
            {/* <span className="bg-blue-500 rounded-full p-1" title="Verified">
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-100 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </span> */}
          </div>
          {!Author.hidden ? (
            <p className="text-gray-700">
              {Author?.follow?.length} người theo dõi ·{" "}
              {Author?.followAdd?.length} người đang theo dõi
            </p>
          ) : (
            "Tài khoản của bạn đã bị khóa"
          )}
        </div>
        {!Author.hidden ? (
          <InfiniteScroll
            dataLength={products?.length}
            next={fetchMoreProducts}
            hasMore={hasMore}
          >
            <div className="grid gap-4 justify-center ">
              {products?.map((artwork, index) => (
                <Card artwork={artwork} load={load} setLoad={setLoad} index={index} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <></>
        )}

      </div>
      <Modal
        title="Đổi ảnh đại diện"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex justify-center">
          <ComUpImgOne numberImg={1} onChange={onChange} />
        </div>
        <ComButton type="primary" disabled={disabled} onClick={onSubmit}>
          Lưu
        </ComButton>
      </Modal>

      <Modal
        title="Đổi thông tin tài khoản"
        open={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel1}
      >
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit1)}
          >
            <ComInput
              label={"Tên tài khoản"}
              placeholder={"Vui lòng nhập tên tài khoản"}
              type="text"
              // search
              maxLength={26}
              onchange={() => {
                setError("");
              }}
              {...register("name")}
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
            <h1 className="text-red-500">{error1}</h1>
            <ComButton htmlType="submit" type="primary">
              Thay đổi
            </ComButton>
          </form>
        </FormProvider>
      </Modal>
      <Modal
        title="Chỉnh sửa thông tin bài"
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
      >
        <FormProvider {...methodPost}>
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
