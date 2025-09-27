import React, { useState } from "react";
import {
  Typography,
  Card,
  Switch,
  Select,
  Button,
  Input,
  Space,
  Upload,
  message,
  Slider,
  Radio,
  Alert,
  Divider,
} from "antd";
import { Link } from "react-router-dom";
import {
  SettingOutlined,
  BellOutlined,
  LockOutlined,
  BgColorsOutlined,
  GlobalOutlined,
  SaveOutlined,
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import SidebarLayout from "../components/SidebarLayout";
import ConversationService from "../data/conversationService";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Settings() {
  const appConfig = ConversationService.getAppConfig();
  const [currentChatId, setCurrentChatId] = useState(appConfig.defaultChatId);
  const [searchQuery, setSearchQuery] = useState("");
  const conversationHistory = ConversationService.getConversationHistory(currentChatId);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      desktop: false,
      mobile: true,
      sound: true,
      frequency: "immediate",
    },
    appearance: {
      theme: "dark",
      language: "en",
      fontSize: "medium",
      sidebarCollapsed: false,
      compactMode: false,
    },
    privacy: {
      profileVisible: true,
      activityTracking: false,
      dataSharing: true,
      analytics: true,
    },
    calendar: {
      defaultView: "week",
      startWeek: "monday",
      timeFormat: "12h",
      timezone: "auto",
      workingHours: [9, 17],
    },
    advanced: {
      autoSave: true,
      backupFrequency: "daily",
      debugMode: false,
      experimentalFeatures: false,
    },
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    message.success("Settings saved successfully!");
  };

  const handleReset = () => {
    message.warning("Settings reset to default values!");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings-export.json';
    link.click();
    message.success("Settings exported successfully!");
  };

  const customActions = [
    {
      icon: <BellOutlined />,
      tooltip: "Notification Settings",
      onClick: () => message.info("Notification settings"),
    },
    {
      icon: <BgColorsOutlined />,
      tooltip: "Appearance Settings",
      onClick: () => message.info("Appearance settings"),
    },
    {
      icon: <LockOutlined />,
      tooltip: "Privacy Settings",
      onClick: () => message.info("Privacy settings"),
    },
    {
      icon: <SettingOutlined />,
      tooltip: "Advanced Settings",
      onClick: () => message.info("Advanced settings"),
    },
  ];

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
      customActions={customActions}
    >
      <div className="content-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={2} className="page-title">
              <SettingOutlined style={{ marginRight: 8 }} />
              Application Settings
            </Title>
            <Text className="page-subtitle">
              Configure application behavior, notifications, and preferences
            </Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Reset to Default
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              Export Settings
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Save Changes
            </Button>
          </Space>
        </div>
      </div>

      <div className="content-grid">
        {/* Notification Settings */}
        <Card 
          title={
            <Space>
              <BellOutlined />
              <span>Notifications</span>
            </Space>
          }
          className="content-section"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Email Notifications</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Receive event reminders and updates via email
                </Text>
              </div>
              <Switch 
                checked={settings.notifications.email}
                onChange={(checked) => handleSettingChange("notifications", "email", checked)}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Desktop Notifications</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Show browser notifications for events
                </Text>
              </div>
              <Switch 
                checked={settings.notifications.desktop}
                onChange={(checked) => handleSettingChange("notifications", "desktop", checked)}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Notification Sound</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Play sound for notifications
                </Text>
              </div>
              <Switch 
                checked={settings.notifications.sound}
                onChange={(checked) => handleSettingChange("notifications", "sound", checked)}
              />
            </div>
            
            <div>
              <Text strong>Notification Frequency</Text>
              <Select 
                value={settings.notifications.frequency}
                onChange={(value) => handleSettingChange("notifications", "frequency", value)}
                style={{ width: "100%", marginTop: 4 }}
              >
                <Option value="immediate">Immediate</Option>
                <Option value="hourly">Hourly Digest</Option>
                <Option value="daily">Daily Digest</Option>
                <Option value="weekly">Weekly Summary</Option>
              </Select>
            </div>
          </Space>
        </Card>

        {/* Appearance Settings */}
        <Card 
          title={
            <Space>
              <BgColorsOutlined />
              <span>Appearance</span>
            </Space>
          }
          className="content-section"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Text strong>Theme</Text>
              <Radio.Group 
                value={settings.appearance.theme}
                onChange={(e) => handleSettingChange("appearance", "theme", e.target.value)}
                style={{ width: "100%", marginTop: 8 }}
              >
                <Radio.Button value="light">Light</Radio.Button>
                <Radio.Button value="dark">Dark</Radio.Button>
                <Radio.Button value="auto">Auto</Radio.Button>
              </Radio.Group>
            </div>
            
            <div>
              <Text strong>Font Size</Text>
              <Select 
                value={settings.appearance.fontSize}
                onChange={(value) => handleSettingChange("appearance", "fontSize", value)}
                style={{ width: "100%", marginTop: 4 }}
              >
                <Option value="small">Small</Option>
                <Option value="medium">Medium</Option>
                <Option value="large">Large</Option>
                <Option value="extra-large">Extra Large</Option>
              </Select>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Compact Mode</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Reduce spacing and padding
                </Text>
              </div>
              <Switch 
                checked={settings.appearance.compactMode}
                onChange={(checked) => handleSettingChange("appearance", "compactMode", checked)}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Sidebar Collapsed by Default</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Start with sidebar collapsed
                </Text>
              </div>
              <Switch 
                checked={settings.appearance.sidebarCollapsed}
                onChange={(checked) => handleSettingChange("appearance", "sidebarCollapsed", checked)}
              />
            </div>
          </Space>
        </Card>

        {/* Calendar Settings */}
        <Card 
          title={
            <Space>
              <GlobalOutlined />
              <span>Calendar Preferences</span>
            </Space>
          }
          className="content-section"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Text strong>Default Calendar View</Text>
              <Select 
                value={settings.calendar.defaultView}
                onChange={(value) => handleSettingChange("calendar", "defaultView", value)}
                style={{ width: "100%", marginTop: 4 }}
              >
                <Option value="day">Day View</Option>
                <Option value="week">Week View</Option>
                <Option value="month">Month View</Option>
                <Option value="agenda">Agenda View</Option>
              </Select>
            </div>
            
            <div>
              <Text strong>Week Starts On</Text>
              <Select 
                value={settings.calendar.startWeek}
                onChange={(value) => handleSettingChange("calendar", "startWeek", value)}
                style={{ width: "100%", marginTop: 4 }}
              >
                <Option value="sunday">Sunday</Option>
                <Option value="monday">Monday</Option>
              </Select>
            </div>
            
            <div>
              <Text strong>Time Format</Text>
              <Radio.Group 
                value={settings.calendar.timeFormat}
                onChange={(e) => handleSettingChange("calendar", "timeFormat", e.target.value)}
                style={{ width: "100%", marginTop: 8 }}
              >
                <Radio.Button value="12h">12 Hour</Radio.Button>
                <Radio.Button value="24h">24 Hour</Radio.Button>
              </Radio.Group>
            </div>
            
            <div>
              <Text strong>Working Hours</Text>
              <div style={{ marginTop: 8 }}>
                <Slider
                  range
                  min={0}
                  max={24}
                  value={settings.calendar.workingHours}
                  onChange={(value) => handleSettingChange("calendar", "workingHours", value)}
                  marks={{
                    0: '12 AM',
                    6: '6 AM',
                    12: '12 PM',
                    18: '6 PM',
                    24: '12 AM'
                  }}
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* Privacy Settings */}
        <Card 
          title={
            <Space>
              <LockOutlined />
              <span>Privacy & Data</span>
            </Space>
          }
          className="content-section"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Text strong>Password & Security</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Manage your account password and security settings
              </Text>
              <br />
              <Link to="/password-config">
                <Button type="primary" icon={<LockOutlined />} style={{ marginTop: 8 }}>
                  Configure Password Settings
                </Button>
              </Link>
            </div>
            
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Activity Tracking</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Track usage analytics to improve experience
                </Text>
              </div>
              <Switch 
                checked={settings.privacy.activityTracking}
                onChange={(checked) => handleSettingChange("privacy", "activityTracking", checked)}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Data Sharing</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Share anonymized data for product improvements
                </Text>
              </div>
              <Switch 
                checked={settings.privacy.dataSharing}
                onChange={(checked) => handleSettingChange("privacy", "dataSharing", checked)}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Analytics</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Enable usage analytics and reporting
                </Text>
              </div>
              <Switch 
                checked={settings.privacy.analytics}
                onChange={(checked) => handleSettingChange("privacy", "analytics", checked)}
              />
            </div>
          </Space>
        </Card>

        {/* Advanced Settings */}
        <Card 
          title={
            <Space>
              <SettingOutlined />
              <span>Advanced</span>
            </Space>
          }
          className="content-section"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Auto-Save</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Automatically save changes as you work
                </Text>
              </div>
              <Switch 
                checked={settings.advanced.autoSave}
                onChange={(checked) => handleSettingChange("advanced", "autoSave", checked)}
              />
            </div>
            
            <div>
              <Text strong>Backup Frequency</Text>
              <Select 
                value={settings.advanced.backupFrequency}
                onChange={(value) => handleSettingChange("advanced", "backupFrequency", value)}
                style={{ width: "100%", marginTop: 4 }}
              >
                <Option value="never">Never</Option>
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
              </Select>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Debug Mode</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Enable detailed logging and error reporting
                </Text>
              </div>
              <Switch 
                checked={settings.advanced.debugMode}
                onChange={(checked) => handleSettingChange("advanced", "debugMode", checked)}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Experimental Features</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Enable beta features (may be unstable)
                </Text>
              </div>
              <Switch 
                checked={settings.advanced.experimentalFeatures}
                onChange={(checked) => handleSettingChange("advanced", "experimentalFeatures", checked)}
              />
            </div>
          </Space>
        </Card>

        {/* Import/Export Settings */}
        <Card 
          title={
            <Space>
              <ExportOutlined />
              <span>Import/Export</span>
            </Space>
          }
          className="content-section"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Alert
              message="Settings Backup"
              description="Export your settings to backup your configuration or import from a previous backup."
              type="info"
              showIcon
            />
            
            <div>
              <Text strong>Export Settings</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Download your current settings as a JSON file
              </Text>
              <br />
              <Button icon={<ExportOutlined />} onClick={handleExport} style={{ marginTop: 8 }}>
                Export Current Settings
              </Button>
            </div>
            
            <div>
              <Text strong>Import Settings</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Upload a settings file to restore your configuration
              </Text>
              <br />
              <Upload
                accept=".json"
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    try {
                      const importedSettings = JSON.parse(e.target.result);
                      setSettings(importedSettings);
                      message.success("Settings imported successfully!");
                    } catch (error) {
                      message.error("Invalid settings file!");
                    }
                  };
                  reader.readAsText(file);
                  return false;
                }}
              >
                <Button icon={<ImportOutlined />} style={{ marginTop: 8 }}>
                  Import Settings File
                </Button>
              </Upload>
            </div>
          </Space>
        </Card>
      </div>
    </SidebarLayout>
  );
}
