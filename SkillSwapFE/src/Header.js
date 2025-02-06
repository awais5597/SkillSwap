import {
  AddCircleOutline,
  ExitToApp,
  Home,
  HourglassEmpty,
  LockOutlined,
  MailOutline,
  PersonAdd,
  Send,
} from "@mui/icons-material";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StyledAppBar = styled(AppBar)({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const StyledButton = styled(Button)({
  color: "white",
  margin: "0 8px",
});

const Header = ({ isAuthenticated, setLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.clear();
    setLogin(false);
  };
  const currentRoute = location.pathname;

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Typography variant="h4">Skill Swap</Typography>
        <div>
          {isAuthenticated ? (
            <>
              <HeaderButton
                route="/dashboard"
                currentRoute={currentRoute}
                text="Dashboard"
                icon={<Home />}
                onClick={() => navigate("/")}
              />
              <HeaderButton
                route="/addSkill"
                currentRoute={currentRoute}
                text="Add Skill"
                icon={<AddCircleOutline />}
                onClick={() => navigate("/addSkill")}
              />
              <HeaderButton
                route="/swaps"
                currentRoute={currentRoute}
                text="In Progress"
                icon={<HourglassEmpty />}
                onClick={() => navigate("/swaps")}
              />
              <HeaderButton
                route="/mySentRequests"
                currentRoute={currentRoute}
                text="My Sent Requests"
                icon={<Send />}
                onClick={() => navigate("/mySentRequests")}
              />
              <HeaderButton
                route="/myReceivedRequests"
                currentRoute={currentRoute}
                text="Received Requests"
                icon={<MailOutline />}
                onClick={() => navigate("/myReceivedRequests")}
              />
              <StyledButton onClick={handleLogout} startIcon={<ExitToApp />}>
                Logout
              </StyledButton>
            </>
          ) : (
            <>
              <HeaderButton
                route="/login"
                currentRoute={currentRoute}
                text="Login"
                icon={<LockOutlined />}
                onClick={() => navigate("/login")}
              />
              <HeaderButton
                route="/register"
                currentRoute={currentRoute}
                text="Register"
                icon={<PersonAdd />}
                onClick={() => navigate("/register")}
              />
            </>
          )}
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );
};

const HeaderButton = ({ route, currentRoute, text, icon, onClick }) => {
  return currentRoute !== route ? (
    <StyledButton onClick={onClick} startIcon={icon}>
      {text}
    </StyledButton>
  ) : null;
};

export default Header;
