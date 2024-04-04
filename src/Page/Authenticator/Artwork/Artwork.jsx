
import { useEffect, useRef, useState } from 'react'
import ComHeader from '../../Components/ComHeader/ComHeader'
import { getData, postData } from '../../../api/api'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dropdown, Input, Space, notification } from 'antd'
import ComTextArea from '../../Components/ComInput/ComTextArea'
import ComButton from '../../Components/ComButton/ComButton'
import TextArea from 'antd/es/input/TextArea'
import { useStorage } from '../../../hooks/useLocalStorage'
import {
    HeartOutlined,
    SendOutlined,
    HeartFilled
} from '@ant-design/icons';
import PageNotFound from '../404/PageNotFound'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { CalendarDays } from 'lucide-react'
import { useSocket } from '../../../App'
import ReportModal from './ReportModal'
import axios from 'axios'

export default function Artwork() {
    const socket = useSocket()
    const [artwork, setArtwork] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [image, setImage] = useState([])
    const [disabled, setDisabled] = useState(false);
    const [dataL, setDataL] = useState(false);
    const [like, setLike] = useState(false);
    const { id } = useParams();
    const [allUser, setAllUser] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || []);
    const [token, setToken] = useStorage("user", {});
    const textAreaRef = useRef(null);
    const location = useLocation();
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const productQuantity = yup.object({
        content: yup.string().required("Vui lòng nhập")
    })
    const clearTextArea = () => {
        if (textAreaRef.current) {
            textAreaRef.current.textArea.value = ''; // Xóa giá trị trong TextArea
        }
    };
    // console.log()
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
    const methods = useForm({
        resolver: yupResolver(productQuantity),
        defaultValues: {
            content: "",
        },
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    useEffect(() => {
        getData(`/artwork/${id}`)
            .then((artwork) => {
                if (artwork?.data?.hidden === false) {
                    setArtwork(artwork.data)
                    const userLikes = (artwork?.data?.likes || []).some(like => like.user === token?._doc?._id);
                    setLike(userLikes)
                }
                else {
                    setArtwork()
                }
            })
            .catch((error) => {
                setError(true)
                console.log(error);
            })

    }, [id, like]);

    const handleLike = (id_artwork, id_user) => {
        if (!token?._doc?._id) {
            return navigate('/login')
        }
        setLike(true);
        postData(`/artwork/likeArtwork/${id_artwork}/${id_user}`, {})
            .then((e) => { })
            .catch((error) => {
                console.log(error);
                api["error"]({
                    message: "Lỗi",
                    description: error.response.data.error,
                });
            });
            if (artwork.user !== token?._doc?._id) {
              sendNotification("đã thích", 1);
            }
    };
    const handleUnLike = (id_artwork, id_user) => {
        if (!token?._doc?._id) {
            return navigate('/login')
        }
        setLike(false);

        postData(`/artwork/unlikeArtwork/${id_artwork}/${id_user}`, {})
            .then((e) => { })
            .catch((error) => {
                console.log(error);
                api["error"]({
                    message: "Lỗi",
                    description: error.response.data.error,
                });
            });

    };
    useEffect(() => {
        if (artwork?.image) {
            setImage(artwork?.image.map(image => ({

                original: image,
                thumbnail: image,
                className: 'w-24 h-24',
            })
            ))
        }
    }, [artwork])

    const onSubmit = (data) => {
        if (!user?._doc?.username) {
            return navigate('/login', { state: location.pathname })
        } else {
          
            postData(`/artwork/comments/${id}/${token._doc._id}`, { ...data, })
                .then((r) => {
                    getData(`/artwork/${id}`)
                    .then((artwork) => {
                        if(artwork?.data?.hidden=== false ) {
                            setArtwork(artwork.data)
                            const userLikes = (artwork?.data?.likes || []).some(like => like.user === token?._doc?._id);
                            setLike(userLikes)
                        }
                        else {
                            setArtwork()
                        }
                    })
                    .catch((error) => {
                        setError(true)
                        console.log(error);
                    })
                })
                .catch((error) => {
                    console.log(error);
                    api["error"]({
                        message: "Lỗi",
                        description: error.response.data.error,
                    });
                 
                });
            if (artwork.user !== token?._doc?._id) {
              sendNotification("đã comment", 1);
            }
        }
        clearTextArea()

        setValue('content', '');
        return getData(`/artwork/${id}`)
            .then((artwork) => {
                if (artwork?.data?.hidden === false) {
                    setArtwork(artwork.data)
                    const userLikes = (artwork?.data?.likes || []).some(like => like.user === token?._doc?._id);
                    setLike(userLikes)
                }
                else {
                    setArtwork()
                }
            })
            .catch((error) => {
                setError(true)
                console.log(error);
            })
    }
    console.log(dataL);
    const sendNotification = async (textType, type) => {
        socket.emit("push_notification", { artwork: artwork, pusher: user._doc, author: artwork?.user, textType, type, link: window.location.href })
        const res = await axios({
            url: "http://localhost:5000/api/notification",
            method: "post",
            data: {
                artwork: artwork, pusher: user._doc, author: artwork?.user, textType, type, link: window.location.href
            }
        })
        const result = await res.data
        console.log(result)
    }

    const onChange = (e) => {
        console.log(e);
        if (e.target.value) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    };
    const getUserById = (array, userId) => {
        // Sử dụng find để tìm user với _id tương ứng
        const user = array.find(item => item._id === userId);
        return user;
    };
    if (error || !artwork) {
        return <PageNotFound />
    }
    const items = [
        {
            label: 'Báo cáo.',
            key: '1',
        },
        // {
        //     label: 'Đổi ảnh bìa',
        //     key: '2',
        // },
        // {
        //     label: 'Đổi mật khẩu',
        //     key: '3',
        // },

    ]
    const handleMenuClick = (e) => {
        setOpenModal(true)
        console.log('click', e);
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    console.log("token",token)
    return (
      <>
        {contextHolder}
        <ComHeader />
        <ReportModal
          isModalOpen={openModal}
          setIsModalOpen={setOpenModal}
          artwork={artwork}
          user={user}
        />
        <div className="flex justify-center">
          <Link to="/"
            className="h-24 cursor-pointer duration-200 hover:scale-125 active:scale-100"
            title="Go Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50px"
              height="50px"
              viewBox="0 0 24 24"
              class="stroke-blue-300"
            >
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M11 6L5 12M5 12L11 18M5 12H19"
              ></path>
            </svg>
          </Link>
          <div className=" lg:grid  xl:grid-cols-2  lg:grid-rows-[auto,auto,1fr] shadow-lg  rounded-[2.5rem]  w-2/3 m-2">
            <div className="">
              <img
                className="rounded-l-[2.5rem]  max-xl:rounded-r-[2.5rem] lg:rounded-l-[2.5rem] sm:rounded-l-[2.5rem] w-full"
                src={artwork?.image}
                alt=""
              />
            </div>
            <div className="p-2 grid content-between">
              <div>
                <div className="flex justify-between">
                  <div className="px-2 py-1 flex items-center gap-2 w-auto">
                    <Link to={`/author/${artwork.user}`}>
                      <img
                        className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white"
                        src={getUserById(allUser, artwork.user)?.avatar}
                        alt=""
                      />
                    </Link>
                    <Link to={`/author/${artwork.user}`} className="text-2xl">
                      {getUserById(allUser, artwork.user)?.name}
                    </Link>
                  </div>
                  {/* <button className='rounded-full m-4 p-3 bg-[#efefef] hover:bg-[#e2e2e2] text-xl' >
                                    Theo dõi
                                </button> */}
                  <Dropdown trigger={["click"]} menu={menuProps}>
                    <button className="rounded-full m-4 p-3 hover:bg-slate-200">
                      <svg
                        class="gUZ R19 U9O kVc"
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        aria-label=""
                        role="img"
                      >
                        <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path>
                      </svg>
                    </button>
                  </Dropdown>
                </div>

                <p>
                  <p
                    className="text-base font-medium text-gray-700"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      padding: "6px",
                    }}
                  >
                    Category:{" "}
                    {artwork?.genre?.map((item) => (
                      <span
                        style={{
                          padding: "5px",
                          background: "#d3e7ff",
                          borderRadius: "10px",
                          margin: "0 3px",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </p>
                  <p
                    className="text-base font-medium text-gray-700"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      padding: "6px",
                    }}
                  >
                    Content: {artwork?.content}
                  </p>
                </p>
                <div className="h-64 overflow-auto">
                  {artwork?.comments
                    ?.slice()
                    .reverse()
                    .map((comment, i) => (
                      <div
                        key={i}
                        className=" m-2 rounded-lg flex items-start "
                      >
                        {/* <div className="px-2 py-1 flex items-center gap-2">
                                                <img className="inline-block h-8 w-8 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, comment?.user)?.avatar} alt="" /> <p className="text-xl">{getUserById(allUser, comment?.user)?.name}</p>
                                            </div> */}

                        <div className="px-2 py-1 flex items-center gap-2 w-auto">
                          <Link
                            to={`/author/${
                              getUserById(allUser, comment?.user)?._id
                            }`}
                          >
                            <img
                              className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white"
                              src={getUserById(allUser, comment?.user)?.avatar}
                              alt=""
                            />
                          </Link>
                          <Link
                            to={`/author/${
                              getUserById(allUser, comment?.user)?._id
                            }`}
                            className=" font-semibold"
                          >
                            {getUserById(allUser, comment?.user)?.name}
                          </Link>
                        </div>

                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                            padding: "11px",
                          }}
                        >
                          {comment.content}
                        </pre>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center px-6 ">
                  <div className=" font-semibold text-2xl ">
                    <p>
                      {artwork?.comments?.length
                        ? `${artwork?.comments?.length} Nhận xét `
                        : `Bạn nghĩ gì?`}{" "}
                    </p>
                  </div>
                  <div className="flex gap-4 ">
                    <div className="flex gap-1">
                      <HeartFilled style={{ fontSize: "20px", color: "red" }} />{" "}
                      <div className="flex items-center">
                        {artwork?.likes?.length}
                      </div>
                    </div>
                    {
                      <button
                        onClick={() => {
                          !like
                            ? handleLike(artwork._id, token?._doc?._id)
                            : handleUnLike(artwork._id, token?._doc?._id);
                        }}
                        className={`flex gap-2 p-2 rounded-full  items-center  justify-center  hover:bg-[#f1f0f0] ${
                          like ? "text-[#cc0700]" : ""
                        }`}
                      >
                        {like ? (
                          <HeartFilled style={{ fontSize: "40px" }} />
                        ) : (
                          <HeartOutlined style={{ fontSize: "40px" }} />
                        )}
                      </button>
                    }
                  </div>
                </div>
                <FormProvider {...methods}>
                  <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 flex justify-between items-start">
                      <ComTextArea
                        // readOnly={token?._doc?.hidden=== true ? true : false}
                        placeholder="Thêm nhận xét"
                        autoSize={{
                          minRows: 1,
                          maxRows: 3,
                        }}
                        ref={textAreaRef}
                        style={{
                          resize: "none",
                        }}
                        className="w-full"
                        watch={onChange}
                        size="large"
                        {...register("content")}
                      />
                      {
                        // token?._doc?.hidden!== true &&
                        <>
                          {disabled || (
                            <button className="p-2" type="submit">
                              <SendOutlined style={{ fontSize: "30px" }} />
                            </button>
                          )}
                        </>
                      }
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
