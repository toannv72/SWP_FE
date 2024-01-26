
import ComHeader from "../../Components/ComHeader/ComHeader";
import { useEffect, useRef, useState } from "react";
import { getData } from "../../../api/api";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useNavigate } from "react-router-dom";
import { useStorage } from "../../../hooks/useLocalStorage";

// import './styles.css'
export default function Follow() {
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [likedProducts, setLikedProducts] = useState([]);
    const [token, setToken] = useStorage("user", {});
    const [likedProductIds, setLikedProductIds] = useState([])
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const fetchData = async (pageNumber) => {
        try {



            const response = await getData(`/artwork/follow/${token?._doc?._id}?page=${pageNumber}&limit=20`);
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
        if (!token?._doc?._id) {
            return navigate('/login')
        } else {
            loadInitialData();
        }
    }, []); // Run only once on component mount

    useEffect(() => {
        const handleImageLoad = () => {
            const cards = containerRef.current.querySelectorAll('.card');

            cards.forEach((card) => {
                const img = card.querySelector('img');
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                const cardHeight = card.offsetWidth * aspectRatio;
                const rowSpan = Math.ceil(cardHeight / 10); // 10 là giá trị --row_increment
                // Áp dụng giá trị cho grid-row-end
                card.style.gridRowEnd = `span ${rowSpan}`;
            });
        };

        const container = containerRef.current;

        if (container) {
            // Kiểm tra khi các hình ảnh được tải xong
            container.addEventListener('load', handleImageLoad);
        }

        return () => {
            if (container) {
                // Cleanup event listener when component unmounts
                container.removeEventListener('load', handleImageLoad);
            }
        };
    }, [products]);

    // useEffect để thiết lập mảng likedProducts có độ dài bằng độ dài của mảng products và mỗi phần tử có giá trị ban đầu là false

    return (
        <>
            <ComHeader />
            <InfiniteScroll
                dataLength={products.length}
                next={fetchMoreProducts}
                hasMore={hasMore}
            >
                <div className="pin_container" ref={containerRef}>
                    {products.map((artwork, index) => (
                        <Link to={`/artwork/${artwork._id}`} className={`card`} key={index} >
                            <img
                                className="rounded-md p-1"
                                src={artwork.image}
                                style={{ borderRadius: '24px' }}
                                alt={artwork.imageAlt}
                                onLoad={() => containerRef.current.dispatchEvent(new Event('load'))}
                            />
                        </Link>
                    ))}
                </div>
            </InfiniteScroll>

        </>
    );
}