import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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
import backgroundImage from "../../../assets/img/curved-images/curved14.jpg";
export default function Reissue() {
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const loginMessenger = yup.object({
    // code: yup.string().required(textApp.Reissue.message.username).min(5, "Username must be at least 5 characters"),
    username: yup
      .string()
      .required(textApp.Reissue.message.username)
      .min(6, textApp.Reissue.message.usernameMIn),
    phone: yup
      .string()
      .required(textApp.Reissue.message.phone)
      .min(10, "Số điện thoại phải lớn hơn 9 số!")
      .max(10, "Số điện thoại phải nhỏ hơn 11 số!")
      .matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    // .matches(/^[0-9]+$/, 'Số điện thoại phải chứa chỉ số'),
    password: yup
      .string()
      .required(textApp.Reissue.message.password)
      .min(5, textApp.Reissue.message.passwordMIn),
    password2: yup
      .string()
      .required(textApp.Reissue.message.password2)
      .min(5, textApp.Reissue.message.passwordMIn),
    email: yup
      .string()
      .email(textApp.Reissue.message.emailFormat)
      .required(textApp.Reissue.message.email),
  });
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
    values: LoginRequestDefault,
  });
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  const onSubmit = (data) => {
    if (data.password2 !== data.password) {
      return setError(textApp.Reissue.message.passwordCheck);
    }
    setDisabled(true);
    setError("");
    postData("/reg", data, {})
      .then((data) => {
        api["success"]({
          message: "Thành công!",
          description: "Đăng ký tài khoản thành công",
        });
        setDisabled(false);
        setTimeout(() => {
          return navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        setError(error?.response?.data?.error);
        if (error?.response?.data?.keyValue?.email) {
          setError("Tài khoản mail này đã có người sửa dụng");
        }

        if (error?.response?.data?.keyValue?.phone) {
          setError("Số điện thoại này đã có người sửa dụng");
        }
        console.error("Error fetching items:", error);
        setDisabled(false);
      });
  };

  console.log(disabled);
  return (
    <>
      {contextHolder}

      <ComHeader />
      <main className="mt-0 transition-all duration-200 ease-soft-in-out">
        <section className="min-h-screen mb-32">
          <div
            className="relative flex items-start pt-12 pb-56 m-4 overflow-hidden bg-center bg-cover min-h-50-screen rounded-xl"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          >
            <span className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-gray-900 to-slate-800 opacity-60" />
            <div className="container z-10">
              <div className="flex flex-wrap justify-center -mx-3">
                <div className="w-full max-w-full px-3 mx-auto mt-0 text-center lg:flex-0 shrink-0 lg:w-5/12">
                  <h1 className="mt-12 mb-2 text-white">Welcome!</h1>
                  <h3 className="text-white">{textApp.Reissue.pageTitle}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="flex flex-wrap -mx-3 -mt-48 md:-mt-56 lg:-mt-48">
              <div className="w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
                <div className="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
                  <div className="flex-auto p-6">
                    <FormProvider {...methods}>
                      <form
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <ComInput
                          placeholder={textApp.Reissue.placeholder.username}
                          label={textApp.Reissue.label.username}
                          type="text"
                          // search
                          maxLength={26}
                          onchange={() => {
                            setError("");
                          }}
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
                          className="inline-block w-full px-6 py-3 mt-6 mb-2 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-gray-900 to-slate-800 hover:border-slate-700 hover:bg-slate-700 hover:text-white"
                          disabled={disabled}
                          htmlType="submit"
                          type="primary"
                        >
                          {textApp.Reissue.pageTitle}
                        </ComButton>
                      </form>
                    </FormProvider>
                    <p className="mt-10 text-center text-sm text-gray-500">
                      Chưa có tài khoản?{" "}
                      <ComLink
                        className="font-bold text-slate-700"
                        to={routs["/login"].link}
                      >
                        <>{routs["/login"].name}</>
                      </ComLink>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ComFooter />
    </>
  );
}
