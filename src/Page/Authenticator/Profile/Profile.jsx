
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
import { Button, Dropdown, Image, Modal, notification } from 'antd'
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
export default function Profile() {
    const [Author, setAuthor] = useState([])
    const { id } = useParams();
    const [api, contextHolder] = notification.useNotification();
    const [error, setError] = useState(false);
    const [products, setProducts] = useState([]);
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
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
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
            console.log(response);
            return response.data.docs;
        } catch (error) {
            console.log(error);
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
                console.log(2);
                break;
            case '3':
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
            label: 'Đổi mật khẩu',
            key: '2',
        },
    ]

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const onSubmit = () => {
        setDisabled(true)
        firebaseImgs(image)
            .then((img) => {
                console.log(img);
                putData(`/user`,token?._doc?._id, { avatar: img[0] })
                    .then((data) => {
                        api["success"]({
                            message: "Thành công",
                            description:
                                "Ảnh đại diện của bạn đã được thanh đổi"
                        });
                        setToken(data)
                        console.log(data);
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
    return (
        <>
            {contextHolder}
            <ComHeader />

            <div className="bg-white rounded-lg shadow-xl pb-8">
                <div x-data="{ openSettings: false }" className="absolute right-12 mt-4 rounded">
                    <Dropdown trigger={['click']} menu={menuProps} >

                        <button className="border border-gray-400 p-2 rounded text-gray-300 hover:text-gray-300 bg-gray-100 bg-opacity-10 hover:bg-opacity-20" title="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                            </svg>
                        </button>
                    </Dropdown>
                </div>
                <div className="w-full h-[250px]">
                    <img src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg" className=" object-cover w-full h-full rounded-tl-lg rounded-tr-lg" alt='' />
                </div>
                <div className="flex flex-col items-center -mt-20">
                    <button> <img onClick={() => setVisible(true)} src={Author?.avatar} className="w-40 object-cover h-40 border-4 border-white rounded-full" alt='' /></button>
                    <Image
                        width={200}
                        style={{
                            display: 'none',
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
                    <p className="text-gray-700">{Author?.follow?.length} người theo dõi ·  {Author?.followAdd?.length} người đang theo dõi</p>

                </div>



                <InfiniteScroll
                    dataLength={products.length}
                    next={fetchMoreProducts}
                    hasMore={hasMore}
                >
                    <div className="grid gap-4 justify-center ">
                        {products.map((artwork, index) => (
                            <div key={index} className=" w-screen bg-[#f3f9f140] sm:w-[600px] lg:w-[900px] xl:w-[1000px] xl:gap-x-8 shadow-md rounded-lg border-solid border-2 border-[#89898936] ">
                                <HoverCard>

                                    <div className="px-2 py-1 flex items-center gap-2 w-auto">
                                        <HoverCardTrigger> <Link to={`/author/${artwork.user}`}><img className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, artwork.user)?.avatar} alt="" /></Link> </HoverCardTrigger>
                                        <HoverCardTrigger><Link to={`/author/${artwork.user}`} className="text-2xl">{getUserById(allUser, artwork.user)?.name}</Link></HoverCardTrigger>
                                    </div>

                                    <HoverCardContent className="relative transform  rounded-lg bg-slate-100 text-left shadow-xl transition-all p-2 z-50 ">
                                        <div className="flex justify-between space-x-4">
                                            <img className="inline-block h-12 w-12 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, artwork.user)?.avatar} alt="" />
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">{getUserById(allUser, artwork.user)?.name}</h4>
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
                                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", padding: '6px' }}>
                                    {artwork.content}
                                </pre>
                                <div key={artwork._id} className="w-auto  xl:gap-x-8 shadow-md  border-solid  border-white ">
                                    <div className="relative overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 flex justify-center ">

                                        <Image.PreviewGroup
                                            items={artwork.image}
                                        >
                                            <Image
                                                maskClassName="w-full h-full object-cover object-center lg:h-full lg:w-full "

                                                src={artwork.image}
                                                alt={artwork.imageAlt}
                                            />
                                        </Image.PreviewGroup>
                                    </div>
                                </div>
                                <div className="flex justify-around mb-1 p-1 gap-10 mt-2 ">
                                    <p>{likedProductIds[index]} {artwork?.likes ? "Like" : ''}</p>
                                    <p>{artwork?.comments.length} {artwork?.comments ? "comment" : ''}</p>
                                </div>
                                <div className="flex justify-center">
                                    <div className=" w-11/12 h-[1px] bg-[#999998] my-2">
                                    </div>
                                </div>
                                <div className="flex justify-around mb-1 p-1 gap-2" >
                                    <button className={`flex gap-2 w-1/2  items-center  h-8  justify-center rounded-lg hover:bg-[#f1f0f0] ${likedProducts[index] ? 'text-[#08c]' : ''}`}
                                        onClick={() => { !likedProducts[index] ? handleLike(index, artwork._id, token?._doc?._id) : handleUnLike(index, artwork._id, token?._doc?._id) }} >
                                        {likedProducts[index] ? <LikeOutlined style={{ fontSize: '20px' }} /> : <LikeOutlined style={{ fontSize: '20px', }} />}
                                        <p style={likedProducts[index] ? { color: '#08c' } : {}}>{likedProducts[index] ? 'Đã thích' : 'Thích'}</p>
                                    </button>
                                    <button onClick={() => navigate(`/artwork/${artwork._id}`)} className="flex gap-2 w-1/2 items-center h-8  justify-center rounded-lg hover:bg-[#f1f0f0]"><CommentOutlined style={{ fontSize: '20px', }} />Bình luận</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
            <Modal title="Đổi ảnh đại diện" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <div className='flex justify-center'>
                    <ComUpImgOne numberImg={1} onChange={onChange} />
                </div>
                <ComButton
                    type="primary"
                    disabled={disabled}
                    onClick={onSubmit}
                >
                Lưu</ComButton>

            </Modal>

        </>
    )
}
