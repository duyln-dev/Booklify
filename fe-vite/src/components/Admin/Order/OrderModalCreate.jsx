import { Button, Modal, Form, Input, message, notification } from "antd";
import { useState } from "react";
import { callCreateOrder } from "../../../services/api"; // Giả sử bạn đã có API này

const OrderModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate, fetchOrders } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { customerName, phone, address, product } = values;
    setIsSubmit(true);

    const res = await callCreateOrder(customerName, phone, address, product);

    setTimeout(async () => {
      if (res && res.data) {
        message.success("Tạo đơn hàng thành công!");
        form.resetFields();
        setOpenModalCreate(false);
        if (fetchOrders) await fetchOrders();
      } else {
        notification.error({
          message: "Thông báo",
          description: res.message || "Có lỗi xảy ra khi tạo đơn hàng.",
        });
      }
      setIsSubmit(false);
    }, 2000);
  };

  return (
    <Modal
      title={<h2 style={{ fontSize: "22px", margin: 0 }}>Tạo đơn hàng mới</h2>}
      open={openModalCreate}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
      onCancel={() => setOpenModalCreate(false)}
      confirmLoading={isSubmit}
    >
      <Form
        form={form}
        name="createOrderForm"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          labelCol={{ span: 24 }}
          label="Tên khách hàng"
          name="customerName"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
          className="mt-4"
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Địa chỉ giao hàng"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Sản phẩm"
          name="product"
          rules={[{ required: true, message: "Vui lòng nhập sản phẩm!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderModalCreate;
