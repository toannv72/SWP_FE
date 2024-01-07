
import ComHeader from "../../Components/ComHeader/ComHeader";
import images from "../../../img";
import { useEffect, useState } from "react";
import { getData, postData } from "../../../api/api";
import InfiniteScroll from 'react-infinite-scroll-component';
import { ComLink } from "../../Components/ComLink/ComLink";
import {
    LikeOutlined,
    CommentOutlined
} from '@ant-design/icons';
import ComPost from "../../Components/ComPost/ComPost";
export default function Home() {
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [likedProducts, setLikedProducts] = useState([]);
    const [allUser, setAllUser] = useState([]);

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
            setPage(page + 1);
        }
    };


    useEffect(() => {
        const loadInitialData = async () => {
            const initialProducts = await fetchData(page);
            setProducts(initialProducts);
        };

        loadInitialData();
    }, []); // Run only once on component mount

    const getUserById = (array, userId) => {
        // Sử dụng find để tìm user với _id tương ứng
        const user = array.find(item => item._id === userId);
        return user;
    };

    const getLikeById = (array, userId) => {
        const Like = array.some(item => item.user === userId);
        return Like;
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
    useEffect(() => {
        setLikedProducts(new Array(products.length).fill(true));
    }, [products]);
    console.log(likedProducts);
    const handleLike = (index, id_artwork, id_user) => {
        const updatedLikedProducts = [...likedProducts];
        updatedLikedProducts[index] = !updatedLikedProducts[index];
        setLikedProducts(updatedLikedProducts);

        postData(`/artwork/likeArtwork/${id_artwork}/${id_user}`, {})
            .then((e) => {
                console.log(e);

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
                            <div className="px-2 py-1 flex items-center gap-2">
                                <img className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, artwork.user)?.avatar} alt="" /> <p className="text-2xl">{getUserById(allUser, artwork.user)?.name}</p>
                                {/* <button  className="text-[#5a86ff]">Theo dõi</button> */}
                            </div>

                            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", padding: '6px' }}>
                                {artwork.content}
                            </pre>
                            <ComLink key={artwork._id} to={`/artwork/${artwork._id}`} className="w-screen sm:w-[600px] lg:w-[900px] xl:w-[1000px] xl:gap-x-8 shadow-md  border-solid  border-white ">
                                <div className="relative overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 ">
                                    <img
                                        src={artwork.image}
                                        alt={artwork.imageAlt}
                                        className="w-full h-full object-cover object-center lg:h-full lg:w-full "
                                    />
                                </div>
                            </ComLink>

                            <div className="flex justify-center">
                                <div className=" w-11/12 h-[1px] bg-[#999998] my-2">
                                </div>
                            </div>

                            <div className="flex justify-around mb-1 p-1 gap-2" >
                                <button className={`flex gap-2 w-1/2  items-center  h-8  justify-center rounded-lg hover:bg-[#f1f0f0] ${likedProducts[index] ? 'text-[#08c]' : ''}`} onClick={() => handleLike(index, artwork._id, artwork.user)}>
                                    {likedProducts[index] ? <LikeOutlined style={{ fontSize: '20px' }} /> : <LikeOutlined style={{ fontSize: '20px', }} />}
                                    <p style={likedProducts[index] ? { color: '#08c' } : {}}>{likedProducts[index] ? 'Đã thích' : 'Thích'}</p>
                                </button>
                                <button className="flex gap-2 w-1/2 items-center h-8  justify-center rounded-lg hover:bg-[#f1f0f0]"><CommentOutlined style={{ fontSize: '20px', }} />Bình luận</button>
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </>
    );
}