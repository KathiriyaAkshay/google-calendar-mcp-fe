import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Card,
  Button,
  Space,
  message,
  Avatar,
  Flex,
} from "antd";
import {
  GoogleOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import SidebarLayout from "../components/SidebarLayout";
import ConversationService from "../data/conversationService";
import "../styles/setting.scss";
import INTEGRATION_ID from "../constant/integration.constant";
import integration from "../service/integration";
import { useMutation } from "@tanstack/react-query";
import { INTEGRATION_MESSAGE } from "../constant/api.constant";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const { Text } = Typography;

export default function Settings() {
  const params = new URLSearchParams(window.location.search);
  const queryClient = useQueryClient();
  
  const appConfig = ConversationService.getAppConfig();
  const [currentChatId, setCurrentChatId] = useState(appConfig.defaultChatId);
  const [searchQuery, setSearchQuery] = useState("");
  const conversationHistory = ConversationService.getConversationHistory(currentChatId);
  const userInfo = ConversationService.getUserInfo();
  
  // Fetch configured integrations
  const {data: configuredIntegrations, isPending: gettingConfiguredIntegrations} = useQuery({
    queryKey: ["configuredIntegrations"],
    queryFn: integration.configuredIntegrations
  });

  const checkIntegrationIsConfigured = (integrationId) => {
    if (!configuredIntegrations) return false;
    return configuredIntegrations.data.configurations.some(integration => integration.configuration == integrationId);
  }

  // Disconnect intergration related functionality
  const {mutateAsync: deleteConfiguration, isPending: deletingConfiguration} = useMutation({
    mutationFn: (integrationId) => integration.deleteConfiguration(integrationId),
    onSuccess: (data, variables) => {
      message.success("Disconnected successfully");
      queryClient.invalidateQueries({ queryKey: ["configuredIntegrations"] });
    },
  });

  const {mutateAsync: getGoogleCalendarToken, isPending: gettingGoogleCalendarToken} = useMutation({
    mutationFn: (token) => integration.getGoogleCalendarToken(token),
    onSuccess: (data) => {
      message.success("Google Calendar connected");
      queryClient.invalidateQueries({ queryKey: ["configuredIntegrations"] });
    },
    onError: (error) => {
      message.error(error?.message || INTEGRATION_MESSAGE.COMMON_ERROR_MESSAGE);
    },
  });
  
  const {mutateAsync: getGoogleCalendarRedirectURL, isPending: gettingGoogleCalendarRedirectURL} = useMutation({
    mutationFn: integration.getGoogleCalendarRedirectURL,
    onSuccess: (data) => {
      window.location.href = data.data ; 
    },
    onError: (error) => {
      message.error(error?.message || INTEGRATION_MESSAGE.COMMON_ERROR_MESSAGE);
    },
  });

  const hasExchangedRef = useRef(false);

  // Handle token exchange related functionality (run once, guard StrictMode)
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    const processingIntegration = localStorage.getItem("processing_integration");

    if (!code || !processingIntegration || processingIntegration !== INTEGRATION_ID.GOOGLE_CALENDAR) {
      return;
    }

    if (hasExchangedRef.current || gettingGoogleCalendarToken) {
      return;
    }
    
    hasExchangedRef.current = true;

    (async () => {
      try {
        if (processingIntegration === INTEGRATION_ID.GOOGLE_CALENDAR){
          await getGoogleCalendarToken(window.location.href);
        }
      } catch (e) {
      } finally {
        localStorage.removeItem("processing_integration");
        const url = new URL(window.location.href);
        url.search = "";
        window.history.replaceState({}, document.title, url.toString());
      }
    })();
  }, [])
  
  // Available integrations information
  const [availableIntegrations, setAvailableIntegrations] = useState([
    {
      id: INTEGRATION_ID.GOOGLE_CALENDAR,
      name: "Google Calendar",
      description: "Meeting & Schedule data",
      icon: "https://cdn-icons-png.flaticon.com/128/5968/5968499.png",
      isLoading: gettingGoogleCalendarRedirectURL,
      isConnected: checkIntegrationIsConfigured(INTEGRATION_ID.GOOGLE_CALENDAR),
    },
  ]);

  // Connect with integration related functionality
  const handleConnect =  async (integrationId) => {
    if (integrationId === INTEGRATION_ID.GOOGLE_CALENDAR){
      localStorage.setItem("processing_integration", integrationId);
      await getGoogleCalendarRedirectURL() ; 
    }
  };

  // Disconnect with integration related functionality
  const handleDisconnect = (integrationId) => {
    if (integrationId === INTEGRATION_ID.GOOGLE_CALENDAR){
      deleteConfiguration(integrationId);
    }
  };

  return (
    <SidebarLayout
      title={appConfig.title}
      conversationHistory={conversationHistory}
      onNewConversation={() => {
        const { newChatId } = ConversationService.createNewConversation(ConversationService.getAllConversations());
        setCurrentChatId(newChatId);
      }}
      onConversationClick={(chatId) => setCurrentChatId(chatId)}
      currentChatId={currentChatId}
      searchQuery={searchQuery}
      onSearchChange={(e) => setSearchQuery(e.target.value)}
      onClearSearch={() => setSearchQuery("")}
      customActions={[]}
    >

      <div className="content-grid user-profile-content-section">
        <Card 
          title="User Information"
          className="settings-content-section"
        >
          <Space size="large" align="start">
            <Avatar size={64} style={{ backgroundColor: userInfo.avatarColor }}>
              {userInfo.avatar}
            </Avatar>
            <Flex gap={"30px"} style={{
              marginTop: "auto", 
              marginBottom: "auto"
            }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Name:</Text>
                <br />
                <Text>{userInfo.name}</Text>
              </div>
              <div>
                <Text strong>Email:</Text>
                <br />
                <Text>{userInfo.email}</Text>
              </div>
            </Flex>
          </Space>
        </Card>

        <Card 
          title="Integrations"
          className="content-section settings-integration-section"
        >
          {availableIntegrations.map((integration) => (
            <Flex className="settings-integration-option">
              <img className="settings-intergation-option-image" src={integration.icon} alt={integration.name} />
              <div className="settings-intergation-option-content">
                <Text className="settings-intergation-option-content-title" strong>{integration.name}</Text>
                <br />
                <Text className="settings-intergation-option-content-description" type="secondary" style={{ fontSize: 12 }}>
                  {integration.description}
                </Text>
              </div>
              <div className="settings-intergation-option-actions">
                {checkIntegrationIsConfigured(integration.id) ? (
                  <Button danger icon={<DisconnectOutlined />} onClick={() => handleDisconnect(integration.id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button type="primary" icon={<GoogleOutlined />} onClick={() => handleConnect(integration.id)}>
                    Connect
                  </Button>
                )}
              </div>
            </Flex>
          ))}
        </Card>
      </div>
    </SidebarLayout>
  );
}
