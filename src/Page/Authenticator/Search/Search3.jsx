import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getData } from "../../../api/api";
import ComHeader from "../../Components/ComHeader/ComHeader";
import { Radio } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";



export default function SearchUser() {
    const { search } = useParams();

    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const [checked, setChecked] = useState(3);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const encodedString = location.search;
    const queryString = encodedString.substring(1);
    const queryParams = queryString.split("&");
    const [users, setUsers] = useState([]);
    const params = {};
    for (let i = 0; i < queryParams.length; i++) {
        const pair = queryParams[i].split("=");
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        params[key] = value;
    }
    const fetchData = async (pageNumber) => {
        try {
            const response = await getData(`/user/search?name=${search}&page=${pageNumber}&limit=200000000`);
            console.log(response.data.user)
            const newArray =response.data.user.filter((item) => item.hidden !== true)
                
            setUsers(newArray)
        } catch (error) {
            console.log(error);
            return [];
        }
    };


    console.log(users);
    useEffect(() => {
        fetchData()
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
            container.addEventListener('load', handleImageLoad);
        }

        return () => {
            if (container) {
                // Cleanup event listener when component unmounts
                container.removeEventListener('load', handleImageLoad);
            }
        };
    }, [products, checked]);


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
                <div className=" items-center mb-2 pl-20 pt-10 " >
                    <p className="text-xl font-bold text-slate-900 mb-4"> Bộ lọc</p>
                    <Radio.Group onChange={onChange} value={checked} className="grid ">
                        <Radio value={1}><p className="text-sm font-semibold leading-6 text-slate-900">Từ khóa</p></Radio>
                        <Radio value={2}><p className="text-sm font-semibold leading-6 text-slate-900">Thể loại</p></Radio>
                        <Radio value={3}><p className="text-sm font-semibold leading-6 text-slate-900">Hồ sơ</p></Radio>
                    </Radio.Group>
                </div>

                <div className="p-4 flex items-center">
                    {users?.length !== 0 ?
                        <div className='flex'>
                            {users.map((user, index) => (
                                <div>
                                    <Link
                                        to={`/author/${user._id}`}
                                        className={`card`}
                                        key={index}
                                        style={{ display: "flex", alignItems: "center" }}
                                    >
                                        <img
                                            className="rounded-md p-1"
                                            src={user.avatar}
                                            style={{ borderRadius: "50%", width: "60px" }}
                                            alt={user.avatar}
                                        />
                                        <span>{user.username}</span>
                                    </Link>
                                </div>
                            ))}
                        </div> : <div className=" text-center w-screen"> Không tìm tài khoản đang tìm kiếm</div>}


                </div>
            </div>
        </>
    )
}