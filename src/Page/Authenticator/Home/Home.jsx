import ComHeader from "../../Components/ComHeader/ComHeader";
import { useEffect, useRef, useState } from "react";
import { getData } from "../../../api/api";
import InfiniteScroll from "react-infinite-scroll-component";

import ComPost from "../../Components/ComPost/ComPost";

import { Link } from "react-router-dom";
import { useStorage } from "../../../hooks/useLocalStorage";

import "./styles.css";
export default function Home() {
  const [products, setProducts] = useState([]);
  console.log("🚀 ~ Home ~ products:", products)
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [likedProducts, setLikedProducts] = useState([]);
  const [token, setToken] = useStorage("user", {});
  const [likedProductIds, setLikedProductIds] = useState([]);
  const containerRef = useRef(null);
  const fetchData = async (pageNumber) => {
    try {
      const response = await getData(`/artwork?page=${pageNumber}&limit=20`);
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

  return (
    <>
      <ComHeader />
      {token?._doc?._id ? <ComPost /> : <div></div>}
      <InfiniteScroll
        dataLength={products.length}
        next={fetchMoreProducts}
        hasMore={hasMore}
        style={{ padding: "0 30px" }}
        // loader={<h4>Loading...</h4>}
      >
        <div class="flex-none w-full max-w-full px-3 mt-6">
          <div class="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
            <div class="p-4 pb-0 mb-0 bg-white rounded-t-2xl">
              <h6 class="mb-1">FEED</h6>
              <p class="leading-normal text-sm">
                list more artwork sharing platform
              </p>
            </div>
            <div class="flex-auto p-4">
              <div class="flex flex-wrap -mx-3" ref={containerRef}>
                {/* <div class="w-full max-w-full px-3 mb-6 md:w-6/12 md:flex-none xl:mb-0 xl:w-3/12">
                  <div class="relative flex flex-col h-full min-w-0 break-words bg-transparent border border-solid shadow-none rounded-2xl border-slate-100 bg-clip-border">
                    <div class="flex flex-col justify-center flex-auto p-6 text-center">
                      <Link to="#">
                        <i
                          class="mb-4 fa fa-plus text-slate-400"
                          aria-hidden="true"
                        ></i>
                        <h5 class="text-slate-400">+ New Artwork</h5>
                      </Link>
                    </div>
                  </div>
                </div> */}
                {products.map((artwork, index) => (
                  <>
                    <div
                      className="bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border w-full max-w-full px-3 mb-6 md:w-6/12 md:flex-none xl:mb-0 xl:w-3/12"
                      style={{ margin: "10px 0" }}
                      key={index}
                    >
                      <div className="relative flex flex-col min-w-0 break-words bg-transparent border-0 shadow-none rounded-2xl bg-clip-border">
                        <div
                          className="relative"
                          style={{ paddingTop: "10px" }}
                        >
                          <Link
                            to={`/artwork/${artwork._id}`}
                            className="block shadow-xl rounded-2xl"
                          >
                            <img
                              src={artwork.image}
                              alt={artwork.imageAlt}
                              className="max-w-full shadow-soft-2xl rounded-2xl"
                              style={{ width: "100%", height: "300px" }}
                              onLoad={() =>
                                containerRef.current.dispatchEvent(
                                  new Event("load")
                                )
                              }
                            />
                          </Link>
                        </div>
                        <div className="flex-auto px-1 pt-6 pb-6">
                          <p className="relative z-10 mb-2 leading-normal text-transparent bg-gradient-to-tl from-gray-900 to-slate-800 text-sm bg-clip-text">
                            createdAt : {artwork.createdAt}
                          </p>
                          <Link to={`/artwork/${artwork._id}`}>
                            <h5>Username</h5>
                          </Link>
                          <p className="mb-6 leading-normal text-sm">
                            {artwork.content}
                          </p>
                          <p className="mb-6 leading-normal text-sm">
                            categories :{" "}
                            {artwork?.genre.map((genre, index) => (
                              <span key={index}>{genre}</span>
                            ))}
                          </p>
                          <div className="flex items-center justify-between">
                            <Link
                              to={`/artwork/${artwork._id}`}
                              className="inline-block px-8 py-2 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs hover:scale-102 active:shadow-soft-xs tracking-tight-soft border-fuchsia-500 text-fuchsia-500 hover:border-fuchsia-500 hover:bg-transparent hover:text-fuchsia-500 hover:opacity-75 hover:shadow-none active:bg-fuchsia-500 active:text-white active:hover:bg-transparent active:hover:text-fuchsia-500"
                            >
                              View artwork
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
}
