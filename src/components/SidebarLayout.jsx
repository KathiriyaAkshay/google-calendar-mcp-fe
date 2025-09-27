import React, { useState } from "react";
import { Avatar, Typography } from "antd";
import CommonSidebar from "./CommonSidebar";
import ConversationService from "../data/conversationService";
import { useQuery } from "@tanstack/react-query";
import userAuthentication from "../service/userAuthentication";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: userAuthentication.getMe });
  const fallbackUser = ConversationService.getUserInfo();
  const email = me?.data?.email || fallbackUser?.email || "";
  const displayName = email ? email.split("@")[0] : fallbackUser?.name || "";
  const avatarInitial = displayName ? displayName[0]?.toUpperCase() : (email[0]?.toUpperCase() || fallbackUser?.avatar || "");

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
            <Avatar size={24}>
              {avatarInitial}
            </Avatar>
            <Text className="email user-info-email">{email}</Text>
          </div>
        </div>

        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;


