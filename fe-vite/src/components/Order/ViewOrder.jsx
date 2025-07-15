import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Image, Button, Form } from "react-bootstrap";
import {
  clearCart,
  doDeleteItemCartAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import StepProgress from "./StepProcess";
import { useState, useEffect } from "react";
import { callPlaceOrder } from "../../services/api";
import { message, notification } from "antd";

const ViewOrder = () => {
  const dispatch = useDispatch();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const carts = useSelector((state) => state.order.carts);

  useEffect(() => {
    if ((getTotal() === 0 || carts.length === 0) && showOrderForm) {
      setShowOrderForm(false);
      setCurrentStep(1); // hoặc 2, tùy theo logic
    }
  }, [carts, showOrderForm]);

  const handleQuantityChange = (id, value) => {
    if (!isNaN(value) && value > 0) {
      const item = carts.find((c) => c._id === id);
      if (item) {
        dispatch(
          doUpdateCartAction({
            _id: id,
            quantity: +value,
            detail: item.detail,
          })
        );
      }
    }
  };

  const handleDelete = (id) => {
    dispatch(doDeleteItemCartAction({ _id: id }));
  };

  const handleBuyNow = () => {
    setCurrentStep(2);
    setShowOrderForm(true);
  };

  const handleGoBackToCart = () => {
    setCurrentStep(1);
    setShowOrderForm(false);
  };

  const onFinish = async (name, phone, address) => {
    console.log(name, phone, address);
    const detailOrder = carts.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });

    const totalPrice = getTotal();

    const data = {
      name: name,
      address: address,
      phone: phone,
      totalPrice: totalPrice,
      detail: detailOrder,
    };

    console.log(data);

    const res = await callPlaceOrder(data);
    if (res && res.data) {
      message.success("Đặt hàng thành công!");
      dispatch(clearCart());
      setCurrentStep(3);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message || "Vui lòng thử lại sau",
      });
    }
  };

  const getTotal = () => {
    return carts.reduce(
      (sum, item) => sum + item.quantity * item.detail.price,
      0
    );
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="view-order-page" style={{ padding: 20 }}>
        <StepProgress
          currentStep={currentStep}
          steps={["Đơn hàng", "Đặt hàng", "Thanh toán"]}
          style={{ width: "100%" }}
        />
        <Row>
          <Col md={8}>
            {carts.length === 0 ? (
              <div className="text-center">Giỏ hàng của bạn đang trống.</div>
            ) : (
              carts.map((item) => (
                <Card className="mb-3" key={item._id}>
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <Image
                        src={
                          import.meta.env.VITE_BACKEND_URL +
                          "/images/book/" +
                          item.detail.thumbnail
                        }
                        style={{ width: 80, height: 100, objectFit: "cover" }}
                        rounded
                      />
                      <div>
                        <div>
                          <strong>{item.detail.mainText}</strong>
                        </div>
                        <div className="text-danger">
                          {item.detail.price.toLocaleString()} đ
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="number"
                        min={1}
                        value={item.quantity}
                        style={{ width: 80 }}
                        onChange={(e) =>
                          handleQuantityChange(item._id, e.target.value)
                        }
                      />
                      <div className="text-muted">
                        Tổng:{" "}
                        {(item.quantity * item.detail.price).toLocaleString()} đ
                      </div>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        🗑
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>

          <Col md={4}>
            <div className="fixed-height-box">
              {!showOrderForm ? (
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tạm tính</span>
                      <span>{getTotal().toLocaleString()} đ</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Tổng tiền</strong>
                      <strong className="text-danger">
                        {getTotal().toLocaleString()} đ
                      </strong>
                    </div>
                    <Button
                      onClick={handleBuyNow}
                      className="btn btn-primary w-100"
                      disabled={getTotal() === 0 || carts.length === 0}
                    >
                      Mua ngay
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <Card>
                  <Card.Body>
                    <h5 className="mb-3">Thông tin người nhận</h5>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        onFinish(name, phone, address);
                      }}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label>🧑‍💼 Tên người nhận *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập tên"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>📞 Số điện thoại *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập SĐT"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>🏡 Địa chỉ *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Nhập địa chỉ"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>💰 Hình thức thanh toán</Form.Label>
                        <Form.Check
                          type="radio"
                          label="Thanh toán khi nhận hàng"
                          name="payment"
                          defaultChecked
                        />
                      </Form.Group>

                      {/* Tổng tiền in đậm màu đỏ */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong>Tổng tiền</strong>
                        <strong
                          className="text-danger"
                          style={{ fontSize: "18px" }}
                        >
                          {getTotal().toLocaleString()} đ
                        </strong>
                      </div>

                      {/* 2 nút */}
                      <div className="d-flex gap-2">
                        <Button
                          variant="secondary"
                          className="w-50"
                          onClick={handleGoBackToCart}
                        >
                          Quay lại
                        </Button>
                        <Button
                          type="submit"
                          variant="success"
                          className="w-50"
                        >
                          Xác nhận đơn hàng
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ViewOrder;
