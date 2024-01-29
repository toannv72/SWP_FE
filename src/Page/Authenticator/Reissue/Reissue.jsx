
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import ComInput from "../../Components/ComInput/ComInput";
import ComButton from "../../Components/ComButton/ComButton";
import { textApp } from "../../../TextContent/textApp";
import { ComLink } from "../../Components/ComLink/ComLink";
import { routs } from "../../../constants/ROUT";
import { useStorage } from "../../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { postData } from "../../../api/api";
import ComHeader from "../../Components/ComHeader/ComHeader";
import ComFooter from "../../Components/ComFooter/ComFooter";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";



export default function Reissue() {

    const [error, setError] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();



    const loginMessenger = yup.object({
        // code: yup.string().required(textApp.Reissue.message.username).min(5, "Username must be at least 5 characters"),
        username: yup.string().required(textApp.Reissue.message.username).min(6, textApp.Reissue.message.usernameMIn),
        phone: yup.string().required(textApp.Reissue.message.phone).min(10, "Số điện thoại phải lớn hơn 9 số!").max(10, "Số điện thoại phải nhỏ hơn 11 số!").matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
        // .matches(/^[0-9]+$/, 'Số điện thoại phải chứa chỉ số'),
        password: yup.string().required(textApp.Reissue.message.password).min(5, textApp.Reissue.message.passwordMIn),
        password2: yup.string().required(textApp.Reissue.message.password2).min(5, textApp.Reissue.message.passwordMIn),
        email: yup.string().email(textApp.Reissue.message.emailFormat).required(textApp.Reissue.message.email),
    })
    const LoginRequestDefault = {
        // code: "",
        password: "",
        phone: "",
        username: "",
        email: "",

    };
    const methods = useForm({
        resolver: yupResolver(loginMessenger),
        defaultValues: {
            // code: "",
            username: "",
            phone: "",
            password: "",
            email: "",
        },
        values: LoginRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods
    const onSubmit = (data) => {
        if (data.password2 !== data.password) {

            return setError(textApp.Reissue.message.passwordCheck)
        }
        setDisabled(true)
        setError("")
        postData('/reg', data, {})
            .then((data) => {
                api["success"]({
                    message: 'Thành công!',
                    description:
                        "Đăng ký tài khoản thành công"
                });
                setDisabled(false)
                setTimeout(() => {
                    return navigate('/login')
                }, 3000);
            })
            .catch((error) => {
                setError(error?.response?.data?.error)
                if (error?.response?.data?.keyValue?.email) {
                    setError('Tài khoản mail này đã có người sửa dụng')
                }

                if (error?.response?.data?.keyValue?.phone) {
                    setError('Số điện thoại này đã có người sửa dụng')
                }
                console.error("Error fetching items:", error);
                setDisabled(false)
            });

    }

    console.log(disabled);
    return (
        <>
            {contextHolder}

            <ComHeader />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        {textApp.Reissue.pageTitle}
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <FormProvider {...methods} >
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

                            <ComInput
                                placeholder={textApp.Reissue.placeholder.username}
                                label={textApp.Reissue.label.username}
                                type="text"
                                // search
                                maxLength={26}
                                onchange={() => { setError("") }}
                                {...register("username")}
                                required
                            />

                            <ComInput
                                placeholder={textApp.Reissue.placeholder.phone}
                                label={textApp.Reissue.label.phone}
                                type="numbers"
                                maxLength={16}
                                {...register("phone")}
                                required
                            />
                            <ComInput
                                placeholder={textApp.Reissue.placeholder.email}
                                label={textApp.Reissue.label.email}
                                type="text"
                                {...register("email")}
                                required
                            />
                            <ComInput
                                placeholder={textApp.Reissue.placeholder.password}
                                label={textApp.Reissue.label.password}
                                type="password"
                                maxLength={26}
                                {...register("password")}
                                required
                            />
                            <ComInput
                                placeholder={textApp.Reissue.placeholder.password2}
                                label={textApp.Reissue.label.password2}
                                type="password"
                                maxLength={26}
                                {...register("password2")}
                                required
                            />
                            <h1 className="text-red-500">{error}</h1>
                            <ComButton
                                disabled={disabled}
                                htmlType="submit"
                                type="primary"
                            >
                                {textApp.Reissue.pageTitle}
                            </ComButton>


                        </form>
                    </FormProvider>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Chưa có tài khoản?{' '}
                        <ComLink to={routs["/login"].link} >
                            <>{routs["/login"].name}</>
                        </ComLink>
                    </p>
                </div>
            </div>
            <ComFooter />

        </>
    )

}

