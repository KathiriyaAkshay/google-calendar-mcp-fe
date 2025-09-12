import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Space,
  DatePicker,
  Select,
  Row,
  Col,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TrendingUpOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("week");
  const [analyticsData, setAnalyticsData] = useState({
    totalEvents: 156,
    completedEvents: 142,
    pendingEvents: 14,
    averageEventDuration: "1.5h",
    activeUsers: 28,
    eventTypes: [
      { type: "Meeting", count: 85, percentage: 54 },
      { type: "Appointment", count: 41, percentage: 26 },
      { type: "Reminder", count: 30, percentage: 20 },
    ],
    recentActivity: [
      {
        key: 1,
        event: "Team Standup",
        type: "Meeting",
        duration: "30 mins",
        participants: 5,
        status: "Completed",
        date: "2025-09-11",
      },
      {
        key: 2,
        event: "Client Review",
        type: "Meeting",
        duration: "1 hour",
        participants: 3,
        status: "Completed",
        date: "2025-09-11",
      },
      {
        key: 3,
        event: "Project Planning",
        type: "Meeting",
        duration: "2 hours",
        participants: 8,
        status: "In Progress",
        date: "2025-09-11",
      },
      {
        key: 4,
        event: "Doctor Appointment",
        type: "Appointment",
        duration: "45 mins",
        participants: 1,
        status: "Scheduled",
        date: "2025-09-12",
      },
    ],
  });

  const customActions = [
    {
      icon: <BarChartOutlined />,
      tooltip: "Bar Chart View",
      onClick: () => {},
    },
    {
      icon: <LineChartOutlined />,
      tooltip: "Line Chart View",
      onClick: () => {},
    },
    {
      icon: <PieChartOutlined />,
      tooltip: "Pie Chart View",
      onClick: () => {},
    },
    {
      icon: <CalendarOutlined />,
      tooltip: "Calendar View",
      onClick: () => {},
    },
  ];

  const columns = [
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const color = type === "Meeting" ? "blue" : type === "Appointment" ? "green" : "orange";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants",
      render: (count) => (
        <Space>
          <UserOutlined />
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = 
          status === "Completed" ? "success" :
          status === "In Progress" ? "processing" :
          "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  const completionRate = Math.round((analyticsData.completedEvents / analyticsData.totalEvents) * 100);

  return (
    <DashboardLayout
      title="Google Calendar MCP"
      showConversations={false}
      customActions={customActions}
    >
      <div className="content-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={2} className="page-title">
              <DashboardOutlined style={{ marginRight: 8 }} />
              Analytics Dashboard
            </Title>
            <Text className="page-subtitle">
              Monitor your calendar events, productivity metrics, and usage patterns
            </Text>
          </div>
          <Space>
            <Select 
              value={timeRange} 
              onChange={setTimeRange}
              style={{ minWidth: 120 }}
            >
              <Option value="day">Today</Option>
              <Option value="week">This Week</Option>
              <Option value="month">This Month</Option>
              <Option value="quarter">This Quarter</Option>
            </Select>
            <RangePicker />
          </Space>
        </div>
      </div>

      {/* Key Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="content-section">
            <Statistic
              title="Total Events"
              value={analyticsData.totalEvents}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="content-section">
            <Statistic
              title="Completed Events"
              value={analyticsData.completedEvents}
              prefix={<TrendingUpOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="content-section">
            <Statistic
              title="Avg. Duration"
              value={analyticsData.averageEventDuration}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="content-section">
            <Statistic
              title="Active Users"
              value={analyticsData.activeUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#f56a00" }}
            />
          </Card>
        </Col>
      </Row>

      <div className="content-grid">
        {/* Completion Rate */}
        <Card 
          title="Event Completion Rate"
          className="content-section"
        >
          <div style={{ textAlign: "center" }}>
            <Progress
              type="circle"
              percent={completionRate}
              format={(percent) => `${percent}%`}
              size={120}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div style={{ marginTop: 16 }}>
              <Text strong style={{ fontSize: 16 }}>
                {analyticsData.completedEvents} of {analyticsData.totalEvents} events completed
              </Text>
            </div>
          </div>
        </Card>

        {/* Event Types Distribution */}
        <Card 
          title="Event Types Distribution"
          className="content-section"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {analyticsData.eventTypes.map((item, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text strong>{item.type}</Text>
                  <Text>{item.count} events</Text>
                </div>
                <Progress 
                  percent={item.percentage} 
                  showInfo={false}
                  strokeColor={index === 0 ? "#1890ff" : index === 1 ? "#52c41a" : "#fa8c16"}
                />
              </div>
            ))}
          </Space>
        </Card>

        {/* Productivity Insights */}
        <Card 
          title="Productivity Insights"
          className="content-section"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="medium">
            <div style={{ padding: "12px 0", borderBottom: "1px solid var(--bs-border-color)" }}>
              <Text strong style={{ color: "#52c41a" }}>📈 Peak Hours</Text>
              <br />
              <Text type="secondary">Most events scheduled between 10 AM - 2 PM</Text>
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid var(--bs-border-color)" }}>
              <Text strong style={{ color: "#1890ff" }}>🎯 Focus Time</Text>
              <br />
              <Text type="secondary">Average 2.5 hours of uninterrupted time daily</Text>
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid var(--bs-border-color)" }}>
              <Text strong style={{ color: "#fa8c16" }}>⚡ Quick Meetings</Text>
              <br />
              <Text type="secondary">65% of meetings completed under 1 hour</Text>
            </div>
            <div style={{ padding: "12px 0" }}>
              <Text strong style={{ color: "#722ed1" }}>📅 Weekly Pattern</Text>
              <br />
              <Text type="secondary">Tuesday and Wednesday are your busiest days</Text>
            </div>
          </Space>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card 
        title="Recent Activity"
        className="content-section"
        style={{ marginTop: 24 }}
      >
        <Table
          columns={columns}
          dataSource={analyticsData.recentActivity}
          pagination={false}
          size="middle"
          scroll={{ x: true }}
        />
      </Card>
    </DashboardLayout>
  );
}
