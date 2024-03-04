import ComHeader from "../../Components/ComHeader/ComHeader";
import { useEffect, useRef, useState } from "react";
import { getData } from "../../../api/api";
import InfiniteScroll from 'react-infinite-scroll-component';
import ComPost from "../../Components/ComPost/ComPost";
import { Link, useLocation } from "react-router-dom";
import { useStorage } from "../../../hooks/useLocalStorage";
import './styles.css'
export default function Home() {
  const location = useLocation();
  const encodedString = location.search;
  const queryString = encodedString.substring(1);
  const queryParams = queryString.split("&");
  const params = {};
  for (let i = 0; i < queryParams.length; i++) {
    const pair = queryParams[i].split("=");
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1]);
    params[key] = value;
  }
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [likedProducts, setLikedProducts] = useState([]);
  const [token, setToken] = useStorage("user", {});
  const [likedProductIds, setLikedProductIds] = useState([]);
  const containerRef = useRef(null);
  const fetchData = async (pageNumber) => {
    try {
      const response = await getData(
        `/artwork?page=${pageNumber}&limit=20${
          params["cate"] && `&cate=${params["cate"]}`
        }`
      );
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
  }, [params["cate"], page]); // Run only once on component mount

  useEffect(() => {
    const handleImageLoad = () => {
      const cards = containerRef.current.querySelectorAll(".card");

      cards.forEach((card) => {
        const img = card.querySelector("img");
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
      container.addEventListener("load", handleImageLoad);
    }

    return () => {
      if (container) {
        // Cleanup event listener when component unmounts
        container.removeEventListener("load", handleImageLoad);
      }
    };
  }, [products]);

  // useEffect để thiết lập mảng likedProducts có độ dài bằng độ dài của mảng products và mỗi phần tử có giá trị ban đầu là false
console.log(token);
  return (
    <>
      <ComHeader />
      {token?._doc  ? <ComPost />:<></>}
      <InfiniteScroll
        dataLength={products.length}
        next={fetchMoreProducts}
        hasMore={hasMore}
        // loader={<h4>Loading...</h4>}
      >
        <div className="pin_container" ref={containerRef}>
          {products.map((artwork, index) => (
            <Link to={`/artwork/${artwork._id}`} className={`card`} key={index}>
              <div className="relative group">
                <img
                  className="rounded-md p-1 artwork-image"
                  src={artwork.image}
                  style={{ borderRadius: "24px" }}
                  alt={artwork.imageAlt}
                  onLoad={() =>
                    containerRef.current.dispatchEvent(new Event("load"))
                  }
                />
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-2xl"> Thể Loại:</p>
                  {artwork?.genre.map((genre, index) => (
                    <p
                      className={`text-white text-xl ${
                        index >= 3 ? "hidden" : ""
                      }`}
                      key={index}
                    >
                      {genre}
                    </p>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}