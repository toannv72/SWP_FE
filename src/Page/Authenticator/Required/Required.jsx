import { useEffect, useState } from "react";
import { getData, postData } from "../../../api/api";
import { textApp } from "../../../TextContent/textApp";
import ComInput from "../../Components/ComInput/ComInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComUpImg from "../../Components/ComUpImg/ComUpImg";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import ComButton from "../../Components/ComButton/ComButton";

import ComTextArea from "../../Components/ComInput/ComTextArea";
import ComNumber from "../../Components/ComInput/ComNumber";
import { Select, notification } from "antd";
import ComSelect from "../../Components/ComInput/ComSelect";
import ComFooter from "../../Components/ComFooter/ComFooter";
import ComHeader from "../../Components/ComHeader/ComHeader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSocket } from "../../../App";
import axios from "axios";
import { useStorage } from "../../../hooks/useLocalStorage";
const options = [
  {
    label: "Tranh",
    value: "Tranh",
  },
  {
    label: "Trang trí",
    value: "Trang trí",
  },
  {
    label: "Nghệ thuật",
    value: "Nghệ thuật",
  },
];

export default function Required() {
  const socket= useSocket()
  const [disabled, setDisabled] = useState(false);
  const [image, setImages] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || []);
  const navigate = useNavigate();
  const [searchParams, setSearchParams]= useSearchParams()
  const [token, setToken] = useStorage("user", {});
  const [items, setCategory] = useState([]);
   const [selectedMaterials, setSelectedMaterials] = useState();
 console.log("🚀 ~ Required ~ items:", items)
  // useEffect(() => {
  //   getData("/category")
  //     .then((data) => {
  //       const categoriesWithKeys = data.data.map((category, index) => {
  //         return { label: category.label, key: index };
  //       });
  //       setCategory(categoriesWithKeys)
  //     })
  // }, []);
      const options = [];

      useEffect(() => {
        getData("/category").then((data) => {
          setCategory([...data.data, ...options]);
        });
      }, []);
  const CreateProductMessenger = yup.object({
    name: yup.string().required(textApp.Payment.information.message.name),
    bird: yup.string().required(textApp.Payment.information.message.name),
    
    email: yup
      .string()
      .email("Vui lòng nhập đúng định dạng gmail")
      .required("Vui lòng nhập gmail"),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
      .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
      .max(10, "Số điện thoại không được quá 10 chữ số")
      .required("Vui lòng nhập số điện thoại"),
    quantity: yup
      .number()
      .typeError("Số lượng không được để trống")
      .min(1, textApp.CreateProduct.message.quantityMin)
      .required("Số lượng không được để trống"),
    material: yup.array().required("Vui lòng nhập thể loại"),
    shippingAddress: yup.string().required("Vui lòng nhập địa chỉ giao hàng"),
    description: yup
      .string()
      .required(textApp.CreateProduct.message.description),
  });
  const createProductRequestDefault = {
    quantity: 1,
    email: token?._doc?.email,
    phone: token?._doc?.phone,
  };
  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      bird: "",
      material: "",
      image: "",
      spokes: 0,
      quantity: 1,
      shippingAddress: "",
      description: "",
      freelancer: searchParams.get("id"),
    },
    values: createProductRequestDefault,
  });
  const { handleSubmit, register, setFocus, watch, setValue } = methods;

  function isInteger(number) {
    return (
      typeof number === "number" &&
      isFinite(number) &&
      Math.floor(number) === number
    );
  }

  const onSubmit = (data) => {
    console.log(data);
    // console.log(data.reducedPrice % 1000 !== 0);
    // console.log(data.reducedPrice % 1000);

    if (data.material.length === 0) {
      api["error"]({
        message: textApp.CreateProduct.Notification.m4.message,
        description: textApp.CreateProduct.Notification.m4.description,
      });
      return;
    }
    if (image.length === 0) {
      api["error"]({
        message: textApp.CreateProduct.Notification.m5.message,
        description: textApp.CreateProduct.Notification.m5.description,
      });
      return;
    }
    setDisabled(true);
    firebaseImgs(image)
      .then((dataImg) => {
        console.log("ảnh nè : ", dataImg);
        const updatedData = {
          ...data, freelancer: searchParams.get("id"), // Giữ lại các trường dữ liệu hiện có trong data
          image: "" + dataImg,
        };
        console.log("updatedData: ", updatedData);
        postData("/customOrder/user", updatedData, {})
          .then((dataS) => {
            console.log("dataS: ", dataS);
            sendNotification("đã yêu cầu order", 3)
            setDisabled(false);
            api["success"]({
              message: textApp.CreateProduct.Notification.m9.message,
              description: textApp.CreateProduct.Notification.m9.description,
            });
            navigate(`/required/bill/${dataS._id}`);
          })
          .catch((error) => {
            api["error"]({
              message: textApp.CreateProduct.Notification.m3.message,
              description: textApp.CreateProduct.Notification.m3.description,
            });
            console.error("Error fetching items:", error);
            setDisabled(false);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendNotification = async (textType, type) => {
    socket.emit("push_notification", { artwork: {}, pusher: user._doc, author: searchParams.get("id"), textType, type })
    const res= await axios({
      url: "http://localhost:5000/api/notification",
      method: "post",
      data: {
          artwork: {}, pusher: user._doc, author: searchParams.get("id"), textType, type, link: window.location.href
      }
  })
}

  const onChange = (data) => {
    const selectedImages = data;
    // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
    const newImages = selectedImages.map((file) => file.originFileObj);
    // Cập nhật trạng thái 'image' bằng danh sách tệp mới
    setImages(newImages);
    console.log(image);
    // setFileList(data);
  };
  const handleValueChange = (e, value) => {
    setValue("price", value, { shouldValidate: true });
  };

  const handleValueChange1 = (e, value) => {
    console.log(value);
    setValue("reducedPrice", value, { shouldValidate: true });
  };

  const handleValueChangeSelect = (e, value) => {
    setSelectedMaterials(value);
    if (value.length === 0) {
      setValue("material", null, { shouldValidate: true });
    } else {
      setValue("material", value, { shouldValidate: true });
    }
  };
  return (
    <>
      {contextHolder}
      <ComHeader />
      <div className="flex justify-center flex-col py-5 text-center">
        {/* bird */}
        <div className="flex justify-center"></div>
        <h1 className="text-4xl">{"Đặt hàng theo yêu cầu"}</h1>
      </div>
      <div className="isolate bg-white px-6 py-10 sm:py-10 lg:px-8">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-4 max-w-xl sm:mt-8"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className="mt-2.5">
                  <ComInput
                    type="text"
                    label={"Người đặt hàng"}
                    placeholder={"Nhập tên người đặt hàng"}
                    {...register("name")}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="mt-2.5">
                  <ComInput
                    type="text"
                    label={"Tên sản phẩm"}
                    placeholder={"Nhập tên sản phẩm"}
                    {...register("bird")}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="mt-2.5">
                  <ComInput
                    type="text"
                    label={"Địa chỉ giao hàng"}
                    placeholder={"Nhập địa chỉ giao hàng"}
                    {...register("shippingAddress")}
                    required
                  />
                </div>
              </div>
              <div>
                <ComInput
                  type="text"
                  label={"Gmail"}
                  placeholder={"Nhập gmail"}
                  // type="numbers"
                  {...register("email")}
                  required
                />
              </div>
              <div>
                <ComInput
                  type="text"
                  label={"Phone"}
                  placeholder={"Nhập số điện thoại"}
                  // type="numbers"
                  {...register("phone")}
                  required
                />
              </div>
              <div>
                <ComNumber
                  label={"Số lượng"}
                  placeholder={"Nhập số lượng"}
                  // type="numbers"
                  min={1}
                  defaultValue={1}
                  {...register("quantity")}
                  required
                />
              </div>
              <div className="">
                <div class="mb-4 flex justify-between">
                  <label
                    for="7886e4ee-a1d8-4625-a73f-988b8f53fae5"
                    class="text-paragraph font-bold"
                  >
                    Thể loại
                    <span class="text-paragraph font-bold text-error-7 text-red-500">
                      *
                    </span>
                  </label>
                </div>
                <ComSelect
                  size={"large"}
                  style={{
                    width: "100%",
                  }}
                  label={textApp.CreateProduct.label.material}
                  placeholder={textApp.CreateProduct.placeholder.material}
                  required
                  onChangeValue={handleValueChangeSelect}
                  value={selectedMaterials}
                  options={items}
                  {...register("material")}
                />
              </div>
              {/* <div className="sm:col-span-2">
                <ComInput
                  label={textApp.CreateProduct.label.shape}
                  placeholder={textApp.CreateProduct.placeholder.shape}
                  required
                  type="text"
                  {...register("shape")}
                />
            
              </div> */}

              <div className="sm:col-span-2">
                <div className="mt-2.5">
                  <ComTextArea
                    label={textApp.CreateProduct.label.description}
                    placeholder={textApp.CreateProduct.placeholder.description}
                    rows={4}
                    defaultValue={""}
                    required
                    maxLength={1000}
                    {...register("description")}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-paragraph font-bold">
                  Hình ảnh minh hoạ
                  <span className="text-paragraph font-bold text-error-7 text-red-500">
                    *
                  </span>
                </label>
                <ComUpImg numberImg={1} onChange={onChange} multiple={false} />
              </div>
            </div>
            <div className="mt-10">
              <ComButton
                disabled={disabled}
                htmlType="submit"
                type="primary"
                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {"Yêu cầu đặt hàng"}
              </ComButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
