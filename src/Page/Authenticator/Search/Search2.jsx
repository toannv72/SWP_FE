import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getData } from "../../../api/api";
import ComHeader from "../../Components/ComHeader/ComHeader";
import {  Radio } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";



export default function Search() {
    const { search } = useParams();

    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [checked, setChecked] = useState(2);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    console.log(products);
    const fetchData = async (pageNumber) => {
        try {
            if (checked === 1) {
                const response = await getData(`/artwork/search?name=${search}&page=${pageNumber}&limit=20`);
                return response.data.products;
            }
            if (checked === 2) {
                const response = await getData(`/artwork/searchGenre?name=${search}&page=${pageNumber}&limit=20`);
                return response.data.products;
            }
            if (checked === 3) {
                const response = await getData(`/user/search?name=${search}&page=${pageNumber}&limit=20`);
               
                return response.data.user;
            }
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
        setPage(1);
    }, [search, checked]); // Run only once on component mount

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
    }, [products,checked]);

  
    const onChange = (e) => {
        if (e.target.value === 1) {
            return navigate(`/search/${search}`)
        }
        if (e.target.value === 2) {
            return navigate(`/searchGenre/${search}`)

        }
        if (e.target.value === 3) {
            return navigate(`/searchUser/${search}`)

        }
    };
    return (
        <>
            <ComHeader />
            <div className="flex gap-10">
                <div className=" items-center mb-2 pl-20 pt-10 " style={{ position: 'fixed' }}>
                    <p className="text-xl font-bold text-slate-900 mb-4"> Bộ lọc</p>
                    <Radio.Group onChange={onChange} value={checked} className="grid ">
                        <Radio value={1}><p className="text-sm font-semibold leading-6 text-slate-900">Từ khóa</p></Radio>
                        <Radio value={2}><p className="text-sm font-semibold leading-6 text-slate-900">Thể loại</p></Radio>
                        <Radio value={3}><p className="text-sm font-semibold leading-6 text-slate-900">Hồ sơ</p></Radio>
                    </Radio.Group>
                </div>

                <div className="p-4 flex items-center">
                    {products?.length !== 0 ? <InfiniteScroll
                        dataLength={products?.length}
                        next={fetchMoreProducts}
                        hasMore={hasMore}
                    // loader={<h4>Loading...</h4>}
                    >
                        <div className=" pin_container " style={{ width: '70vw' }} ref={containerRef}>
                            {products?.map((artwork, index) => (
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
                    </InfiniteScroll> : <div className=" text-center w-screen"> Không tìm thấy bài viết đang tìm kiếm</div>}

             
                </div>
            </div>
        </>
    )
}