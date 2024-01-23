
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import { Select, notification } from 'antd'
import { textApp } from '../../../TextContent/textApp';
import { useState } from 'react';
import { firebaseImgs } from '../../../upImgFirebase/firebaseImgs';
import ComNumber from '../../Components/ComInput/ComNumber';
import ComInput from '../../Components/ComInput/ComInput';
import ComHeader from '../../Components/ComHeader/ComHeader';
import { postData } from '../../../api/api';
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

export default function CreateProduct({ onCancel }) {
    const [disabled, setDisabled] = useState(false);
    const [image, setImages] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [token, setToken] = useStorage("user", {});


    const CreateProductMessenger = yup.object({
        name: yup.string().required(textApp.CreateProduct.message.name),
        // price: yup.number().min(1, textApp.CreateProduct.message.priceMin).typeError(textApp.CreateProduct.message.price),
        price1: yup.string().required(textApp.CreateProduct.message.price).min(1, textApp.CreateProduct.message.priceMin).test('no-dots', textApp.CreateProduct.message.priceDecimal, value => !value.includes('.')),
        quantity: yup.number().min(1, textApp.CreateProduct.message.quantityMin).typeError(textApp.CreateProduct.message.quantity).required('Số lượng không được để trống'),
        // shape: yup.string().required(textApp.CreateProduct.message.shape),
        genre: yup.array().required("Vui lòng nhập thể loại"),
        description: yup.string().required(textApp.CreateProduct.message.description),
    })
    const createProductRequestDefault = {
        price: 1000,
        reducedPrice: 1000,
    };
    const methods = useForm({
        resolver: yupResolver(CreateProductMessenger),
        defaultValues: {
            name: "",
            quantity: 1,
            models: "",
            shape: "",
            genre: [],
            accessory: "",
            image: [],
            description: "",
        },
        values: createProductRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    function isInteger(number) {
        return typeof number === 'number' && isFinite(number) && Math.floor(number) === number;
    }
    const onSubmit = (data) => {

        if (data.price % 1000 !== 0) {
            api["error"]({
                message: textApp.CreateProduct.Notification.m7.message,
                description:
                    textApp.CreateProduct.Notification.m7.description
            });
            return
        }

        if (!isInteger(data.price)) {

            api["error"]({
                message: textApp.CreateProduct.Notification.m1.message,
                description:
                    textApp.CreateProduct.Notification.m1.description
            });
            return
        }

        if (data.genre.length === 0) {
            api["error"]({
                message: textApp.CreateProduct.Notification.m4.message,
                description:
                    textApp.CreateProduct.Notification.m4.description
            });
            return
        }
        if (image.length === 0) {
            api["error"]({
                message: textApp.CreateProduct.Notification.m5.message,
                description:
                    textApp.CreateProduct.Notification.m5.description
            });
            return
        }

        setDisabled(true)
        firebaseImgs(image)
            .then((dataImg) => {
                const updatedData = {
                    ...data, // Giữ lại các trường dữ liệu hiện có trong data
                    image: dataImg, // Thêm trường images chứa đường dẫn ảnh

                };

                postData('/product', { ...updatedData, user: token._doc._id }, {})
                    .then((dataS) => {
                        setDisabled(false)
                        api["success"]({
                            message: textApp.CreateProduct.Notification.m2.message,
                            description:
                                textApp.CreateProduct.Notification.m2.description
                        });
                        onCancel()
                    })
                    .catch((error) => {
                        api["error"]({
                            message: textApp.CreateProduct.Notification.m3.message,
                            description:
                                textApp.CreateProduct.Notification.m3.description
                        });
                        console.error("Error fetching items:", error);
                        setDisabled(false)
                        onCancel()

                    });
            })
            .catch((error) => {
                console.log(error)
            });


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

    const handleValueChange1 = (e, value) => {
        console.log(value);
        setValue("reducedPrice", value, { shouldValidate: true });
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
                        {textApp.CreateProduct.pageTitle}
                    </h2>

                </div>
                <FormProvider {...methods} >
                    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-4 max-w-xl sm:mt-8">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <div className="mt-2.5">
                                    <ComInput
                                        type="text"
                                        label={textApp.CreateProduct.label.name}
                                        placeholder={textApp.CreateProduct.placeholder.name}
                                        {...register("name")}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <ComNumber
                                    label={textApp.CreateProduct.label.price}
                                    placeholder={textApp.CreateProduct.placeholder.price}
                                    // type="money"
                                    defaultValue={1000}
                                    min={1000}
                                    money
                                    onChangeValue={handleValueChange}
                                    {...register("price1")}
                                    required
                                />

                            </div>

                            <div>
                                <ComNumber
                                    label={textApp.CreateProduct.label.quantity}
                                    placeholder={textApp.CreateProduct.placeholder.quantity}
                                    // type="numbers"
                                    min={1}
                                    defaultValue={1}
                                    {...register("quantity")}
                                    required
                                />

                            </div>


                            <div className="sm:col-span-2">
                                <ComSelect
                                    size={"large"}
                                    style={{
                                        width: '100%',
                                    }}
                                    mode="tags"
                                    label="Thể loại"
                                    placeholder="Thể loại"
                                    required
                                    onChangeValue={handleValueChangeSelect}
                                    options={options}
                                    {...register("genre")}

                                />
                            </div>



                            <div className="sm:col-span-2">

                                <div className="mt-2.5">

                                    <ComTextArea
                                        label={textApp.CreateProduct.label.description}
                                        placeholder={textApp.CreateProduct.placeholder.description}
                                        rows={4}
                                        defaultValue={''}
                                        required
                                        maxLength={1000}
                                        {...register("description")}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-paragraph font-bold">
                                    Hình ảnh
                                    <span className="text-paragraph font-bold text-error-7 text-red-500">
                                        *
                                    </span>

                                </label>
                                <ComUpImg onChange={onChange} />
                            </div>
                        </div>
                        <div className="mt-10">
                            <ComButton

                                disabled={disabled}
                                htmlType="submit"
                                type="primary"
                                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {textApp.common.button.createProduct}
                            </ComButton>
                        </div>
                    </form>
                </FormProvider>

            </div>
        </>
    )
}
