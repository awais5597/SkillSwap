import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const StyledTextField = styled(TextField)({
  marginBottom: "1rem",
});
const Register = ({ handleSetToastDetails }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    city: "",
    country: "",
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.mobile
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const response = await axios
        .post(
          "http://localhost/skillswap/userManagement.php/register",
          formData
        )
        .then(function (response) {
          if (response.data.status === 1) {
            handleSetToastDetails({
              message: "Registration Successful",
              severity: "success",
            });
            navigate("/login");
          } else {
            handleSetToastDetails({
              message: "Registration failed",
              severity: "error",
            });
          }
        });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            size="small"
            margin="dense"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            onChange={handleChange}
          />
          <StyledTextField
            size="small"
            margin="dense"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            onChange={handleChange}
          />
          <StyledTextField
            size="small"
            margin="dense"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
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
            onChange={handleChange}
          />
          <StyledTextField
            size="small"
            margin="dense"
            fullWidth
            id="mobile"
            label="Mobile"
            name="mobile"
            inputProps={{
              pattern: "[0-9]*",
              maxLength: 10,
            }}
            helperText="Accepts only 10 digits"
            onChange={handleChange}
          />
          <StyledTextField
            size="small"
            margin="dense"
            fullWidth
            id="city"
            label="City"
            name="city"
            onChange={handleChange}
          />
          <StyledTextField
            size="small"
            margin="dense"
            fullWidth
            id="country"
            label="Country"
            name="country"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </form>
      </div>
    </Container>
  );
};
export default Register;
