import React, { useState } from "react";
import { Avatar, Typography } from "antd";
import CommonSidebar from "./CommonSidebar";
import ConversationService from "../data/conversationService";

const { Text } = Typography;

const SidebarLayout = ({
  title,
  conversationHistory,
  onNewConversation,
  onConversationClick,
  currentChatId,
  searchQuery,
  onSearchChange,
  onClearSearch,
  customActions,
  getCustomActions,
  children,
  containerStyle,
}) => {
  const userInfo = ConversationService.getUserInfo();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-container" style={containerStyle}>
      <CommonSidebar
        title={title}
        conversationHistory={conversationHistory}
        onNewConversation={onNewConversation}
        onConversationClick={onConversationClick}
        currentChatId={currentChatId}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onClearSearch={onClearSearch}
        customActions={
          typeof getCustomActions === 'function'
            ? getCustomActions(() => setSidebarCollapsed(!sidebarCollapsed))
            : customActions
        }
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

        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;


