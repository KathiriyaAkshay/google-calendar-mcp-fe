import React from "react";
import { SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SettingsDropdown = ({ className, iconOnly = false, ...props }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/settings");
  };

  return (
    <div 
      className={`settings-item ${className || ""}`}
      onClick={handleClick}
      {...props}
    >
      <SettingOutlined className="settings-icon" />
      {!iconOnly && <span className="settings-text">Settings</span>}
    </div>
  );
};

export default SettingsDropdown;
