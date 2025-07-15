import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Popconfirm,
  message,
  Row,
  Col,
  Result,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import "./bookTable.scss"; // tạo file style nếu cần
import { callDeleteBook, callFetchBook } from "../../../services/api";
import BookViewDetail from "./BookViewDetail";
import BookModalCreate from "./BookModalCreate";
import BookModalUpdate from "./BookModalUpdate";

const BookTable = () => {
  const [listBooks, setListBooks] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  let [filters, setFilters] = useState({
    title: "",
    author: "",
    category: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState();

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState();

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "name",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              setDataViewDetail(record), setOpenViewDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      render: (text) => (
        <span style={{ color: "#555", fontStyle: "italic" }}>{text}</span>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      render: (price) => `${price.toLocaleString()} VNĐ`,
      sorter: (a, b) => a.price - b.price,
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
            description="Bạn có chắc chắn muốn xóa sách này?"
            onConfirm={() => handleDeleteBook(record._id)}
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
            onClick={() => {
              setOpenModalUpdate(true);
              setDataUpdate(record);
            }}
          />
        </>
      ),
    },
  ];

  const fetchBooks = async () => {
    setIsLoading(true); // bật loading

    let query = `current=${current}&pageSize=${pageSize}`;
    if (filters.title) query += `&mainText=/${filters.title}/i`;
    if (filters.author) query += `&author=/${filters.author}/i`;
    if (filters.category) query += `&category=/${filters.category}/i`;

    try {
      const res = await callFetchBook(query);

      // ⏱️ Chờ thêm 1 giây để "giả lập" loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (res && res.data) {
        setListBooks(res.data.result);
        setTotal(res.data.meta.total);
      }
    } catch (error) {
      console.error("Lỗi khi fetch book:", error);
    } finally {
      setIsLoading(false); // tắt loading
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [current, pageSize]);

  const handleDeleteBook = async (id) => {
    const res = await callDeleteBook(id);
    if (res && res.data) {
      message.success("Xóa sách thành công!");
      fetchBooks();
    } else {
      notification.error({
        message: "Thông báo",
        description: res?.message || "Xóa sách thất bại!",
      });
    }
  };

  const renderHeader = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>Danh sách sách</span>
      <span style={{ display: "flex", gap: 15, alignItems: "center" }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setOpenModalCreate(true)}
        >
          Thêm sách
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            setFilters({ title: "", author: "" });
            setCurrent(1);
            fetchBooks();
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
          <h6>Tên sách</h6>
          <Input
            value={filters.title}
            placeholder="Nhập tên sách"
            style={{ width: "300px" }}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
        </div>

        <div className="name">
          <h6>Tác giả</h6>
          <Input
            value={filters.author}
            placeholder="Nhập tên tác giả"
            style={{ width: "300px" }}
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
          />
        </div>

        <div className="name">
          <h6>Thể loại</h6>
          <Input
            value={filters.category}
            placeholder="Nhập thể loại"
            style={{ width: "300px" }}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          />
        </div>
      </div>

      <div className="button">
        <Button type="primary" onClick={() => fetchBooks()}>
          Tìm kiếm
        </Button>
        <Button
          onClick={() => {
            setFilters({ title: "", author: "" });
            setCurrent(1);
            fetchBooks();
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
            dataSource={listBooks}
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
                  {range[0]}-{range[1]} trên {total} cuốn sách
                </div>
              ),
            }}
          />
        </Col>
      </Row>

      <BookViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <BookModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchBooks={fetchBooks}
      />

      <BookModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchBooks={fetchBooks}
      />
    </>
  );
};

export default BookTable;
