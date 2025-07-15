import { Modal, Form, Input, message, notification } from "antd";
import { useEffect, useState } from "react";
import { callUpdateUser } from "../../../services/api";

const UserModalUpdate = (props) => {
  const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } =
    props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        fullName: dataUpdate.fullName,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
      });
      console.log(dataUpdate);
    }
  }, [dataUpdate]);

  const onFinish = async (values) => {
    const id = dataUpdate._id;
    const { fullName, phone } = values;
    setIsSubmit(true);

    const res = await callUpdateUser(id, fullName, phone);

    setTimeout(async () => {
      if (res && res.data) {
        message.success("Cập nhật người dùng thành công!");
        form.resetFields();
        setOpenModalUpdate(false);
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

  const handleCancel = () => {
    form.resetFields();
    setDataUpdate(null);
    setOpenModalUpdate(false);
  };

  return (
    <>
      <div>
        <Modal
          title="Cập nhật người dùng"
          closable={{ "aria-label": "Custom Close Button" }}
          open={openModalUpdate}
          onOk={() => form.submit()}
          onCancel={handleCancel}
          okText="Cập nhật"
          cancelText="Hủy"
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
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input readOnly disabled />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Tên hiển thị"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên hiển thị!" },
              ]}
              className="mt-4"
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
      </div>
    </>
  );
};

export default UserModalUpdate;
