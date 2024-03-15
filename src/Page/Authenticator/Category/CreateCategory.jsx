
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import { Select, notification } from 'antd'
import { textApp } from '../../../TextContent/textApp';
import { useEffect, useState } from 'react';
import { firebaseImgs } from '../../../upImgFirebase/firebaseImgs';
import ComNumber from '../../Components/ComInput/ComNumber';
import ComInput from '../../Components/ComInput/ComInput';
import ComHeader from '../../Components/ComHeader/ComHeader';
import { getData, postData } from '../../../api/api';
import ComSelect from '../../Components/ComInput/ComSelect';
import ComTextArea from '../../Components/ComInput/ComTextArea';
import ComButton from '../../Components/ComButton/ComButton';
import ComUpImg from '../../Components/ComUpImg/ComUpImg';
import { useStorage } from '../../../hooks/useLocalStorage';


const options = [
    {
        label: "Tranh",
        value: "Tranh"
    },
    {
        label: "Trang trí",
        value: "Trang trí"
    },
    {
        label: "Nghệ thuật",
        value: "Nghệ thuật"
    },
];

export default function CreateCategory({ onCancel }) {
    const [disabled, setDisabled] = useState(false);
    const [image, setImages] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [token, setToken] = useStorage("user", {});

    const [category, setCategory] = useState([]);
    useEffect(() => {
        getData("/category")
            .then((data) => {
                setCategory(data.data)
            })
    }, []);
    console.log('====================================');
    console.log(category);
    console.log('====================================');
    const CreateProductMessenger = yup.object({
        value: yup.string().required("Thể loại không được để trống"),

    })
    const createProductRequestDefault = {
        price: 1000,
        reducedPrice: 1000,
    };
    const methods = useForm({
        resolver: yupResolver(CreateProductMessenger),
        defaultValues: {
            value: "",

        },
        values: createProductRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    function isInteger(number) {
        return typeof number === 'number' && isFinite(number) && Math.floor(number) === number;
    }
    const onSubmit = (data) => {
        // category
        setDisabled(true)

        const isDuplicate = category.some((product, i) => product.value === data.value);
        if (!isDuplicate) {
            postData('/category', {
                "label": data.value,
                "value": data.value
            }, {})
                .then((dataS) => {
                    setDisabled(false)
                    api["success"]({
                        message: textApp.CreateProduct.Notification.m2.message,
                        description:
                            "Tạo thể loại thành công"
                    });
                    onCancel()
                })
                .catch((error) => {
                    api["error"]({
                        message: textApp.CreateProduct.Notification.m3.message,
                        description:
                            "Tạo thể loại không thành công!"
                    });
                    console.error("Error fetching items:", error);
                    setDisabled(false)
                    onCancel()

                })
        } else {
        setDisabled(false)
            api["error"]({
                message: textApp.TableProduct.Notification.updateFail.message,
                description:
                    "Đã có thể loại này rồi"
            });
        }


    }


    const onChange = (data) => {
        const selectedImages = data;
        // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
        const newImages = selectedImages.map((file) => file.originFileObj);
        // Cập nhật trạng thái 'image' bằng danh sách tệp mới
        setImages(newImages);
        console.log(image);
        // setFileList(data);
    }
    const handleValueChange = (e, value) => {

        setValue("price", value, { shouldValidate: true });
    };


    const handleValueChangeSelect = (e, value) => {
        if (value.length === 0) {
            setValue("genre", null, { shouldValidate: true });
        } else {
            setValue("genre", value, { shouldValidate: true });
        }
    };
    return (
        <>
            {contextHolder}
            <div className="isolate bg-white px-6 py-10 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Thêm thể loại
                    </h2>
                </div>
                <FormProvider {...methods} >
                    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-4 max-w-xl sm:mt-8">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <div className="mt-2.5">
                                    <ComInput
                                        type="text"
                                        label={"Tên thể loại"}
                                        placeholder={"Vui lòng nhập thể loại"}
                                        {...register("value")}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <ComButton

                                disabled={disabled}
                                htmlType="submit"
                                type="primary"
                                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Tạo thể loại
                            </ComButton>
                        </div>
                    </form>
                </FormProvider>

            </div>
        </>
    )
}
