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
import { useParseUrl } from "./../../../hooks/use-parse-url";

export default function ChangePassword({ handleCancel3 }) {
  const { search } = useParseUrl();
  const [token, setToken] = useStorage("user", {});
  const [disabled, setDisabled] = useState(false);
  const [Login, setLogin] = useState(false);
  const [LoginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

  const loginMessenger = yup.object({
    email: yup.string().email("định dạng sai").required("required email"),
    password: yup.string().required(textApp.Login.message.password),
    oldPassword: yup.string().required(textApp.Login.message.password),
  });

  const LoginRequestDefault = {
    email: "",
    password: "",
    oldPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(loginMessenger),
    defaultValues: {
      email: "",
      password: "",
      oldPassword: "",
    },
    values: LoginRequestDefault,
  });
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  const changePassword = (resetInfo) => {
    return fetch(`http://localhost:5000/api/user/change-password`, {
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
    await changePassword({
      email: data.email,
      oldPassword: data.oldPassword,
      password: data.password,
    }).then((data) => {
      if (data.error) {
        api["error"]({
          message: "thất bại",
          description: data.error,
        });
      } else {
        handleCancel3();
        api["success"]({
          message: "thành công",
          description: data.message,
        });
      }
    });
  };

  return (
    <>
      {contextHolder}
      <FormProvider {...methods}>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <ComInput
            placeholder={textApp.Reissue.placeholder.email}
            label={textApp.Reissue.label.email}
            type="text"
            {...register("email")}
            required
          />
          <ComInput
            placeholder="nhập mật khẩu củ"
            label="mật khẩu củ"
            type="password"
            maxLength={16}
            {...register("oldPassword")}
            required
          />
          <ComInput
            placeholder="nhập mật khẩu mới"
            label="mật khẩu mới"
            type="password"
            maxLength={26}
            {...register("password")}
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
    </>
  );
}
