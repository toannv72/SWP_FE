
import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import ComHeader from '../../Components/ComHeader/ComHeader'
import ComImage from '../../Components/ComImage/ComImage'
import { getData } from '../../../api/api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { textApp } from '../../../TextContent/textApp'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import ComNumber from '../../Components/ComInput/ComNumber'
import { Button, notification } from 'antd'


const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Product() {
    const [Product, setProduct] = useState([])
    const [image, setImage] = useState([])
    const [disabled, setDisabled] = useState(false);
    const { slug } = useParams();
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [sttCart, setSttCart] = useState(true)
    const [api, contextHolder] = notification.useNotification();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || []);

    const location = useLocation();

    const navigate = useNavigate();

    const productQuantity = yup.object({
        quantity: yup.number().max(Product.quantity, `Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này`).min(1, textApp.Product.message.min).typeError(textApp.Product.message.quantity),
    })
    const LoginRequestDefault = {
        // quantity: "1",
    };
    const methods = useForm({
        resolver: yupResolver(productQuantity),
        defaultValues: {
            quantity: 1,
        },
        values: LoginRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    useEffect(() => {
        getData(`/product/${slug}`)
            .then((product) => {
                setProduct(product.data)
                if (product.data.quantity < 1) {
                    setDisabled(true)
                }
            })
            .catch((error) => {
                console.log(error);
            })

    }, [slug]);

    useEffect(() => {
        if (Product?.image) {
            setImage(Product?.image.map(image => ({

                original: image,
                thumbnail: image,
                className: 'w-24 h-24',
            })
            ))
        }
    }, [Product])

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        if (typeof number === "number") {
      
            return number.toLocaleString('en-US', {
                style: 'currency',
                currency: 'VND',
            });
          }
    }
    const onSubmit = (data) => {

        if (!user?._doc?.username) {
            return navigate('/login', { state: location.pathname })
        }
        console.log(data);
        const product = [{ ...Product, data: data.quantity }];
        navigate('/payment', { state: { dataProduct: product } })
    }
    const addToCart = (data) => {
        const existingProductIndex = cart.findIndex(item => item._id === Product._id);
        const updatedCart = [...cart];
        console.log(existingProductIndex);
        console.log(updatedCart);
        if (existingProductIndex !== -1) {
            if (updatedCart[existingProductIndex].quantityCart === data.quantity) {

                api["warning"]({
                    message: textApp.Product.Notification.m3.message,
                    description:
                        textApp.Product.Notification.m3.description
                });
                return;
            }

            updatedCart[existingProductIndex].data = 1;
            setCart(updatedCart);
            api["success"]({
                message: textApp.Product.Notification.m2.message,
                description:
                    textApp.Product.Notification.m2.description
            });
        }
        if (existingProductIndex === -1) {
            const updatedCart = [...cart, { ...Product, data: 1 }];
            setCart(updatedCart);
            api["success"]({
                message: textApp.Product.Notification.m1.message,
                description:
                    textApp.Product.Notification.m1.description
            });
        }


    }
    const updateCart = (data) => {
        setSttCart(!sttCart)
    }
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));

    }, [cart]);
    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart')))

    }, [sttCart]);
    return (
        <>
            {contextHolder}
            <ComHeader dataCart={cart} updateCart={updateCart} />
            <div className="bg-white">
                <div className="">
                    <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-8">

                        <div className='product' ><ComImage product={image} /></div>

                        <div className="mt-4 lg:row-span-3 lg:mt-0">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{Product.name}</h3>

                            <div className='flex gap-6'>
                                <p className="flex items-end text-2xl tracking-tight line-through text-slate-600 ">
                                    {Product.price && formatCurrency(Product.price)}
                                </p>
                                <p className="text-3xl tracking-tight text-gray-900 ">
                                    {Product.reducedPrice && formatCurrency(Product.reducedPrice)}
                                </p>
                            </div>
                            {/* Reviews */}
                            {/* <div className="mt-6">
                                <h3 className="sr-only">Reviews</h3>
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                className={classNames(
                                                    reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                                                    'h-5 w-5 flex-shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                                    <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        {reviews.totalCount} reviews
                                    </a>
                                </div>
                            </div> */}

                            <div className='flex pt-2'>Đã bán: <h2 className='text-indigo-600 '> {Product?.sold}</h2>                             </div>
                            <div className='flex pt-2'>{textApp.Product.page.shape} <h2 className='text-indigo-600 '>{Product?.shape}</h2>                             </div>
                            <div className='flex pt-2'>{textApp.Product.page.material}<div className='text-indigo-600 '>{Product?.material?.map((e) => ` ${e}`)}</div>
                                {/* {Product?.material?.[1]},{Product?.material?.[2]}. */}
                            </div>
                            <FormProvider {...methods} >
                                <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                        <div className='flex gap-4 items-center'>
                                            <h3 className="text-sm font-medium text-gray-900 ">{textApp.Product.page.quantity}</h3>

                                            <ComNumber
                                                className="w-24 text-sm"
                                                min={disabled ? 0 : 1}
                                                defaultValue={1}
                                                max={Product.quantity}
                                                {...register("quantity")}
                                            />
                                            <div className=''> {Product.quantity} sản phẩm có sẵn</div>
                                            <Button
                                                type='button'
                                                onClick={(addToCart)}
                                                className={`flex h-10 items-center justify-center rounded-md border border-transparent  px-4 py-2 text-base font-medium text-white  focus:outline-none 
                                                 hover:to-orange-500 hover:from-orange-600 bg-gradient-to-b from-orange-400 to-orange-500`}
                                            >
                                                {textApp.Product.button.add}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        disabled={disabled}
                                        htmlType='submit'
                                        type="primary"
                                        className={`mt-10 flex w-full h-12 items-center justify-center rounded-md border border-transparent  px-8 py-3 text-base font-medium text-white ${disabled ? " bg-slate-700" : "hover:to-sky-700 hover:from-sky-800 bg-gradient-to-b from-sky-600 to-sky-700"}  `}
                                    >
                                        {textApp.Product.button.pay}
                                    </Button>

                                </form>
                            </FormProvider>
                        </div>

                    </div>
                    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                        <div className="py-10 lg:col-span-2 lg:col-start-1   lg:pb-16  lg:pt-6 ">
                            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                {Product.description}
                            </pre>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}
