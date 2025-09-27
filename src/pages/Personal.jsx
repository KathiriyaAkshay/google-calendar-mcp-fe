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
import SidebarLayout from "../components/SidebarLayout";
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
    <SidebarLayout
      title={appConfig.title}
      conversationHistory={conversationHistory}
      onNewConversation={handleNewConversation}
      onConversationClick={handleConversationClick}
      currentChatId={currentChatId}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onClearSearch={clearSearch}
      customActions={customActions}
      containerStyle={{ height: "100vh", overflow: "hidden" }}
    >
      <div className="personal-page-content">
          {/* Hero Section */}
          <div className="personal-hero-section">
            <div className="hero-background"></div>
            <div className="hero-content">
              <div className="hero-text">
                <Title level={1} className="hero-title">
                  Personal Settings
                </Title>
                <Text className="hero-subtitle">
                  Manage your profile, security, and connected services
                </Text>
              </div>
              <div className="hero-actions">
                {!editMode ? (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setEditMode(true)}
                    className="primary-action-btn"
                    size="large"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Space size="middle">
                    <Button 
                      onClick={handleCancelEdit} 
                      className="secondary-action-btn"
                      size="large"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSaveProfile}
                      className="primary-action-btn"
                      size="large"
                    >
                      Save Changes
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="personal-content-grid">
            <Row gutter={[32, 32]}>
              {/* Profile Information */}
              <Col xs={24} lg={16}>
                <div className="profile-main-section">
                  {/* Profile Header Card */}
                  <Card className="profile-header-card">
                    <div className="profile-header-content">
                      <div className="profile-avatar-section">
                        <div className="avatar-container">
                          <Avatar
                            size={120}
                            className="profile-avatar"
                          >
                            <Text className="avatar-text">KV</Text>
                          </Avatar>
                          {editMode && (
                            <Upload
                              accept="image/*"
                              showUploadList={false}
                              beforeUpload={handleUploadAvatar}
                              className="avatar-upload"
                            >
                              <Button 
                                icon={<CameraOutlined />} 
                                className="avatar-change-btn"
                                shape="circle"
                                size="large"
                              />
                            </Upload>
                          )}
                        </div>
                        <div className="profile-status">
                          <Tag className="status-tag" icon={<CheckCircleOutlined />}>
                            Active Account
                          </Tag>
                        </div>
                      </div>

                      <div className="profile-basic-info">
                        <div className="profile-name-section">
                          <Title level={3} className="profile-name">
                            {userProfile.name}
                          </Title>
                          <Text className="profile-email">
                            {userProfile.email}
                          </Text>
                        </div>
                        <div className="profile-stats">
                          <div className="stat-item">
                            <Text className="stat-value">2</Text>
                            <Text className="stat-label">Connected Accounts</Text>
                          </div>
                          <div className="stat-divider"></div>
                          <div className="stat-item">
                            <Text className="stat-value">156</Text>
                            <Text className="stat-label">Calendar Events</Text>
                          </div>
                          <div className="stat-divider"></div>
                          <div className="stat-item">
                            <Text className="stat-value">Member since</Text>
                            <Text className="stat-label">{userProfile.joinDate}</Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Profile Details Card */}
                  <Card className="profile-details-card" title="Profile Information">
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={userProfile}
                      className="profile-form"
                    >
                      <Row gutter={[24, 4]}>
                        <Col span={12}>
                          <Form.Item name="name" label="Full Name" className="form-item-modern">
                            {editMode ? (
                              <Input className="modern-input" placeholder="Enter your full name" />
                            ) : (
                              <div className="readonly-value">
                                <Text strong>{userProfile.name}</Text>
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="email" label="Email Address" className="form-item-modern">
                            {editMode ? (
                              <Input className="modern-input" placeholder="Enter your email" />
                            ) : (
                              <div className="readonly-value">
                                <Text>{userProfile.email}</Text>
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="phone" label="Phone Number" className="form-item-modern">
                            {editMode ? (
                              <Input className="modern-input" placeholder="Enter your phone number" />
                            ) : (
                              <div className="readonly-value">
                                <Text>{userProfile.phone}</Text>
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="timezone" label="Timezone" className="form-item-modern">
                            {editMode ? (
                              <Input className="modern-input" placeholder="Select your timezone" />
                            ) : (
                              <div className="readonly-value">
                                <Text>{userProfile.timezone}</Text>
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item name="bio" label="Bio" className="form-item-modern">
                            {editMode ? (
                              <TextArea 
                                rows={3} 
                                className="modern-textarea" 
                                placeholder="Tell us about yourself..."
                              />
                            ) : (
                              <div className="readonly-value">
                                <Text>{userProfile.bio}</Text>
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </div>
              </Col>

              {/* Security & Preferences Sidebar */}
              <Col xs={24} lg={8}>
                <div className="sidebar-sections">
                  {/* Security Settings */}
                  <Card className="security-card" title="Security">
                    <div className="security-items">
                      <div className="security-item">
                        <div className="security-item-header">
                          <div className="security-icon">
                            <LockOutlined />
                          </div>
                          <div className="security-info">
                            <Text strong className="security-title">Password</Text>
                            <Text className="security-description">
                              Last changed 30 days ago
                            </Text>
                          </div>
                        </div>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => setPasswordModalVisible(true)}
                          className="security-action-btn"
                        >
                          Change
                        </Button>
                      </div>

                      <div className="security-item">
                        <div className="security-item-header">
                          <div className="security-icon">
                            <SettingOutlined />
                          </div>
                          <div className="security-info">
                            <Text strong className="security-title">Active Sessions</Text>
                            <Text className="security-description">
                              2 active devices
                            </Text>
                          </div>
                        </div>
                        <Button className="security-action-btn">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="stats-card" title="Account Overview">
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-number">2</div>
                        <div className="stat-label">Connected Services</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">156</div>
                        <div className="stat-label">Calendar Events</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">30</div>
                        <div className="stat-label">Days Active</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">98%</div>
                        <div className="stat-label">Sync Success</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* Connected Accounts Section */}
            <Card className="connected-accounts-section" title="Connected Services">
              <div className="accounts-header">
                <Text className="section-description">
                  Manage your connected Google services and permissions
                </Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  className="add-account-btn"
                >
                  Connect New Service
                </Button>
              </div>

              <div className="accounts-grid">
                {connectedAccounts.map((account) => (
                  <div key={account.id} className="account-card">
                    <div className="account-header">
                      <div className="account-avatar">
                        <Avatar icon={account.avatar} size={48} className="service-avatar" />
                      </div>
                      <div className="account-info">
                        <Title level={5} className="account-name">{account.name}</Title>
                        <Text className="account-email">{account.email}</Text>
                      </div>
                      <div className="account-status">
                        <Tag className="connected-tag" icon={<CheckCircleOutlined />}>
                          Connected
                        </Tag>
                      </div>
                    </div>

                    <div className="account-details">
                      <div className="detail-row">
                        <Text className="detail-label">Connected:</Text>
                        <Text className="detail-value">{account.connectedDate}</Text>
                      </div>
                       
                        <div className="detail-row">
                          <Text className="detail-label">Last Sync:</Text>
                          <Text className="detail-value">{account.lastSync}</Text>
                        </div>
                      
                        <div className="detail-row">
                          <Text className="detail-label">Events:</Text>
                          <Text className="detail-value">{account.events}</Text>
                        </div>
                      
                    </div>

                    <div className="account-permissions">
                      <Text className="permissions-label">Permissions:</Text>
                      <div className="permissions-tags">
                        {account.permissions.map((permission, index) => (
                          <Tag key={index} className="permission-tag">
                            {permission}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div className="account-actions">
                      <Button 
                        icon={<SettingOutlined />}
                        className="configure-btn"
                      >
                        Configure
                      </Button>
                      <Button
                        danger
                        onClick={() => handleDisconnectAccount(account.id)}
                        className="disconnect-btn"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

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
    </SidebarLayout>
  );
}
