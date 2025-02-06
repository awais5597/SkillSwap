import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StyledTextField = styled(TextField)({
  marginBottom: "1rem",
});

const Login = ({ handleSetToastDetails, setLogin, setisAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("UserID");
    if (id !== null) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/skillswap/userManagement.php/login",
        formData
      );
      if (response.data.UserID !== null) {
        localStorage.setItem("UserID", response.data.UserID);
        handleSetToastDetails({
          message: `${response.data.FirstName} has logged in successfully`,
          severity: "success",
        });
        setLogin(true);
        setisAuthenticated(true);
        navigate("/dashboard");
      } else {
        handleSetToastDetails({
          message: "Details Not Found",
          severity: "error",
        });
      }
    } catch (error) {
      handleSetToastDetails({
        message: "API Failure",
        severity: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <StyledTextField
            size="small"
            margin="dense"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <StyledTextField
            size="small"
            margin="dense"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
