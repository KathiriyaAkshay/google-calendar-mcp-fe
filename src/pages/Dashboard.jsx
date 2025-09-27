import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Input,
  Button,
  Avatar,
  message,
  Tooltip,
} from "antd";
import {
  SendOutlined,
  PlusOutlined,
  SearchOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import SidebarLayout from "../components/SidebarLayout";
import { useTheme } from "../contexts/ThemeContext";
import ConversationService from "../data/conversationService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function Dashboard() {
  const location = useLocation();
  const appConfig = ConversationService.getAppConfig();
  const [currentChatId, setCurrentChatId] = useState(appConfig.defaultChatId);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState(ConversationService.getAllConversations());

  // Handle navigation from other pages with selected chat
  useEffect(() => {
    if (location.state?.selectedChatId) {
      const selectedChatId = location.state.selectedChatId;
      // Validate that the chat exists before setting it
      if (ConversationService.conversationExists(selectedChatId)) {
        setCurrentChatId(selectedChatId);
      } else {
        message.error("Selected conversation not found");
      }
      // Clear the state to prevent it from persisting
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const userInfo = ConversationService.getUserInfo();

  const messages = ConversationService.getConversationMessages(currentChatId, chats);

  const conversationHistory = ConversationService.getConversationHistory(currentChatId);

  const handleSend = () => {
    if (!inputValue.trim() || loading) return;
    setLoading(true);

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setChats(prev => ConversationService.addMessageToConversation(currentChatId, userMessage, prev));

    setInputValue("");

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: `Thank you for your question: "${userMessage.content}". This is a demonstration response from Google Calendar MCP.`,
        timestamp: new Date().toLocaleTimeString(),
        reactions: { likes: 0, dislikes: 0, userReaction: null },
      };

      setChats(prev => ConversationService.addMessageToConversation(currentChatId, aiMessage, prev));

      setLoading(false);
    }, 1500);
  };

  const handleNewConversation = () => {
    const { newChatId, updatedChats } = ConversationService.createNewConversation(chats);

    setChats(updatedChats);
    setCurrentChatId(newChatId);
    message.success("New conversation started!");
  };

  const handleConversationClick = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getCustomActions = (toggleSidebar) => [
    {
      icon: <PlusOutlined />,
      tooltip: "New Conversation",
      onClick: handleNewConversation,
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
    },
    {
      icon: <SettingOutlined />,
      tooltip: "Settings",
      onClick: () => { },
    },
  ];

  return (
    <SidebarLayout
      title={appConfig.title}
      conversationHistory={conversationHistory}
      onNewConversation={handleNewConversation}
      onConversationClick={handleConversationClick}
      currentChatId={currentChatId}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onClearSearch={clearSearch}
      getCustomActions={getCustomActions}
    >
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            {message.type === "assistant" && (
              <Avatar size={32} style={{ backgroundColor: "#2f80ed", marginRight: 12 }}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>AI</Text>
              </Avatar>
            )}
            {message.type === "user" && (
              <div className="user-message-wrapper">
                <div className="message-content user-message">
                  <div className="message-text">
                    <Text style={{ color: "white" }}>
                      {message.content}
                    </Text>
                  </div>
                  <div className="message-meta">
                    <Text type="secondary" style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
                      {message.timestamp}
                    </Text>
                  </div>
                </div>
              </div>
            )}
            {message.type === "assistant" && (
              <div className="message-content">
                <div className="message-text">
                  <Text style={{ color: "var(--bs-body-color)" }}>
                    {message.content}
                  </Text>
                </div>
                <div className="message-meta">
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {message.timestamp}
                  </Text>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <Avatar size={32} style={{ backgroundColor: "#2f80ed", marginRight: 12 }}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>AI</Text>
            </Avatar>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-section">
        <div className="input-container">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your calendar..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="chat-input"
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            className="send-btn"
          />
        </div>
      </div>
    </SidebarLayout>
  );
}