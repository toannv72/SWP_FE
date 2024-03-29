import React, { useState } from "react";
import { Button, Modal } from "antd";
import { Checkbox, Divider } from "antd";
import { Input } from "antd";
import { useSocket } from "../../../App";
import { useParams } from "react-router-dom";
import { postFeedback } from "../../../api/api";
import swal from "sweetalert";
import axios from "axios";
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  "Nội dung gây hiểu lầm hoặc không phù hợp.",
  "bài đăng này vi phạm quyền sở hữu trí tuệ.",
  "Nội dung chứa các liên kết hoặc mục đích độc hại",
];
const defaultCheckedList = [];
const ReportModal = (props) => {
  const { id } = useParams();
  const socket = useSocket();
  const { isModalOpen, setIsModalOpen, artwork, user } = props;
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [note, setNote] = useState("");
  const checkAll = plainOptions.length === checkedList.length;

  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;
  const onChange = (list) => {
    setCheckedList(list);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    sendNotification("đã report", 1);
    const result = await postFeedback("/feedback", {
      artwork: id,
      user: props?.artwork?.user,
      text: checkedList.concat(note).toString(),
      publisher: props?.user?._doc?._id,
      type: 1,
    });
    if (result?.duplicate === true) {
      swal("Thông báo", "Bạn chỉ được gửi report một lần cho một bài viết");
    } else {
      swal("Thông báo", "Gửi report thành công", "success");
    }
  };
  const sendNotification = async (textType, type) => {
    socket.emit("push_notification", {
      artwork: artwork,
      pusher: user._doc,
      author: artwork?.user,
      textType,
      type,
      link: window.location.href,
    });
    const res = await axios({
      url: "http://localhost:5000/api/notification",
      method: "post",
      data: {
        artwork: artwork,
        pusher: user._doc,
        author: artwork?.user,
        textType,
        type,
        link: window.location.href,
      },
    });
    const result = await res.data;
    console.log(result);
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Report artwork"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Gửi report
          </Button>,
        ]}
      >
        <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={onChange}
        />
        <Divider />
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Lý do khác"
          rows={4}
        />
        <Divider />
        <Button
          key="submit"
          type="primary"
          style={{ backgroundColor: "#1677ff" }}
          onClick={handleSubmit}
        >
          Gửi report
        </Button>
      </Modal>
    </>
  );
};

export default ReportModal;
