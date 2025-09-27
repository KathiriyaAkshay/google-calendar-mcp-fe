import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Button,
  List,
  Avatar,
  Badge,
  Spin,
  Tooltip,
} from "antd";
import {
  MessageOutlined,
  PlusOutlined,
  SettingOutlined,
  FileTextOutlined,
  InboxOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext";
import SettingsDropdown from "./SettingsDropdown";
import { useQuery } from "@tanstack/react-query";
import userAuthentication from "../service/userAuthentication";

const { Title, Text } = Typography;

// Helper component to highlight search terms
const HighlightText = ({ text, searchTerm }) => {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span
            key={i}
            style={{
              backgroundColor: "var(--bs-warning)",
              color: "var(--bs-dark)",
              padding: "1px 2px",
              borderRadius: "2px",
              fontWeight: "bold",
            }}
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const DashboardLayout = ({ 
  children, 
  title = "Google Calendar MCP",
  showConversations = true,
  conversationHistory = [],
  onNewConversation,
  onConversationClick,
  currentChatId,
  searchQuery = "",
  onSearchChange,
  onClearSearch,
  userInfo = {},
  customSidebarContent,
  customActions = []
}) => {
  const { theme } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: userAuthentication.getMe,
  });

  // Initialize layout on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter conversations based on search query
  const filteredConversations = conversationHistory.filter((conversation) => {
    return conversation.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const defaultActions = [
    {
      icon: <PlusOutlined />,
      tooltip: "New Conversation",
      onClick: onNewConversation || (() => {}),
    },
    {
      icon: <SearchOutlined />,
      tooltip: "Search",
      onClick: toggleSidebar,
    },
    {
      icon: <MessageOutlined />,
      tooltip: "Recent Chats",
      onClick: toggleSidebar,
    }
  ];

  const actions = customActions.length > 0 ? customActions : defaultActions;

  return (
    <>
      {!isInitialized ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "var(--bs-body-bg)",
            color: "var(--bs-body-color)",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div className="dashboard-container" data-theme={theme}>
          {/* Sidebar */}
          <div
            className={`dashboard-sidebar ${
              sidebarCollapsed ? "collapsed" : ""
            }`}
          >
            <div className="sidebar-header">
              <div className="logo-section">
                {!sidebarCollapsed && (
                  <>
                    <Avatar size={32} style={{ backgroundColor: "#2f80ed" }}>
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        GM
                      </Text>
                    </Avatar>
                    <Title level={4} className="app-title">
                      {title}
                    </Title>
                  </>
                )}
                <Button
                  type="text"
                  icon={
                    sidebarCollapsed ? (
                      <MenuUnfoldOutlined />
                    ) : (
                      <MenuFoldOutlined />
                    )
                  }
                  onClick={toggleSidebar}
                  className="collapse-btn"
                />
              </div>
            </div>

            {sidebarCollapsed ? (
              // Collapsed sidebar - show avatar and action buttons
              <div className="collapsed-content">
                <div className="collapsed-avatar">
                  <Tooltip title={title} placement="right">
                    <Avatar 
                      size={40} 
                      style={{ 
                        backgroundColor: "#2f80ed",
                        cursor: "pointer"
                      }}
                      onClick={toggleSidebar}
                    >
                      <Text style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
                        GM
                      </Text>
                    </Avatar>
                  </Tooltip>
                </div>
                
                <div className="collapsed-actions">
                  {actions.map((action, index) => (
                    <Tooltip key={index} title={action.tooltip} placement="right">
                      <Button
                        type="text"
                        icon={action.icon}
                        onClick={action.onClick}
                        className="collapsed-action-btn"
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            ) : (
              // Expanded sidebar - show full content
              <>
                {onNewConversation && (
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    className="new-conversation-btn"
                    block
                    onClick={onNewConversation}
                  >
                    New Conversation
                  </Button>
                )}

                {customSidebarContent ? (
                  customSidebarContent
                ) : showConversations ? (
                  <div className="conversation-section">
                    <Title level={5} className="section-title">
                      Conversation History
                    </Title>

                    <div className="filter-tabs">
                      <Button type="text" className="filter-tab active">
                        <InboxOutlined /> All <Badge count="999+" size="small" />
                      </Button>
                      <Button type="text" className="filter-tab">
                        <FileTextOutlined /> Archived{" "}
                        <Badge count={0} size="small" />
                      </Button>
                    </div>

                    {onSearchChange && (
                      <Input
                        placeholder="Search Conversations"
                        className="search-input"
                        style={{ marginBottom: 16 }}
                        value={searchQuery}
                        onChange={onSearchChange}
                        allowClear
                        onClear={onClearSearch}
                        prefix={
                          <SearchOutlined
                            style={{ color: "var(--bs-secondary-color)" }}
                          />
                        }
                      />
                    )}

                    <div className="time-section">
                      <div className="section-header">
                        <Text className="time-label">This Week</Text>
                        {searchQuery && (
                          <Text className="search-results-count">
                            {filteredConversations.length} result
                            {filteredConversations.length !== 1 ? "s" : ""}
                          </Text>
                        )}
                      </div>
                      {filteredConversations.length > 0 ? (
                        <List
                          size="small"
                          dataSource={filteredConversations}
                          renderItem={(item) => (
                            <List.Item
                              className={`conversation-item ${
                                item.active || item.id === currentChatId ? "active" : ""
                              }`}
                              onClick={() => onConversationClick && onConversationClick(item.id)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="conversation-content">
                                <MessageOutlined className="conversation-icon" />
                                <div>
                                  <Text className="conversation-title">
                                    <HighlightText
                                      text={item.title}
                                      searchTerm={searchQuery}
                                    />
                                  </Text>
                                  <Text className="conversation-meta">
                                    {item.messages} messages
                                  </Text>
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <div className="no-results">
                          <Text
                            style={{
                              color: "var(--bs-secondary-color)",
                              fontStyle: "italic",
                              fontSize: "14px",
                              fontFamily: "PT Sans, var(--bs-body-font-family)",
                            }}
                          >
                            {searchQuery
                              ? "No conversations found"
                              : "No conversations yet"}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="sidebar-footer">
                  <SettingsDropdown className="settings-btn" />
                </div>
              </>
            )}
          </div>

          {/* Main Content Area */}
          <div className="dashboard-main">
            <div className="chat-header">
              <div className="user-info">
                <Avatar size={24} style={{ backgroundColor: userInfo.avatarColor }}>
                  {userInfo.avatar}
                </Avatar>
                <Text className="email">{me?.email || userInfo.email}</Text>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="main-content">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
