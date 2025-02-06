import {
  Box,
  Button,
  Container,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ handleSetToastDetails, isAuthenticated, setLogin }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkillID, setSelectedSkillID] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [exchangeSkillID, setexchangeSkillID] = useState(null);
  const [exchangeSkillName, setexchangeSkillName] = useState(null);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 8,
  };

  const tableStyle = {
    width: "100%", // Set the fixed width for the table
    tableLayout: "fixed", // Apply the table-layout: fixed property
    textAlign: "center",
  };

  const cellStyle = {
    width: "33.33%", // Set the fixed width for each column
    textAlign: "center",
  };

  const UserID = parseInt(localStorage.getItem("UserID"));
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      axios
        .post("http://localhost/skillswap/skills.php/dashboard", {
          UserID: UserID,
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      navigate("/");
    }
  }, []);

  const userSkills = data.filter((item) => item.UserID === parseInt(UserID));
  const othersSkills = data.filter((item) => item.UserID !== parseInt(UserID));

  const filteredData = othersSkills.filter((item) => {
    return (
      item.UserName.toLowerCase().includes(search.toLowerCase()) ||
      item.SkillName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const sendRequest = (selectedUserID, skillName) => {
    setSelectedSkillID(skillName);
    setSelectedUser(selectedUserID);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSkillChange = (event) => {
    setexchangeSkillID(
      userSkills.filter((skill) => skill.SkillName === event.target.value)[0]
        .SkillID
    );
    setexchangeSkillName(event.target.value);
  };

  const handleDurationChange = (event) => {
    setSelectedDuration(event.target.value);
  };

  const handleRequestSend = async () => {
    try {
      const response = await axios.post(
        "http://localhost/skillswap/skills.php/sendRequest",
        {
          user1UserID: UserID,
          user1SkillID: exchangeSkillID,
          user2UserID: selectedUser,
          user2SkillID: selectedSkillID,
          selectedDuration: selectedDuration,
        }
      );
    } catch (error) {
      console.error("Error adding skills:", error);
    }
    setModalOpen(false); // Close the modal
  };

  return (
    <Container>
      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table sx={tableStyle}>
          <TableHead>
            <TableRow>
              <TableCell sx={cellStyle}>Name</TableCell>
              <TableCell sx={cellStyle}>Skill</TableCell>
              <TableCell sx={cellStyle}>Send Request</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={cellStyle}>{row.UserName}</TableCell>
                <TableCell sx={cellStyle}>{row.SkillName}</TableCell>
                <TableCell sx={cellStyle}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      sendRequest(row.UserID, row.SkillID, row.SkillID)
                    }
                  >
                    Send Request
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleModalClose} UserID={UserID}>
        <Box sx={modalStyle}>
          <Typography>
            Send Request by exchanging {exchangeSkillName}
          </Typography>

          <Select
            value={exchangeSkillName ? exchangeSkillName : "Select"}
            onChange={handleSkillChange}
            fullWidth
          >
            {userSkills.map((row, index) => (
              <MenuItem key={index} value={row.SkillName}>
                {row.SkillName}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedDuration}
            onChange={handleDurationChange}
            fullWidth
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1} week{i !== 0 ? "s" : ""}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestSend}
            fullWidth
            disabled={exchangeSkillName === null}
            >
            Send Request
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;
