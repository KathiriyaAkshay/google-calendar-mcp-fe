import React from "react";
import { Dropdown, Button } from "antd";
import { SettingOutlined, UserOutlined, ApiOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SettingsDropdown = ({ className, iconOnly = false, ...props }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
    },
    {
      key: "integrations",
      label: "Integrations",
      icon: <ApiOutlined />,
      onClick: () => navigate("/integrations"),
    },
    {
      key: "personal",
      label: "Personal",
      icon: <UserOutlined />,
      onClick: () => navigate("/personal"),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="topRight"
      trigger={["click"]}
      overlayStyle={{
        minWidth: 150,
      }}
    >
      <Button
        type="text"
        icon={<SettingOutlined />}
        className={className}
        {...props}
      >
        {!iconOnly && "Settings"}
      </Button>
    </Dropdown>
  );
};

export default SettingsDropdown;
