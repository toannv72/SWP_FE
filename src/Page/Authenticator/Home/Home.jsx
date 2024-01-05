
import ComHeader from "../../Components/ComHeader/ComHeader";
import images from "../../../img";
import { useEffect, useState } from "react";
import { getData } from "../../../api/api";
import InfiniteScroll from 'react-infinite-scroll-component';
import { ComLink } from "../../Components/ComLink/ComLink";
import {
    LikeOutlined,
    CommentOutlined
} from '@ant-design/icons';
export default function Home() {
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchData = async (pageNumber) => {
        try {
            const response = await getData(`/product?page=${pageNumber}&limit=10`);
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
    function discount(initialPrice, discountedPrice) {
        if (initialPrice <= 0 || discountedPrice <= 0) {
            return "Giá không hợp lệ";
        }

        let discountPercentage = ((initialPrice - discountedPrice) / initialPrice) * 100;
        if (discountPercentage.toFixed(0) > 99) {
            return 99
        } else {

            return discountPercentage.toFixed(0); // Giữ nguyên số thập phân, không rút gọn
        }
    }
    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }
    return (
        <>
            <ComHeader />
            <InfiniteScroll
                dataLength={products.length}
                next={fetchMoreProducts}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
            >
                <div className="grid gap-4 justify-center ">
                    {products.map((product) => (
                        <>
                            <ComLink key={product._id} to={`/product/${product._id}`} className="sm:w-[600px] lg:w-[900px] xl:w-[1000px] xl:gap-x-8 shadow-md  border-solid border-2 border-white ">
                                <div className="relative  h-80 overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 border-solid border-2 border-stone-100">
                                    <img
                                        src={product.image}
                                        alt={product.imageAlt}
                                        className="w-full h-full object-cover object-center lg:h-full lg:w-full  absolute "
                                    />
                                    <div className="relative w-14 h-14 mt-2 ml-2 flex justify-center items-center">
                                        <img
                                            src={images.discount}
                                            alt={product.imageAlt}
                                            className="w-14 h-14 object-cover object-center absolute"
                                        />
                                        <span className="absolute text-white">-{discount(product.price, product.reducedPrice)}%</span>
                                    </div>
                                </div>
                                <h3 className="mt-4 text-base h-12 ml-2 mr-2 text-gray-700 line-clamp-2">{product.name}</h3>
                                <div className="">
                                    <p className="mt-1 ml-2  text-sm font-medium line-through text-slate-500">{formatCurrency(product.price)}</p>
                                    <div className="flex justify-between">
                                        <p className="ml-2 pb-4 text-2xl font-medium  text-red-600">{formatCurrency(product.reducedPrice)}</p>
                                        <p className="mt-1 mr-2  text-sm font-medium ">Đã bán: {(product.sold)}</p>
                                    </div>
                                </div>
                            </ComLink>
                            <div className="flex justify-around" >
                                <div className="flex gap-2 w-1/2 leading-loose h-8 bg justify-center rounded-lg hover:bg-[#f1f0f0]"><LikeOutlined style={{ fontSize: '20px', color: '#08c' }} /><p style={{ color: '#08c' }}>Thích</p> </div>
                                <div className="flex gap-2 w-1/2 leading-loose h-8 bg justify-center rounded-lg hover:bg-[#f1f0f0]"><CommentOutlined style={{ fontSize: '20px', color: '#08c' }} />Bình luận</div>
                            </div>
                        </>

                    ))}
                </div>
            </InfiniteScroll>
        </>
    );
}