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
import { putData } from "../../../api/api";
import ComHeader from "../../Components/ComHeader/ComHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { FieldError } from "../../Components/FieldError/FieldError";
import { useCookies } from "react-cookie";
import ComFooter from "../../Components/ComFooter/ComFooter";
import { notification } from "antd";
import { useParseUrl } from './../../../hooks/use-parse-url';

export default function ResetPassword() {
    const { search } = useParseUrl();
  const [token, setToken] = useStorage("user", {});
  const [disabled, setDisabled] = useState(false);
  const [Login, setLogin] = useState(false);
  const [LoginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

const loginMessenger = yup.object({
  password: yup.string().required(textApp.Login.message.password),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const LoginRequestDefault = {
  password: "",
  confirmPassword: "",
};

const methods = useForm({
  resolver: yupResolver(loginMessenger),
  defaultValues: {
    password: "",
    confirmPassword: "",
  },
  values: LoginRequestDefault,
});
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  const resetPassword = (resetInfo) => {
    return fetch(`http://localhost:5000/api/user/reset-password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resetInfo),
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  };

  const onSubmit = async (data) => {
    await resetPassword({
      newPassword: data.password,
      resetPasswordLink: search.token,
    }).then((data) => {
      if (data.error) {
        api["error"]({
          message: "thất bại",
          description: data.error,
        });
      } else {
        navigate("/login");
        api["success"]({
          message: "thành công",
          description: data.message,
        });
      }
    });
  };

  return (
    <>
      <ComHeader />
      {contextHolder}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sửa mật khuẩn
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <ComInput
                placeholder="nhập mật khẩu mới"
                label="mật khẩu mới"
                type="password"
                maxLength={16}
                {...register("password")}
                required
              />
              <ComInput
                placeholder="nhập lại mật khẩu mới"
                label="xác thực mật khẩu"
                type="password"
                maxLength={16}
                {...register("confirmPassword")}
                required
              />
              <FieldError className="text-red-500 text-center">
                {Login ? textApp.Login.message.error : ""}
              </FieldError>
              <FieldError className="text-red-500 text-center">
                {LoginError ? textApp.Login.message.error1 : ""}
              </FieldError>

              <ComButton disabled={disabled} htmlType="submit" type="primary">
                Sửa mật khẩu
              </ComButton>
            </form>
          </FormProvider>

          <p className="mt-10 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <ComLink to={routs["/login"].link}>
              <>{routs["/login"].name}</>
            </ComLink>
          </p>
        </div>
      </div>
      <ComFooter />
    </>
  );
}
