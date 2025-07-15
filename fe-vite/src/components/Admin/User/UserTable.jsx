import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import { Button } from "antd";
import { Input } from "antd";
import "./userTable.scss";
import { callDeleteUser, callFetchUser } from "../../../services/api";
import {
  CloudUploadOutlined,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";

import { Row, Col, Popconfirm, message, notification } from "antd";
import UserViewDetail from "./UserViewDetail";
import UserModalCreate from "./UserModalCreate";
import UserModalUpdate from "./UserModalUpdate";

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);

  const [filters, setfilters] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [sortQuery, setSortQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState();

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState();

  const columns = [
    {
      title: "Id",
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
      title: "Tên hiển thị",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },

    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
    },

    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa user"}
              description={"Bạn có chắc chắn muốn xóa user này ?"}
              onConfirm={() => handleDeleteUser(record._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
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
        );
      },
    },
  ];

  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Table List Users</span>
        <span style={{ display: "flex", gap: 15, alignItems: "center" }}>
          <Button
            icon={<PlusOutlined style={{ verticalAlign: "middle" }} />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Thêm mới
          </Button>
          <Button
            type="ghost"
            onClick={() => {
              setfilters("");
              setSortQuery("");
            }}
          >
            <ReloadOutlined />
          </Button>
        </span>
      </div>
    );
  };

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, sortQuery]);

  const fetchUser = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;

    if (filters.name) {
      query += `&fullName=${filters.name}`;
    }

    if (filters.email) {
      notification.error({
        message: "Thông báo",
        description: "Chức năng tìm kiếm theo email chưa được triển khai.",
      });
      delete filters.email; // Xóa email khỏi filters vì chưa triển khai
    }

    if (filters.phone) {
      notification.error({
        message: "Thông báo",
        description: "Chức năng tìm kiếm theo phone chưa được triển khai.",
      });
      delete filters.phone; // Xóa phone khỏi filters vì chưa triển khai
    }

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    console.log(`Fetch user with query: ${query}`);

    try {
      const res = await callFetchUser(query);
      if (res && res.data) {
        setListUser(res.data.result);
        setTotal(res.data.meta.total);
      }
    } catch (error) {
      console.error("Lỗi khi fetch user:", error);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleDeleteUser = async (id) => {
    const res = await callDeleteUser(id);
    if (res && res.data) {
      message.success("Xóa người dùng thành công!");
      fetchUser();
    } else {
      notification.error({
        message: "Thông báo",
        description: res.message,
      });
    }
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  return (
    <>
      <div className="search">
        <div className="name">
          <h6>Name</h6>
          <Input
            value={filters.name}
            placeholder="Basic usage"
            style={{ width: "350px" }}
            onChange={(e) => setfilters({ ...filters, name: e.target.value })}
          />
        </div>

        <div className="name">
          <h6>Email</h6>
          <Input
            value={filters.email}
            placeholder="Basic usage"
            style={{ width: "350px" }}
            onChange={(e) => setfilters({ ...filters, email: e.target.value })}
          />
        </div>

        <div className="name">
          <h6>Số điện thoại</h6>
          <Input
            value={filters.phone}
            placeholder="Basic usage"
            style={{ width: "350px" }}
            onChange={(e) => setfilters({ ...filters, phone: e.target.value })}
          />
        </div>
      </div>
      <div className="button">
        <Button
          type="primary"
          onClick={() => {
            fetchUser();
          }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            setfilters({ name: "", email: "", phone: "" });
            setSortQuery("");
            setCurrent(1);
            fetchUser();
          }}
        >
          Clear
        </Button>
      </div>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            bordered
            columns={columns}
            dataSource={listUser}
            rowKey={"_id"}
            onChange={onChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              showTotal: (total, range) => {
                return (
                  <div>
                    {" "}
                    {range[0]}-{range[1]} trên {total} rows
                  </div>
                );
              },
            }}
          />
        </Col>
      </Row>

      <UserViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <UserModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchUser={fetchUser}
      />

      <UserModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default UserTable;
