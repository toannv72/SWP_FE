
import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import ComHeader from '../../Components/ComHeader/ComHeader'
import ComImage from '../../Components/ComImage/ComImage'
import { getData, postData } from '../../../api/api'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { textApp } from '../../../TextContent/textApp'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import ComNumber from '../../Components/ComInput/ComNumber'
import { Button, Image, notification } from 'antd'
import PageNotFound from '../404/PageNotFound'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { CalendarDays } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
    LikeOutlined,
    CommentOutlined
} from '@ant-design/icons';
import { useStorage } from '../../../hooks/useLocalStorage'
export default function Author() {
    const [Author, setAuthor] = useState([])
    const { id } = useParams();
    const [api, contextHolder] = notification.useNotification();
    const [error, setError] = useState(false);
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [likedProducts, setLikedProducts] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const navigate = useNavigate();
    const [token, setToken] = useStorage("user", {});
    const [likedProductIds, setLikedProductIds] = useState([])

    const fetchData = async (pageNumber) => {
        try {
            const response = await getData(`/artwork/user/${id}?page=${pageNumber}&limit=10`);
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

    useEffect(() => {
        getData(`/user/${id}`)
            .then((user) => {
                setAuthor(user.data)

            })
            .catch((error) => {
                setError(true)
                console.log(error);
            })

    }, [id]);

    if (error) {
        return <PageNotFound />;
    }
    return (
        <>
            {contextHolder}
            <ComHeader />

            <div className="bg-white rounded-lg shadow-xl pb-8">
                <div x-data="{ openSettings: false }" className="absolute right-12 mt-4 rounded">
                    <button className="border border-gray-400 p-2 rounded text-gray-300 hover:text-gray-300 bg-gray-100 bg-opacity-10 hover:bg-opacity-20" title="Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                        </svg>
                    </button>
                    {/* <div x-show="openSettings" className="bg-white absolute right-0 w-40 py-2 mt-1 border border-gray-200 shadow-2xl" >
                        <div className="py-2 border-b">
                            <p className="text-gray-400 text-xs px-6 uppercase mb-1">Settings</p>
                            <button className="w-full flex items-center px-6 py-1.5 space-x-2 hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                </svg>
                                <span className="text-sm text-gray-700">Share Profile</span>
                            </button>
                            <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                </svg>
                                <span className="text-sm text-gray-700">Block User</span>
                            </button>
                            <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-sm text-gray-700">More Info</span>
                            </button>
                        </div>
                        <div className="py-2">
                            <p className="text-gray-400 text-xs px-6 uppercase mb-1">Feedback</p>
                            <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                                <span className="text-sm text-gray-700">Report</span>
                            </button>
                        </div>
                    </div> */}
                </div>
                <div className="w-full h-[250px]">
                    <img src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg" className=" object-cover w-full h-full rounded-tl-lg rounded-tr-lg" alt='' />
                </div>
                <div className="flex flex-col items-center -mt-20">
                    <img src={Author?.avatar} className="w-40  h-40 border-4 border-white rounded-full" alt='' />
                    <div className="flex items-center space-x-2 mt-2">
                        <p className="text-2xl">{Author?.name}</p>
                        <span className="bg-blue-500 rounded-full p-1" title="Verified">
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-100 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </span>
                    </div>
                    <p className="text-gray-700">Senior Software Engineer at Tailwind CSS</p>
                    <p className="text-sm text-gray-500">New York, USA</p>
                </div>


                <div className="flex-1 flex flex-col items-center lg:items-end justify-end px-8 mt-2 mb-8">
                    <div className="flex items-center space-x-4 mt-2">
                        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                            </svg>
                            <span>Connect</span>
                        </button>
                        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                            </svg>
                            <span>Message</span>
                        </button>
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={products.length}
                    next={fetchMoreProducts}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
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


        </>
    )
}
