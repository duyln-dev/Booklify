import React from "react";
import { Row, Col, Card, Statistic, Progress, Typography, Divider } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;

const pieData = [
  { name: "Sách", value: 400 },
  { name: "Đơn hàng", value: 300 },
  { name: "Người dùng", value: 300 },
];

const barData = [
  { name: "T1", Đơn: 40 },
  { name: "T2", Đơn: 80 },
  { name: "T3", Đơn: 65 },
  { name: "T4", Đơn: 100 },
  { name: "T5", Đơn: 90 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const DashboardAdmin = () => {
  return (
    <div>
      <Title level={2}>Dashboard Quản trị</Title>
      <Divider />

      {/* Statistic Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={1500}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={780}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Số lượng sách"
              value={250}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#0050b3" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu (triệu)"
              value={920}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: "#cf1322" }}
              suffix="VNĐ"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Biểu đồ tỷ lệ" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Số đơn hàng theo tháng" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Đơn" fill="#1890ff" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Progress */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Text strong>Tiến độ giao hàng</Text>
            <Progress percent={76} status="active" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;
