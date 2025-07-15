import React, { useEffect, useState } from "react";
import { Table, Button, Input, Popconfirm, message, Row, Col } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";

const mockOrders = [
  {
    _id: "1",
    name: "Duy",
    address: "123 Lê Lợi, Hà Nội",
    phone: "0123456789",
    updatedAt: "2025-07-01",
  },
  {
    _id: "2",
    name: "Trang",
    address: "456 Nguyễn Huệ, Huế",
    phone: "0987654321",
    updatedAt: "2025-07-02",
  },
  {
    _id: "3",
    name: "Tùng",
    address: "789 Hai Bà Trưng, Đà Nẵng",
    phone: "0112233445",
    updatedAt: "2025-07-03",
  },
];

const OrderTable = () => {
  const [listOrders, setListOrders] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Tên người đặt",
      dataIndex: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
    },
    {
      title: "Hành động",
      render: (text, record) => (
        <>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDeleteOrder(record._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <span style={{ cursor: "pointer", marginRight: 20 }}>
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </span>
          </Popconfirm>

          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer" }}
            onClick={() =>
              message.info("Chức năng cập nhật đơn hàng đang phát triển")
            }
          />
        </>
      ),
    },
  ];

  const fetchOrders = () => {
    setIsLoading(true);
    let filtered = [...mockOrders];

    if (filters.name) {
      filtered = filtered.filter((order) =>
        order.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.address) {
      filtered = filtered.filter((order) =>
        order.address.toLowerCase().includes(filters.address.toLowerCase())
      );
    }

    if (filters.phone) {
      filtered = filtered.filter((order) =>
        order.phone.toLowerCase().includes(filters.phone.toLowerCase())
      );
    }

    const startIndex = (current - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    setTimeout(() => {
      setListOrders(paginated);
      setTotal(filtered.length);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchOrders();
  }, [current, pageSize, filters]);

  const handleDeleteOrder = (id) => {
    message.success("Đã xóa đơn hàng (giả lập)");
    const updated = listOrders.filter((order) => order._id !== id);
    setListOrders(updated);
    setTotal((prev) => prev - 1);
  };

  const renderHeader = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>Danh sách đơn hàng</span>
      <span style={{ display: "flex", gap: 15 }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => message.info("Mở modal tạo đơn hàng")}
        >
          Thêm đơn
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            setFilters({ name: "", address: "", phone: "" });
            setCurrent(1);
            fetchOrders();
          }}
        >
          <ReloadOutlined />
        </Button>
      </span>
    </div>
  );

  return (
    <>
      <div className="search">
        <div className="name">
          <h6>Tên người đặt</h6>
          <Input
            value={filters.name}
            placeholder="Nhập tên"
            style={{ width: "300px" }}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>

        <div className="name">
          <h6>Địa chỉ</h6>
          <Input
            value={filters.address}
            placeholder="Nhập địa chỉ"
            style={{ width: "300px" }}
            onChange={(e) =>
              setFilters({ ...filters, address: e.target.value })
            }
          />
        </div>

        <div className="name">
          <h6>Số điện thoại</h6>
          <Input
            value={filters.phone}
            placeholder="Nhập số điện thoại"
            style={{ width: "300px" }}
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="button">
        <Button type="primary" onClick={fetchOrders}>
          Tìm kiếm
        </Button>
        <Button
          onClick={() => {
            setFilters({ name: "", address: "", phone: "" });
            setCurrent(1);
            fetchOrders();
          }}
        >
          Xóa lọc
        </Button>
      </div>

      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            bordered
            columns={columns}
            dataSource={listOrders}
            rowKey="_id"
            pagination={{
              current,
              pageSize,
              total,
              showSizeChanger: true,
              onChange: (page, size) => {
                setCurrent(page);
                setPageSize(size);
              },
              showTotal: (total, range) => (
                <div>
                  {range[0]}-{range[1]} trên {total} đơn hàng
                </div>
              ),
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default OrderTable;
