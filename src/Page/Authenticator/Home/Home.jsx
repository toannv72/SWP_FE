
import ComHeader from "../../Components/ComHeader/ComHeader";
import { useEffect, useState } from "react";
import { getData, postData } from "../../../api/api";
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    LikeOutlined,
    CommentOutlined
} from '@ant-design/icons';
import ComPost from "../../Components/ComPost/ComPost";
import { Image } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useStorage } from "../../../hooks/useLocalStorage";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";

import { CalendarDays } from "lucide-react";
import { Avatar } from "@material-tailwind/react";
import ComFooter from "../../Components/ComFooter/ComFooter";
export default function Home() {
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
            const response = await getData(`/artwork?page=${pageNumber}&limit=10`);
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

    return (
        <>
            <ComHeader />
            <ComPost />
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
            <ComFooter/>
        </>
    );
}