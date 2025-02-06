import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#F57C00",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      margin: "1rem 0",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "bold",
      margin: "1rem 0",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
  spacing: 8,
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none",
        borderRadius: 8,
      },
    },
    MuiTextField: {
      root: {
        margin: "0.5rem 0",
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#1976D2",
        },
      },
    },
  },
});

export default Theme;
