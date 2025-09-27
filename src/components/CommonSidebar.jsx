import React, { useState } from "react";
import {
  Typography,
  Input,
  Button,
  List,
  Avatar,
  Badge,
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
  CalendarOutlined,
} from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext";
import SettingsDropdown from "./SettingsDropdown";

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

const CommonSidebar = ({
  title = "Google Calendar MCP",
  showConversations = true,
  conversationHistory = [],
  onNewConversation,
  onConversationClick,
  currentChatId,
  searchQuery = "",
  onSearchChange,
  onClearSearch,
  customSidebarContent,
  customActions = [],
  collapsed = false,
  onToggleCollapse,
}) => {
  const { theme } = useTheme();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = onToggleCollapse ? collapsed : internalCollapsed;
  const toggleSidebar = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  // Filter conversations based on search query
  const filteredConversations = conversationHistory.filter((conversation) => {
    return conversation.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

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
      icon: <CalendarOutlined style={{ color: "var(--primary-color)" }} />,
      tooltip: "Recent Chats",
      onClick: toggleSidebar,
    },
    {
      icon: <SettingOutlined />,
      tooltip: "Settings",
      onClick: () => {},
    },
  ];

  const actions = customActions.length > 0 ? customActions : defaultActions;

  return (
    <div
      className={`dashboard-sidebar ${isCollapsed ? "collapsed" : ""}`}
      data-theme={theme}
    >
      <div className="sidebar-header">
        <div className="logo-section">
          {!isCollapsed && (
            <>
              <Title level={4} className="app-title">
                {title}
              </Title>
            </>
          )}
          <Button
            type="text"
            icon={
              isCollapsed ? (
                <MenuUnfoldOutlined style={{
                  color: "var(--black-color)"
                }} />
              ) : (
                <MenuFoldOutlined  style={{
                  color: "var(--black-color)"
                }}/>
              )
            }
            onClick={toggleSidebar}
            className="collapse-btn"
          />
        </div>
      </div>

      {isCollapsed ? (
        // Collapsed sidebar - show avatar and action buttons
        <div className="collapsed-content">
          <div className="collapsed-actions">
            {actions.filter(action => action.tooltip !== "Settings").map((action, index) => (
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

          {/* Settings button at the bottom when collapsed */}
          <div className="collapsed-settings">
            <Tooltip title="Settings" placement="right">
              <SettingsDropdown 
                className="collapsed-settings-btn"
                iconOnly={true}
              />
            </Tooltip>
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

              {/* Conversation data related information  */}
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
                          <CalendarOutlined className="conversation-icon" />
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
            <SettingsDropdown />
          </div>
        </>
      )}
    </div>
  );
};

export default CommonSidebar;