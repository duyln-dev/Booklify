import React, { useEffect, useState } from "react";
import { Table, Accordion } from "react-bootstrap";
import { callGetListOrderHistory } from "../../services/api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    const res = await callGetListOrderHistory();
    if (res && res.data) {
      console.log("Order History Data:", res.data);
      setOrders(res.data);
    }
  };

  const renderDetails = (details) => {
    if (!details || details.length === 0) {
      return <div className="text-muted">Không có chi tiết đơn mua.</div>;
    }

    return (
      <ul style={{ paddingLeft: "20px", margin: 0 }}>
        {details.map((item) => (
          <li key={item._id}>
            <strong>{item.bookName}</strong> – Số lượng: {item.quantity}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Lịch sử đặt hàng:</h4>
      <Table striped bordered hover responsive style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "50px" }}>STT</th>
            <th style={{ width: "180px" }}>Thời gian</th>
            <th style={{ width: "150px" }}>Tổng số tiền</th>
            <th style={{ width: "120px" }}>Trạng thái</th>
            <th style={{ width: "300px" }}>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order._id}>
              <td>{idx + 1}</td>
              <td>{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
              <td>{order.totalPrice.toLocaleString("vi-VN")} ₫</td>
              <td>
                <span className="badge bg-success">Thành công</span>
              </td>
              <td>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Chi tiết đơn mua</Accordion.Header>
                    <Accordion.Body
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px",
                      }}
                    >
                      {renderDetails(order.detail)}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderHistory;
