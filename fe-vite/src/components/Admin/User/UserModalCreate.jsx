import {
  Button,
  Modal,
  Checkbox,
  Form,
  Input,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { callCreateUser } from "../../../services/api";

const UserModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { fullName, password, email, phone } = values;
    setIsSubmit(true);

    const res = await callCreateUser(fullName, password, email, phone);

    //dalay 2 second
    setTimeout(async () => {
      if (res && res.data) {
        message.success("Tạo người dùng thành công!");
        form.resetFields();
        setOpenModalCreate(false);
        await props.fetchUser();
      } else {
        notification.error({
          message: "Thông báo",
          description: res.message,
        });
      }
      setIsSubmit(false);
    }, 2000);
  };

  return (
    <>
      <Modal
        title={
          <h2 style={{ fontSize: "22px", margin: 0 }}>Thêm mới người dùng</h2>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        okText="Lưu"
        cancelText="Hủy"
        onCancel={() => setOpenModalCreate(false)}
        confirmLoading={isSubmit}
      >
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{ span: 24 }}
            label="Tên hiển thị"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
            className="mt-4"
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserModalCreate;
