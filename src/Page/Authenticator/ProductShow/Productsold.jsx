import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getData } from "../../../api/api";
import { ComLink } from "../../Components/ComLink/ComLink";
import images from "../../../img";
import ComHeader from "../../Components/ComHeader/ComHeader";
import ComFooter from "../../Components/ComFooter/ComFooter";
import { InputNumber, Pagination, Select } from "antd";



export default function ProductSold() {

    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [sortPrice, setSortPrice] = useState(0)
    const [minPrice, setMinPrice] = useState(1000)
    const [maxPrice, setMaxPrice] = useState(10000000)
   
    useEffect(() => {
        getData(`/product/sold?limit=9&page=${page}&sortPrice=${sortPrice}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
            .then((product) => {
                setProducts(product.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }, [page, sortPrice, minPrice, maxPrice]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);
    const onChange = (pageNumber) => {
        console.log('Page: ', pageNumber);
        setPage(pageNumber)
      };
    console.log(products);
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
    if (products?.products?.length === 0) {
        return(
            <>
            <ComHeader />
               <p className="text-center"> Không tìm thấy sản phẩm đang tìm kiếm</p>

            </>
        )
    }
    const changeSelect = (value) => {
        console.log(`selected ${value}`);
        setSortPrice(value)
    };

    const onChangePriceMin = (value) => {
        setMinPrice(value)

    };
    const onChangePriceMax = (value) => {
        setMaxPrice(value)
    };
    return (
        <>
            <ComHeader />
            <div className="bg-white p-4">
                <div className=" mx-auto  max-w-2xl px-4 py-4 sm:px-6 sm:py-4  lg:max-w-7xl lg:px-2">
                <h2 className="bg-red-500 h-12 flex items-center p-2 text-2xl font-bold tracking-tight text-white mb-4">Sản phẩm bán chạy nhất</h2>

                <div className="flex gap-2 mb-2">
                        Giá giao động
                        <InputNumber
                            style={{
                                width: 120,
                            }}
                            defaultValue={1000}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={onChangePriceMin}
                        />

                        <InputNumber
                            defaultValue={10000000}
                            style={{
                                width: 120,
                            }}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={onChangePriceMax}
                        />
                        <Select
                            defaultValue="Sắp xếp theo giá tiền"
                            style={{
                                width: 120,
                            }}
                            onChange={changeSelect}
                            options={[
                                {
                                    label: 'Tăng dần',
                                    value: '1',
                                },
                                {
                                    label: 'Giảm dần',
                                    value: '-1',
                                },

                            ]}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products?.docs?.map((product, index) => (
                            index !== 8 ? <ComLink key={index} to={`/product/${product._id}`} className="shadow-md  border-solid border-2 border-white hover:border-zinc-400">
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
                            </ComLink> :
                                <ComLink key={index} to={`/product/${product._id}`} className="shadow-md group border-solid border-2 border-white hover:border-zinc-400 sm:hidden lg:block xl:hidden ">
                                    <div className="relative aspect-h-1 aspect-w-1 h-80 overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 border-solid border-2 border-stone-100">
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
                                            <p className="ml-2 text-2xl font-medium  text-red-600 pb-4">{formatCurrency(product.reducedPrice)}</p>
                                            <p className="mt-1 mr-2  text-sm font-medium ">Đã bán: {(product.sold)}</p>
                                        </div>
                                    </div>
                                </ComLink>
                        ))}
                    </div>
                 <div className="flex justify-end p-4"><Pagination current={page} total={products.totalDocs}  showSizeChanger={false} defaultPageSize={9} onChange={onChange}/></div>
                </div>
            </div>
            <ComFooter />
        </>
    )
}