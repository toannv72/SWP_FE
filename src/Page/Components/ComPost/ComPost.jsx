
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import ComInput from "../ComInput/ComInput";

import ComUpImg from "../ComUpImg/ComUpImg";
import ComTextArea from "../ComInput/ComTextArea";
import { Input, Modal } from "antd";
import { useEffect, useState } from "react";
import ComButton from "../ComButton/ComButton";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import { postData } from "../../../api/api";
import { useStorage } from "../../../hooks/useLocalStorage";


export default function ComPost({ }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [image, setImages] = useState([]);
    const [token, setToken] = useStorage("user", {});

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleOpen = () => {
        setIsModalOpen(true);
    };
    const methods = useForm({
        defaultValues: {
            content: "",
        },

    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods
    const onSubmit = (data) => {
        firebaseImgs(image)
            .then((img) => {
                postData("/artwork", { ...data, user: token._doc._id, image: img })
                    .then((r) => {

                        console.log(r);
                    })
                    .catch((error) => {
                        console.log(error);

                    });


            });
        console.log(data,);


    }
    const onChange = (data) => {
        const selectedImages = data;
        // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
        const newImages = selectedImages.map((file) => file.originFileObj);
        // Cập nhật trạng thái 'image' bằng danh sách tệp mới
        setImages(newImages);
        // setFileList(data);
    }

    useEffect(() => {
        if (image.length > 0) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [image]);
    return (
        <>
            <div className="flex justify-center  p-2 ">
                <div className="flex w-screen p-2 gap-2 bg-[#f3f9f140] sm:w-[600px] lg:w-[900px] xl:w-[1000px] xl:gap-x-8 shadow-md rounded-lg border-solid border-2 border-[#89898936]">  
                <img alt=""    className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white " src={token?._doc?.avatar}/>
                <Input placeholder="Đăng tải lên " onClick={handleOpen} readonly="readonly" />
                
                </div>
            </div>
            <Modal title='Đăng bài viết!'
                okType="primary text-black border-gray-700"
                open={isModalOpen}
                width={800}
                style={{ top: 20 }}
                onCancel={handleCancel}>
                <div className="flex justify-center ">
                    <FormProvider {...methods} >
                        <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit(onSubmit)}>
                            <ComTextArea
                                placeholder={"Bạn nghĩ gì?"}
                                rows={6}
                                {...register("content")}
                            />
                            <ComUpImg onChange={onChange} />
                            <ComButton
                                disabled={disabled}
                                htmlType="submit"
                                type="primary"
                            >
                                Đăng
                            </ComButton>
                        </form>
                    </FormProvider>
                </div>
            </Modal>
        </>
    )

}

