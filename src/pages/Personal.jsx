import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Button,
  Input,
  Space,
  Avatar,
  Upload,
  message,
  Modal,
  Form,
  Divider,
  Tag,
  Row,
  Col,
  Alert,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  SaveOutlined,
  LockOutlined,
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  PlusOutlined,
  SearchOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import CommonSidebar from "../components/CommonSidebar";
import { useTheme } from "../contexts/ThemeContext";
import ConversationService from "../data/conversationService";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Personal() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const appConfig = ConversationService.getAppConfig();
  const [currentChatId, setCurrentChatId] = useState(appConfig.defaultChatId);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState(ConversationService.getAllConversations());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [userProfile, setUserProfile] = useState({
    name: "Keyur Vaghasiya",
    email: "keyur@alysio.ai",
    bio: "AI enthusiast and developer working on Google Calendar MCP integration",
    phone: "+1 (555) 123-4567",
    timezone: "UTC-8 (Pacific Time)",
    language: "English",
    joinDate: "2025-01-15",
  });

  const [connectedAccounts] = useState([
    {
      id: "google",
      name: "Google Account",
      email: "keyur@alysio.ai",
      provider: "Google",
      status: "connected",
      connectedDate: "2025-09-10",
      permissions: ["Calendar", "Gmail", "Drive"],
      avatar: <GoogleOutlined style={{ color: "#4285f4" }} />,
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      email: "keyur@alysio.ai",
      provider: "Google Calendar",
      status: "connected",
      connectedDate: "2025-09-10",
      permissions: ["Read Events", "Create Events", "Update Events"],
      avatar: <GoogleOutlined style={{ color: "#4285f4" }} />,
      events: 156,
      lastSync: "2 minutes ago",
    },
  ]);

  const conversationHistory =
    ConversationService.getConversationHistory(currentChatId);

  const userInfo = ConversationService.getUserInfo();

  const handleNewConversation = () => {
    const { newChatId, updatedChats } =
      ConversationService.createNewConversation(chats);
    setChats(updatedChats);
    setCurrentChatId(newChatId);
    message.success("New conversation started!");
  };

  const handleConversationClick = (chatId) => {
    navigate("/home", { state: { selectedChatId: chatId } });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSaveProfile = () => {
    form.validateFields().then((values) => {
      setUserProfile({ ...userProfile, ...values });
      setEditMode(false);
      message.success("Profile updated successfully!");
    });
  };

  const handleCancelEdit = () => {
    form.setFieldsValue(userProfile);
    setEditMode(false);
  };

  const handleChangePassword = () => {
    passwordForm.validateFields().then((values) => {
      if (values.newPassword !== values.confirmPassword) {
        message.error("New passwords do not match!");
        return;
      }

      // Simulate password change
      message.success("Password changed successfully!");
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    });
  };

  const handleUploadAvatar = (file) => {
    message.success("Profile picture updated successfully!");
    return false; // Prevent actual upload
  };

  const handleDisconnectAccount = (accountId) => {
    Modal.confirm({
      title: "Disconnect Account",
      content:
        "Are you sure you want to disconnect this account? You may lose access to some features.",
      okText: "Disconnect",
      okType: "danger",
      onOk: () => {
        message.warning("Account disconnected successfully!");
      },
    });
  };

  const customActions = [
    {
      icon: <UserOutlined />,
      tooltip: "Profile Settings",
      onClick: () => setEditMode(!editMode),
    },
    {
      icon: <LockOutlined />,
      tooltip: "Change Password",
      onClick: () => setPasswordModalVisible(true),
    },
    {
      icon: <GoogleOutlined />,
      tooltip: "Connected Accounts",
      onClick: () => {},
    },
    {
      icon: <EditOutlined />,
      tooltip: "Edit Profile",
      onClick: () => setEditMode(!editMode),
    },
  ];

  return (
    <div className="dashboard-container" data-theme={theme} style={{ height: "100vh", overflow: "hidden" }}>
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
                marginBottom: 24,
              }}
            >
              <div>
                <Title level={2} className="page-title">
                  <UserOutlined style={{ marginRight: 8 }} />
                  Personal Information
                </Title>
                <Text className="page-subtitle">
                  Manage your profile, connected accounts, and security settings
                </Text>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {!editMode ? (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setEditMode(true)}
                    style={{ height: 40 }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Space>
                    <Button 
                      onClick={handleCancelEdit} 
                      style={{ 
                        height: 40,
                        backgroundColor: 'var(--bs-card-bg)',
                        borderColor: 'var(--bs-border-color)',
                        color: 'var(--bs-body-color)'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSaveProfile}
                      style={{ height: 40 }}
                    >
                      Save Changes
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Row gutter={[24, 24]}>
              {/* Profile Information */}
              <Col xs={24} lg={16}>
                <Card className="content-section">
                  <Title level={4} style={{ margin: "0 0 20px 0" }}>
                    Profile Information
                  </Title>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 20,
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Avatar
                        size={80}
                        style={{ backgroundColor: "#2f80ed", marginBottom: 8 }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "24px",
                          }}
                        >
                          KV
                        </Text>
                      </Avatar>
                      {editMode && (
                        <Upload
                          accept="image/*"
                          showUploadList={false}
                          beforeUpload={handleUploadAvatar}
                        >
                          <Button icon={<CameraOutlined />} size="small">
                            Change Photo
                          </Button>
                        </Upload>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <Form
                        form={form}
                        layout="vertical"
                        initialValues={userProfile}
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item name="name" label="Full Name">
                              {editMode ? (
                                <Input />
                              ) : (
                                <Text strong style={{ fontSize: 16 }}>
                                  {userProfile.name}
                                </Text>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="email" label="Email">
                              {editMode ? (
                                <Input />
                              ) : (
                                <Text>{userProfile.email}</Text>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item name="phone" label="Phone">
                              {editMode ? (
                                <Input />
                              ) : (
                                <Text>{userProfile.phone}</Text>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="timezone" label="Timezone">
                              {editMode ? (
                                <Input />
                              ) : (
                                <Text>{userProfile.timezone}</Text>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item name="bio" label="Bio">
                          {editMode ? (
                            <TextArea rows={3} />
                          ) : (
                            <Text>{userProfile.bio}</Text>
                          )}
                        </Form.Item>
                      </Form>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <Title level={5}>Account Information</Title>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <Text strong>Member since:</Text>
                        <Text>{userProfile.joinDate}</Text>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <Text strong>Language:</Text>
                        <Text>{userProfile.language}</Text>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <Text strong>Account Status:</Text>
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          Active
                        </Tag>
                      </div>
                    </Space>
                  </div>
                </Card>
              </Col>

              {/* Security Settings */}
              <Col xs={24} lg={8}>
                <Card className="content-section">
                  <Title level={4}>Security Settings</Title>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="large"
                  >
                    <div>
                      <Text strong>Password</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Last changed 30 days ago
                      </Text>
                      <br />
                      <Button
                        icon={<LockOutlined />}
                        onClick={() => setPasswordModalVisible(true)}
                        style={{ 
                          marginTop: 8,
                          backgroundColor: 'var(--auth-primary-color)',
                          borderColor: 'var(--auth-primary-color)',
                          color: 'white'
                        }}
                        className="dark-theme-button"
                      >
                        Change Password
                      </Button>
                    </div>

                    <Divider style={{ margin: "12px 0" }} />

                    <div>
                      <Text strong>Two-Factor Authentication</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Not enabled
                      </Text>
                      <br />
                      <Button 
                        style={{ 
                          marginTop: 8,
                          backgroundColor: 'var(--auth-primary-color)',
                          borderColor: 'var(--auth-primary-color)',
                          color: 'white'
                        }}
                        className="dark-theme-button"
                      >
                        Enable 2FA
                      </Button>
                    </div>

                    <Divider style={{ margin: "12px 0" }} />

                    <div>
                      <Text strong>Login Sessions</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        2 active sessions
                      </Text>
                      <br />
                      <Button 
                        style={{ 
                          marginTop: 8,
                          backgroundColor: 'var(--auth-primary-color)',
                          borderColor: 'var(--auth-primary-color)',
                          color: 'white'
                        }}
                        className="dark-theme-button"
                      >
                        Manage Sessions
                      </Button>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Connected Accounts */}
            <Card className="content-section" style={{ marginTop: 24 }}>
              <Title level={4}>Connected Accounts</Title>
              <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
                Manage your connected Google accounts and services
              </Text>

              <Row gutter={[16, 16]}>
                {connectedAccounts.map((account) => (
                  <Col xs={24} md={12} key={account.id}>
                    <Card
                      size="small"
                      style={{ border: "1px solid var(--bs-border-color)" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 12,
                        }}
                      >
                        <Avatar icon={account.avatar} size="large" />
                        <div style={{ flex: 1 }}>
                          <Title level={5} style={{ margin: 0 }}>
                            {account.name}
                          </Title>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {account.email}
                          </Text>
                        </div>
                        <Tag 
                          icon={<CheckCircleOutlined />}
                          style={{
                            backgroundColor: 'var(--bs-success)',
                            borderColor: 'var(--bs-success)',
                            color: 'white'
                          }}
                        >
                          Connected
                        </Tag>
                      </div>

                      <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size="small"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text strong style={{ fontSize: "12px" }}>
                            Connected:
                          </Text>
                          <Text style={{ fontSize: "12px" }}>
                            {account.connectedDate}
                          </Text>
                        </div>

                        
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ fontSize: "12px" }}>
                              Last Sync:
                            </Text>
                            <Text style={{ fontSize: "12px" }}>
                              {account.lastSync}|| NA
                            </Text>
                          </div>
                        

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ fontSize: "12px" }}>
                              Events:
                            </Text>
                            <Text style={{ fontSize: "12px" }}>
                              {account.events} || 0
                            </Text>
                          </div>

                        <div>
                          <Text strong style={{ fontSize: "12px" }}>
                            Permissions:
                          </Text>
                          <div style={{ marginTop: 4 }}>
                            {account.permissions.map((permission, index) => (
                              <Tag
                                key={index}
                                size="small"
                                style={{ 
                                  margin: "1px 2px",
                                  backgroundColor: 'var(--bs-primary-bg-subtle)',
                                  borderColor: 'var(--auth-primary-color)',
                                  color: 'var(--auth-primary-color)',
                                  border: '1px solid var(--auth-primary-color)'
                                }}
                              >
                                {permission}
                              </Tag>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginTop: 12, textAlign: "right" }}>
                          <Space>
                            <Button 
                              size="small" 
                              icon={<SettingOutlined />}
                              style={{
                                backgroundColor: 'var(--auth-primary-color)',
                                borderColor: 'var(--auth-primary-color)',
                                color: 'white'
                              }}
                              className="dark-theme-button"
                            >
                              Configure
                            </Button>
                            <Button
                              size="small"
                              danger
                              onClick={() => handleDisconnectAccount(account.id)}
                              style={{
                                backgroundColor: 'var(--bs-danger)',
                                borderColor: 'var(--bs-danger)',
                                color: 'white'
                              }}
                            >
                              Disconnect
                            </Button>
                          </Space>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Change Password Modal */}
            <Modal
              title="Change Password"
              open={passwordModalVisible}
              onOk={handleChangePassword}
              onCancel={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
              }}
              okText="Change Password"
            >
              <Form form={passwordForm} layout="vertical">
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your current password",
                    },
                  ]}
                >
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: "Please enter a new password" },
                    { min: 8, message: "Password must be at least 8 characters" },
                  ]}
                >
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
                  rules={[
                    { required: true, message: "Please confirm your new password" },
                  ]}
                >
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
