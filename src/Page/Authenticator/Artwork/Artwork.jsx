
import { useEffect, useRef, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import ComHeader from '../../Components/ComHeader/ComHeader'
import ComImage from '../../Components/ComImage/ComImage'
import { getData, postData } from '../../../api/api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { textApp } from '../../../TextContent/textApp'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import ComNumber from '../../Components/ComInput/ComNumber'
import { Button, Input, Space, notification } from 'antd'
import ComTextArea from '../../Components/ComInput/ComTextArea'
import ComButton from '../../Components/ComButton/ComButton'
import TextArea from 'antd/es/input/TextArea'
import { useStorage } from '../../../hooks/useLocalStorage'


export default function Artwork() {
    const [artwork, setArtwork] = useState([])
    const [image, setImage] = useState([])
    const [disabled, setDisabled] = useState(false);
    const [dataL, setDataL] = useState(false);
    const { id } = useParams();
    const [allUser, setAllUser] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || []);
    const [token, setToken] = useStorage("user", {});
    const textAreaRef = useRef(null);
    const location = useLocation();

    const navigate = useNavigate();

    const productQuantity = yup.object({
        content: yup.string().required("Vui lòng nhập")
    })
    const clearTextArea = () => {
        if (textAreaRef.current) {
            textAreaRef.current.textArea.value = ''; // Xóa giá trị trong TextArea
        }
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
    const methods = useForm({
        resolver: yupResolver(productQuantity),
        defaultValues: {
            content: "",
        },
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    useEffect(() => {
        getData(`/artwork/${id}`)
            .then((product) => {
                setArtwork(product.data)

            })
            .catch((error) => {
                console.log(error);
            })
            
    }, [id, dataL]);

    useEffect(() => {
        if (artwork?.image) {
            setImage(artwork?.image.map(image => ({

                original: image,
                thumbnail: image,
                className: 'w-24 h-24',
            })
            ))
        }
    }, [artwork])


    const onSubmit = (data) => {
     
        clearTextArea()
        if (!user?._doc?.username) {
            return navigate('/login', { state: location.pathname })
        } else {
            postData(`/artwork/comments/${id}/${token._doc._id}`, { ...data, })
            .then((r) => {
                
                console.log(r);
            })
            .catch((error) => {
                console.log(error);
                
            });
        }
        setDataL(!dataL)
        setValue('content', '');
        return
    }

    const onChange = (e) => {
        if (e.target.value) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    };
    const getUserById = (array, userId) => {
        // Sử dụng find để tìm user với _id tương ứng
        const user = array.find(item => item._id === userId);
        return user;
    };

    return (
        <>
            {contextHolder}
            <ComHeader />
            <div className="bg-white">
                <div className="">
                    <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-8">

                        <div className='product' ><ComImage product={image} /></div>

                        <div className="mt-4 lg:row-span-3 lg:mt-0">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{getUserById(allUser, artwork?.user)?.name}</h3>
                            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", padding: '6px' }}>
                                {artwork?.content}
                            </pre>
                           <div className='h-44 overflow-auto'>
                                {artwork?.comments?.slice().reverse().map((comment, i) => (
                                    <div key={i}>
                                        <div className="px-2 py-1 flex items-center gap-2">
                                            <img className="inline-block h-8 w-8 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, comment?.user)?.avatar} alt="" /> <p className="text-xl">{getUserById(allUser, comment?.user)?.name}</p>
                                        </div>
    
                                        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", padding: '6px' }}>
                                            {comment.content}
                                        </pre>
                                    </div>
                                ))}
                           </div>
                            <FormProvider {...methods} >
                                <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
                                    <div className='flex items-center flex-col  gap-1'>
                                        <ComTextArea
                                            placeholder={"Bạn nghĩ gì?"}
                                            rows={4}
                                            showCount
                                            style={{
                                                resize: 'none',
                                            }}
                                            ref={textAreaRef}
                                            className="w-full"
                                            onChange={onChange}
                                            {...register("content")}
                                        />

                                        <ComButton
                                            disabled={disabled}
                                            htmlType="submit"
                                            type="primary"
                                        >
                                            Bình luận
                                        </ComButton>

                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                        <div className="py-10 lg:col-span-2 lg:col-start-1   lg:pb-16  lg:pt-6 ">
                            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                {artwork.description}
                            </pre>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}