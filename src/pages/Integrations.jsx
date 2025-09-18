import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Button,
  Tag,
  Input,
  Tabs,
  Space,
  Avatar,
  Switch,
  message,
  Tooltip,
  Table,
} from "antd";
import {
  GoogleOutlined,
  SettingOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  DisconnectOutlined,
  MoreOutlined,
  PlusOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import CommonSidebar from "../components/CommonSidebar";
import { useTheme } from "../contexts/ThemeContext";
import ConversationService from "../data/conversationService";

const { Title, Text } = Typography;
const { Search } = Input;

export default function Integrations() {
  const navigate = useNavigate();
  const appConfig = ConversationService.getAppConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentChatId, setCurrentChatId] = useState(appConfig.defaultChatId);
  const [chats, setChats] = useState(ConversationService.getAllConversations());

  const userInfo = ConversationService.getUserInfo();
  
  // Google Calendar related integrations data
  const integrations = [
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Meeting & Schedule data",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
      status: "connected",
      category: "calendar",
      permissions: ["Read calendar events", "Create events", "Update events"],
      connectedDate: "2025-09-10",
      lastSync: "2 minutes ago",
      events: 156,
    }
  ];

  const conversationHistory = ConversationService.getConversationHistory(currentChatId);

  const handleConversationClick = (chatId) => {
    navigate('/home', { state: { selectedChatId: chatId } });
  };

  const handleNewConversation = () => {
    const { newChatId, updatedChats } = ConversationService.createNewConversation(chats);

    setChats(updatedChats);
    setCurrentChatId(newChatId);
    message.success("New conversation started!");
  };

  const handleConnect = (integrationId) => {
    message.success(
      `Connected to ${integrations.find((i) => i.id === integrationId)?.name}!`
    );
  };

  const handleDisconnect = (integrationId) => {
    message.warning(
      `Disconnected from ${integrations.find((i) => i.id === integrationId)?.name
      }`
    );
  };

  const handleConfigure = (integrationId) => {
    message.info(
      `Configuring ${integrations.find((i) => i.id === integrationId)?.name}...`
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Table columns definition
  const columns = [
    {
      title: "INTEGRATION",
      dataIndex: "integration",
      key: "integration",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={record.icon}
            alt={record.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiM0Mjg1ZjQiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMEM2IDAgNCAyIDQgNEg0VjEyQzQgMTQgNiAxNiA4IDE2UzEyIDE0IDEyIDEySDhWOEg4VjRIOFY0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";
            }}
          />
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "var(--bs-body-color)",
                marginBottom: 2,
              }}
            >
              {record.name}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--bs-secondary-color)",
              }}
            >
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "connected" ? "success" : "default"}
          icon={
            status === "connected" ? (
              <CheckCircleOutlined />
            ) : (
              <InfoCircleOutlined />
            )
          }
          style={{
            borderRadius: 12,
            padding: "4px 12px",
            fontWeight: 500,
            textTransform: "uppercase",
            fontSize: "11px",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === "connected" ? (
            <Button
              type="text"
              icon={<SettingOutlined />}
              style={{
                color: "#ff6b6b",
                border: "1px solid #ff6b6b20",
                borderRadius: 8,
              }}
              onClick={() => handleConfigure(record.id)}
            />
          ) : (
            <Button
              type="primary"
              size="small"
              style={{
                borderRadius: 8,
                backgroundColor: "#4f83ff",
                border: "none",
              }}
              onClick={() => handleConnect(record.id)}
            >
              Connect
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "all",
      label: "All",
      children: null,
    },
    {
      key: "connected",
      label: "Connected",
      children: null,
    },
    {
      key: "available",
      label: "Available",
      children: null,
    },
  ];

  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const customActions = [
    {
      icon: <PlusOutlined />,
      tooltip: "New Conversation",
      onClick: handleNewConversation,
    },
    {
      icon: <SearchOutlined />,
      tooltip: "Search",
      onClick: () => setSidebarCollapsed(!sidebarCollapsed),
    },
    {
      icon: <MessageOutlined />,
      tooltip: "Recent Chats",
      onClick: () => setSidebarCollapsed(!sidebarCollapsed),
    },
    {
      icon: <SettingOutlined />,
      tooltip: "Settings",
      onClick: () => { },
    },
  ];

  return (
    <div className="dashboard-container" data-theme={theme}>
      <CommonSidebar
        title={appConfig.title}
        conversationHistory={conversationHistory}
        onNewConversation={handleNewConversation}
        onConversationClick={handleConversationClick}
        currentChatId={currentChatId}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        customActions={customActions}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="dashboard-main">
        <div className="chat-header">
          <div className="user-info">
            <Avatar size={24} style={{ backgroundColor: userInfo.avatarColor }}>
              {userInfo.avatar}
            </Avatar>
            <Text className="username">{userInfo.name}</Text>
            <Text className="email">{userInfo.email}</Text>
          </div>
        </div>

        <div className="integration-content">
          <div className="content-header">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div className="page-title">
                  Integrations
                </div>
                <div className="page-subtitle">
                  Seamlessly connect and manage your Google Calendar along with other essential services to streamline scheduling and productivity.
                </div>
              </div>
            </div>
          </div>

          {/* Integration Table */}
          <Card className="content-section">
            <Table
              columns={columns}
              dataSource={integrations}
              rowKey="id"
              pagination={false}
              showHeader={true}
              size="middle"
              style={{
                backgroundColor: "transparent",
              }}
              className="integration-table"
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-even" : "table-row-odd"
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
