import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyRequests = ({ isAuthenticated }) => {
  const [data, setData] = useState([]);
  const UserID = parseInt(localStorage.getItem("UserID"));
  const navigate = useNavigate();
  const requestStatusArray = {
    "-1": "Rejected",
    0: "Pending",
    1: "Accepted",
  };
  const callApi = () => {
    axios
      .post("http://localhost/skillswap/skillsSwap.php/mysentrequests", {
        UserID: UserID,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    if (isAuthenticated) {
      callApi();
    } else {
      navigate("/");
    }
  }, []);
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <TableContainer component={Paper} sx={{ maxWidth: "1200px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request ID</TableCell>
              <TableCell>My Name</TableCell>
              <TableCell>Partner Name</TableCell>
              <TableCell>My Skill For Swap</TableCell>
              <TableCell>Partner Skill</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.requestid}>
                <TableCell>{row.requestid}</TableCell>
                <TableCell>{row.user1name}</TableCell>
                <TableCell>{row.user2name}</TableCell>
                <TableCell>{row.user1skill}</TableCell>
                <TableCell>{row.user2skill}</TableCell>
                <TableCell>{requestStatusArray[row.accepted]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyRequests;
