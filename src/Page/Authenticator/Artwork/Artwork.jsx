
import { useEffect, useRef, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import ComHeader from '../../Components/ComHeader/ComHeader'
import ComImage from '../../Components/ComImage/ComImage'
import { getData, postData } from '../../../api/api'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { textApp } from '../../../TextContent/textApp'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import ComNumber from '../../Components/ComInput/ComNumber'
import { Button, Dropdown, Input, Space, notification } from 'antd'
import ComTextArea from '../../Components/ComInput/ComTextArea'
import ComButton from '../../Components/ComButton/ComButton'
import TextArea from 'antd/es/input/TextArea'
import { useStorage } from '../../../hooks/useLocalStorage'
import {
    LikeOutlined,
    CommentOutlined
} from '@ant-design/icons';
import PageNotFound from '../404/PageNotFound'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { CalendarDays } from 'lucide-react'

export default function Artwork() {
    const [artwork, setArtwork] = useState([])
    const [image, setImage] = useState([])
    const [disabled, setDisabled] = useState(false);
    const [dataL, setDataL] = useState(false);
    const [like, setLike] = useState(false);
    const { id } = useParams();
    const [allUser, setAllUser] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || []);
    const [token, setToken] = useStorage("user", {});
    const textAreaRef = useRef(null);
    const location = useLocation();
    const [error, setError] = useState(false);

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
            .then((artwork) => {
                setArtwork(artwork.data)
                const userLikes = (artwork?.data?.likes || []).some(like => like.user === token?._doc?._id);
                setLike(userLikes)
            })
            .catch((error) => {
                setError(true)
                console.log(error);
            })

    }, [id, dataL, like]);

    const handleLike = (id_artwork, id_user) => {
        setLike(true);
        postData(`/artwork/likeArtwork/${id_artwork}/${id_user}`, {})
            .then((e) => {
            })
            .catch(err => {
                console.log(err);
            });

    };
    const handleUnLike = (id_artwork, id_user) => {
        setLike(false);

        postData(`/artwork/unlikeArtwork/${id_artwork}/${id_user}`, {})
            .then((e) => {
            })
            .catch(err => {
                console.log(err);
            });

    };
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
        if (!user?._doc?.username) {
            return navigate('/login', { state: location.pathname })
        } else {
            console.log(data);
            postData(`/artwork/comments/${id}/${token._doc._id}`, { ...data, })
                .then((r) => {
                    console.log(r);
                })
                .catch((error) => {
                    console.log(error);

                });
        }
        clearTextArea()
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
    console.log(artwork);
    if (error || !artwork) {
        return <PageNotFound />
    }
    const items = [
        {
            label: 'Báo cáo.',
            key: '1',
        },
        // {
        //     label: 'Đổi ảnh bìa',
        //     key: '2',
        // },
        // {
        //     label: 'Đổi mật khẩu',
        //     key: '3',
        // },

    ]
    const handleMenuClick = (e) => {
        console.log('click', e);
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
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
                            {/* <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{getUserById(allUser, artwork?.user)?.name}</h3> */}
                            <HoverCard>

                               <div className='flex justify-between'>
                                    <div className="px-2 py-1 flex items-center gap-2 w-auto">
                                        <HoverCardTrigger> <Link to={`/author/${artwork.user}`}><img className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, artwork.user)?.avatar} alt="" /></Link> </HoverCardTrigger>
                                        <HoverCardTrigger><Link to={`/author/${artwork.user}`} className="text-2xl">{getUserById(allUser, artwork.user)?.name}</Link></HoverCardTrigger>
                                    </div>
                                    <Dropdown trigger={['click']} menu={menuProps} >
    
                                        <button className="border border-gray-400 p-2 rounded text-gray-300 hover:text-gray-300 bg-gray-100 bg-opacity-10 hover:bg-opacity-20" title="Settings">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                            </svg>
                                        </button>
                                    </Dropdown>
                               </div>
                                <HoverCardContent className="relative transform  rounded-lg bg-slate-100 text-left shadow-xl transition-all p-2 z-50 ">
                                    <div className="flex justify-between space-x-4">
                                        <img className="inline-block h-12 w-12 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, artwork.user)?.avatar} alt="" />
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-semibold">{getUserById(allUser, artwork.user)?.name}</h4>
                                            <p className="text-sm">
                                                The React Framework – created and maintained by @vercel.
                                            </p>
                                            <div className="flex items-center pt-2">
                                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                                                <span className="text-xs text-muted-foreground">
                                                    {getUserById(allUser, artwork.user)?.createdAt}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>

                            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", padding: '6px' }}>
                                {artwork?.content}
                            </pre>
                            <div className='h-44 overflow-auto'>
                                {artwork?.comments?.slice().reverse().map((comment, i) => (
                                    <div key={i} className='bg-slate-200 m-2 rounded-lg'>
                                        {/* <div className="px-2 py-1 flex items-center gap-2">
                                            <img className="inline-block h-8 w-8 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, comment?.user)?.avatar} alt="" /> <p className="text-xl">{getUserById(allUser, comment?.user)?.name}</p>
                                        </div> */}
                                        <HoverCard>
                                            <div className="px-2 py-1 flex items-center gap-2 w-auto">
                                                <HoverCardTrigger> <Link to={`/author/${getUserById(allUser, comment?.user)?._id}`}><img className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, comment?.user)?.avatar} alt="" /></Link> </HoverCardTrigger>
                                                <HoverCardTrigger><Link to={`/author/${getUserById(allUser, comment?.user)?._id}`} className="text-2xl">{getUserById(allUser, comment?.user)?.name}</Link></HoverCardTrigger>
                                            </div>

                                            <HoverCardContent className="relative transform  rounded-lg bg-slate-100 text-left shadow-xl transition-all p-2 z-50 ">
                                                <div className="flex justify-between space-x-4">
                                                    <img className="inline-block h-12 w-12 object-cover rounded-full ring-2 ring-white" src={getUserById(allUser, comment?.user)?.avatar} alt="" />
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-semibold">{getUserById(allUser, comment?.user)?.name}</h4>
                                                        <p className="text-sm">
                                                            The React Framework – created and maintained by @vercel.
                                                        </p>
                                                        <div className="flex items-center pt-2">
                                                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                                                            <span className="text-xs text-muted-foreground">
                                                                {getUserById(allUser, artwork.user)?.createdAt}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", padding: '6px', marginLeft: 10 }}>
                                            {comment.content}
                                        </pre>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-around mb-1 p-1 gap-10 mt-2 ">
                                <p>{artwork?.likes?.length} Đã thích</p>
                                <p>{artwork?.comments?.length} Bình luận</p>
                            </div>
                            <button
                                onClick={() => { !like ? handleLike(artwork._id, token?._doc?._id) : handleUnLike(artwork._id, token?._doc?._id) }}
                                className={`flex gap-2 w-1/2  items-center  h-8  justify-center rounded-lg hover:bg-[#f1f0f0] ${like ? 'text-[#08c]' : ''}`}
                            >
                                {like ? <LikeOutlined style={{ fontSize: '20px' }} /> : <LikeOutlined style={{ fontSize: '20px', }} />}
                                <p style={like ? { color: '#08c' } : {}}>{like ? 'Đã thích' : 'Thích'}</p>
                            </button>
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
                                {artwork?.description}
                            </pre>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}
