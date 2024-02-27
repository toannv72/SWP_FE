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
import { useLocation, useNavigate } from "react-router-dom";
import { FieldError } from "../../Components/FieldError/FieldError";
import { useCookies } from "react-cookie";
import ComFooter from "../../Components/ComFooter/ComFooter";
import { notification } from "antd";
import backgroundImage from "../../../assets/img/curved-images/curved6.jpg";
export default function Login() {
  const [token, setToken] = useStorage("user", {});
  const [disabled, setDisabled] = useState(false);
  const [Login, setLogin] = useState(false);
  const [LoginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

  const loginMessenger = yup.object({
    // code: yup.string().required(textApp.Login.message.username).min(5, "Username must be at least 5 characters"),
    username: yup.string().required(textApp.Login.message.username),
    password: yup.string().required(textApp.Login.message.password),
    // email: yup.string().email('định dạng sai').required('Login ID is required email'),
  });
  const LoginRequestDefault = {
    // code: "",
    password: "",
    username: "",
    // email: "",
  };
  const methods = useForm({
    resolver: yupResolver(loginMessenger),
    defaultValues: {
      // code: "",
      username: "",
      password: "",
      // email: "",
    },
    values: LoginRequestDefault,
  });
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  const onSubmit = (data) => {
    setLoginError(false);

    setLogin(false);
    setDisabled(true);
    postData("/login", data, {})
      .then((data) => {
        console.log(data);
        localStorage.setItem("user", JSON.stringify(data));
        setToken(data);
        setDisabled(false);
        // navigate('/')
        if (location?.state) {
          return navigate(location?.state);
        }
        if (data._doc.role === "user") {
          return navigate("/");
        }
        if (data._doc.role === "staff") {
          return navigate("/staff/product/table");
        }
        if (data._doc.role === "manager") {
          return navigate("/manager/dashboard");
        }
        if (data._doc.role === "admin") {
          return navigate("/admin/tableUser");
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setDisabled(false);
        if (error?.response?.status === 401) {
          setLogin(true);
        } else {
          setLoginError(true);
        }
      });
  };

  return (
    <>
      <ComHeader />
      {contextHolder}
      <main className="mt-0 transition-all duration-200 ease-soft-in-out">
        <section>
          <div className="relative flex items-center p-0 overflow-hidden bg-center bg-cover min-h-75-screen">
            <div className="container z-10">
              <div className="flex flex-wrap mt-0 -mx-3">
                <div className="flex flex-col w-full max-w-full px-3 mx-auto md:flex-0 shrink-0 md:w-6/12 lg:w-5/12 xl:w-4/12">
                  <div className="relative flex flex-col min-w-0 mt-32 break-words bg-transparent border-0 shadow-none rounded-2xl bg-clip-border">
                    <div className="p-6 pb-0 mb-0 bg-transparent border-b-0 rounded-t-2xl">
                      <h3 className="relative z-10 font-bold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text">
                        Welcome back
                      </h3>
                      <p className="mb-0">
                        Enter your username and password to sign in
                      </p>
                    </div>
                    <div className="flex-auto p-6">
                      <FormProvider {...methods}>
                        <form
                          className="flex flex-col gap-6"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <ComInput
                            placeholder={textApp.Login.placeholder.username}
                            label={textApp.Login.label.username}
                            type="text"
                            // search
                            maxLength={15}
                            {...register("username")}
                            required
                          />
                          <ComInput
                            placeholder={textApp.Login.placeholder.password}
                            label={textApp.Login.label.password}
                            type="password"
                            maxLength={16}
                            {...register("password")}
                            required
                          />
                          <FieldError className="text-red-500 text-center">
                            {Login ? textApp.Login.message.error : ""}
                          </FieldError>
                          <FieldError className="text-red-500 text-center">
                            {LoginError ? textApp.Login.message.error1 : ""}
                          </FieldError>
                          <ComButton
                            className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer shadow-soft-md bg-x-25 bg-150 leading-pro text-xs ease-soft-in tracking-tight-soft bg-gradient-to-tl from-blue-600 to-cyan-400 hover:scale-102 hover:shadow-soft-xs active:opacity-85"
                            disabled={disabled}
                            htmlType="submit"
                            type="primary"
                          >
                            {textApp.Login.pageTitle}
                          </ComButton>

                          {/* <ComButton
                                htmlType="submit"
                                type="primary"
                                className="bg-black hover:bg-white"
                            >
                                cancel
                            </ComButton> */}
                        </form>
                      </FormProvider>
                    </div>
                    <div className="p-6 px-1 pt-0 text-center bg-transparent border-t-0 border-t-solid rounded-b-2xl lg:px-2">
                      <p className=" text-center text-sm text-gray-500">
                        Chưa có tài khoản?{" "}
                        <ComLink
                          className="relative z-10 font-semibold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text"
                          to={routs["/reissue"].link}
                        >
                          <>{routs["/reissue"].name}</>
                        </ComLink>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-full px-3 lg:flex-0 shrink-0 md:w-6/12">
                  <div className="absolute top-0 hidden w-3/5 h-full -mr-32 overflow-hidden -skew-x-10 -right-40 rounded-bl-xl md:block">
                    <div
                      className="absolute inset-x-0 top-0 z-0 h-full -ml-16 bg-cover skew-x-10"
                      style={{
                        backgroundImage: `url(${backgroundImage})`,
                      }}
                    />
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
