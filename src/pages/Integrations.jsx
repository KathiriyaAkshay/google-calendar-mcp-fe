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
  const [activeTab, setActiveTab] = useState("all");
  const [currentChatId, setCurrentChatId] = useState(appConfig.defaultChatId);
  const [chats, setChats] = useState(ConversationService.getAllConversations());

  const userInfo = ConversationService.getUserInfo();
  // Google Calendar related integrations data
  const integrations = [
    {
      id: "salesforce",
      name: "Salesforce",
      description: "CRM & Pipeline data",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg",
      status: "connected",
      category: "crm",
      permissions: ["Read contacts", "Create opportunities", "Update pipeline"],
      connectedDate: "2025-09-10",
      lastSync: "2 minutes ago",
      contacts: 1250,
    },
    {
      id: "apollo",
      name: "Apollo.io",
      description: "Prospecting & Lead data",
      icon: "https://assets-global.website-files.com/61c441abf0ae3e2d6b8e0ae3/61c56c509622c46d9e500f34_Apollo%20Logo%20Dark.png",
      status: "available",
      category: "sales",
      permissions: ["Read leads", "Export contacts", "Access analytics"],
      features: ["Lead scoring", "Email sequences", "Contact enrichment"],
    },
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
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "CRM & Marketing data",
      icon: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
      status: "available",
      category: "marketing",
      permissions: ["Read contacts", "Access deals", "Marketing analytics"],
      features: ["Contact sync", "Deal tracking", "Marketing automation"],
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "Email communication data",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
      status: "available",
      category: "communication",
      permissions: ["Read emails", "Send emails", "Access attachments"],
      features: ["Email sync", "Auto-reply", "Template management"],
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Business integration",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
      status: "available",
      category: "storage",
      permissions: ["Read files", "Upload files", "Share documents"],
      features: ["File sync", "Document collaboration", "Version control"],
    },
  ];

  const conversationHistory = ConversationService.getConversationHistory(currentChatId);

  const handleConversationClick = (chatId) => {
    navigate('/home', { state: { selectedChatId: chatId } });
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "connected")
      return matchesSearch && integration.status === "connected";
    if (activeTab === "available")
      return matchesSearch && integration.status === "available";

    return matchesSearch;
  });

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
      `Disconnected from ${
        integrations.find((i) => i.id === integrationId)?.name
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
      onClick: () => {},
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
                <Title level={2} className="page-title">
                  Integrations
                </Title>
                <Text className="page-subtitle">
                  Connect and manage your Google Calendar and related services
                </Text>
              </div>
              <Input
                placeholder="Search integrations..."
                prefix={
                  <SearchOutlined
                    style={{ color: "var(--bs-secondary-color)" }}
                  />
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                style={{
                  width: 280,
                  height: 40,
                  borderRadius: 6,
                  border: "1px solid var(--bs-border-color)",
                  backgroundColor: "var(--bs-body-bg)",
                  fontSize: "14px",
                  fontFamily: "PT Sans, var(--bs-body-font-family)",
                }}
                className="integration-search-input"
              />
            </div>
          </div>

          {/* Tabs for filtering */}
          <div style={{ marginBottom: 24 }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
          </div>

          {/* Integration Table */}
          <Card className="content-section">
            <Table
              columns={columns}
              dataSource={filteredIntegrations}
              rowKey="id"
              pagination={false}
              showHeader={true}
              size="middle"
              style={{
                backgroundColor: "transparent",
              }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-even" : "table-row-odd"
              }
            />
          </Card>

          {filteredIntegrations.length === 0 && (
            <div className="content-empty">
              <div className="empty-icon">
                <SearchOutlined />
              </div>
              <div className="empty-title">No integrations found</div>
              <div className="empty-description">
                Try adjusting your search terms or browse all available
                integrations
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
