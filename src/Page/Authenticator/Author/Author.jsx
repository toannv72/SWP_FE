
import { useEffect, useState } from 'react'
import ComHeader from '../../Components/ComHeader/ComHeader'
import { getData, postData } from '../../../api/api'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button, Image, Modal, notification } from 'antd'
import PageNotFound from '../404/PageNotFound'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { CalendarDays } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  LikeOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { useStorage } from '../../../hooks/useLocalStorage'
import { useSocket } from '../../../App'
import ReportModal from './ReportModal'
import axios from 'axios'
import ComFooter from '../../Components/ComFooter/ComFooter'
export default function Author() {
  const socket = useSocket()
  const [Author, setAuthor] = useState([])
  const { id } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [follow, setFollow] = useState(false);
  const [page, setPage] = useState(1);
  const [likedProducts, setLikedProducts] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useStorage("user", {});
  const [likedProductIds, setLikedProductIds] = useState([])
  const [openModal, setOpenModal] = useState(false)


  const handFollow = () => {
    setFollow(!follow);
    postData(`/user/followUser/${id}/${token?._doc?._id}`, {})
      .then((e) => {
        console.log( e);
      })
      .catch(err => {
        console.log(err);
      });
    sendNotification("", 2)
  }
  const handUndFollow = () => {
    setFollow(!follow);
    postData(`/user/undFollowUser/${id}/${token?._doc?._id}`, {})
      .then((e) => {
        console.log(e);
      })
      .catch(err => {
        console.log(err);
      });

  }

  const handleRequest = () => {
    navigate("/require?id=" + Author?._id)
  }

  const sendNotification = async (textType, type) => {
    socket.emit("push_notification", { pusher: token._doc, author: Author?._id, textType, type, link: window.location.href })
    const res = await axios({
      url: "http://localhost:5000/api/notification",
      method: "post",
      data: {
        pusher: token._doc, author: Author?._id, textType, type, link: window.location.href
      }
    })
  }
  const fetchData = async (pageNumber) => {
    try {
      const response = await getData(`/artwork/user/${id}?page=${pageNumber}&limit=10`);
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
      const userLikesArray = newProducts.map(product => product.likes.some(like => like.user === token?._doc?._id));

      const likesCountArray = newProducts.map(product => product.likes.length);
      setLikedProducts([...likedProducts, ...userLikesArray])
      setLikedProductIds([...likedProductIds, ...likesCountArray])
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (token?._doc?._id === id) {
      navigate('/profile')
    }
    const loadInitialData = async () => {
      const initialProducts = await fetchData(page);
      setProducts(initialProducts);
      const userLikesArray = initialProducts.map(product => product.likes.some(like => like.user === token?._doc?._id));
      const likesCountArray = initialProducts.map(product => product.likes.length);
      setLikedProductIds(likesCountArray)
      setLikedProducts(userLikesArray)
    };
    loadInitialData();
  }, []); // Run only once on component mount

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
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const handleOk1 = () => {
      setIsModalOpen1(false);
    };
    const handleCancel1 = () => {
      setIsModalOpen1(false);
    };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  useEffect(() => {
    if (!token?._doc?._id) {
      return navigate('/login')
    }
    getData(`/user/${id}`)
      .then((user) => {
        setAuthor(user.data)
        const userFollowAdd = (user?.data?.follow || []).some(Follow => Follow.user === token?._doc?._id);
        setFollow(userFollowAdd)
      })
      .catch((error) => {
        setError(true)
        console.log(error);
      })

  }, [id, follow]);

  if (error) {
    return <PageNotFound />;
  }
  console.log(Author);
  if (Author.hidden) {
    return <PageNotFound />
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
        </div>
        <div className="w-full h-[250px]">
          <img
            src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
            className=" object-cover w-full h-full rounded-tl-lg rounded-tr-lg"
            alt=""
          />
        </div>
        <>
          {!Author.hidden ? (
            <div className="flex flex-col items-center -mt-20">
              <img
                src={Author?.avatar}
                className="w-40  h-40 border-4 border-white rounded-full"
                alt=""
              />
              <div className="flex items-center space-x-2 mt-2">
                <p className="text-2xl">{Author?.name}</p>
                <span className="bg-blue-500 rounded-full p-1" title="Verified">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-100 h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="4"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
              </div>
              <p className="text-gray-700">
                {Author?.follow?.length}{" "}
                <span onClick={showModal}>người theo dõi</span> ·{" "}
                {Author?.followAdd?.length}{" "}
                <span onClick={showModal1}>người đang theo dõi</span>
              </p>
              {parseInt(Author?.follow?.length) > 4 && (
                <button
                  onClick={handleRequest}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
                >
                  Yêu cầu
                </button>
              )}
              <br />
              {Author?.role !== "admin" && (
                <button
                  onClick={() => setOpenModal(true)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
                >
                  Report user
                </button>
              )}
              <ReportModal
                isModalOpen={openModal}
                setIsModalOpen={setOpenModal}
                accuse={Author}
                user={token}
              />
              <div className="flex-1 flex flex-col items-center lg:items-end justify-end px-8 mt-2 mb-8">
                <div className="flex items-center space-x-4 mt-2">
                  {!follow ? (
                    <button
                      onClick={handFollow}
                      className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
                    >
                      <span>Theo dõi</span>
                    </button>
                  ) : (
                    <button
                      onClick={handUndFollow}
                      className="flex items-center bg-slate-500 hover:bg-slate-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
                    >
                      <span>Hủy theo dõi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            "tài khoản này đã bị khóa"
          )}
        </>

        <InfiniteScroll
          dataLength={products.length}
          next={fetchMoreProducts}
          hasMore={hasMore}
        >
          <div className="grid gap-4 justify-center ">
            {products.map((artwork, index) => (
              <div
                key={index}
                className=" w-screen bg-[#f3f9f140] sm:w-[600px] lg:w-[900px] xl:w-[1000px] xl:gap-x-8 shadow-md rounded-lg border-solid border-2 border-[#89898936] "
              >
                <HoverCard>
                  <div className="px-2 py-1 flex items-center gap-2 w-auto">
                    <HoverCardTrigger>
                      {" "}
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
                          The React Framework – created and maintained by
                          @vercel.
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
                    {artwork?.comments.length}{" "}
                    {artwork?.comments ? "comment" : ""}
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
            ))}
          </div>
        </InfiniteScroll>
      </div>
      <Modal
        title="người theo dõi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="text-center">
          {Author?.follow &&
            Author?.follow.map((user, index) => (
              <div
                className="rounded-xl overflow-hidden relative text-center group items-center flex flex-col max-w-sm hover:shadow-2xl transition-all duration-500 shadow-xl"
                style={{
                  display: "inline-table",
                  margin: "0px 5px",
                  width: "92%",
                }}
              >
                <Link
                  to={`/author/${user.user._id}`}
                  className={`card px-6 py-8 sm:p-10 sm:pb-6`}
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={handleCancel}
                >
                  <img
                    className="rounded-md p-1"
                    src={user.user.avatar}
                    style={{
                      borderRadius: "50%",
                      width: "60px",
                      height: "60px",
                    }}
                    alt={user.user.avatar}
                    // onLoad={() =>
                    //   containerRef.current.dispatchEvent(new Event("load"))
                    // }
                  />
                  <div style={{ paddingLeft: "10px", textAlign: "justify" }}>
                    <p className="text-base font-medium text-gray-700">
                      {user.user.username}
                    </p>
                    <span>{user.user?.follow?.length} follow</span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </Modal>
      <Modal
        title="người đang theo dõi"
        open={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel1}
      >
        <div className="text-center">
          {Author?.followAdd &&
            Author?.followAdd.map((user, index) => (
              <div
                className="rounded-xl overflow-hidden relative text-center group items-center flex flex-col max-w-sm hover:shadow-2xl transition-all duration-500 shadow-xl"
                style={{
                  display: "inline-table",
                  margin: "0px 5px",
                  width: "92%",
                }}
              >
                <Link
                  to={`/author/${user.user._id}`}
                  className={`card px-6 py-8 sm:p-10 sm:pb-6`}
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={handleCancel1}
                >
                  <img
                    className="rounded-md p-1"
                    src={user.user.avatar}
                    style={{
                      borderRadius: "50%",
                      width: "60px",
                      height: "60px",
                    }}
                    alt={user.user.avatar}
                    // onLoad={() =>
                    //   containerRef.current.dispatchEvent(new Event("load"))
                    // }
                  />
                  <div style={{ paddingLeft: "10px", textAlign: "justify" }}>
                    <p className="text-base font-medium text-gray-700">
                      {user.user.username}
                    </p>
                    <span>{user.user?.follow?.length} follow</span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </Modal>
      <ComFooter />
    </>
  );
}
