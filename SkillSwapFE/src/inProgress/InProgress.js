import {
  Box,
  Button,
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
import ChatWindow from "../chatWindow/ChatWindow";

const InProgress = () => {
  const [data, setData] = useState([]);
  const UserID = parseInt(localStorage.getItem("UserID"));
  useEffect(() => {
    axios
      .post("http://localhost/skillswap/skillsSwap.php/inProgress", {
        UserID: UserID,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [requestid, setRequestid] = useState("");
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleChat = (requestid) => {
    setRequestid(requestid);
    setModalOpen(true);
  };

  const getProgress = (startDate, endDate) => {
    const today = new Date();
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    const progress = parseFloat(
      ((Math.abs(today - sd) / Math.abs(ed - sd)) * 100).toFixed(2)
    );
    if (progress > 100) return "Skill Swapped Successfully";
    return `${progress} %`;
  };
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <ChatWindow
        modalOpen={modalOpen}
        requestid={requestid}
        handleModalClose={handleModalClose}
        UserID={UserID}
      />
      <TableContainer component={Paper} sx={{ maxWidth: "1200px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Partner Name
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Partner Skill
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Start Date
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                End Date
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Progress
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Chat With Partner
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const progress = getProgress(row.startDate, row.endDate);
              let isDone = false;
              if (progress === "Skill Swapped Successfully") {
                isDone = true;
              }
              return (
                <TableRow
                  key={row.requestid}
                  sx={{
                    // backgroundColor: isDone ? "#fffaaa" : "#b0ffaa",
                    backgroundColor: isDone ? "#afafaf" : "#ffffff",
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.user2name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.user2skill}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.startDate}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.endDate}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{progress}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleChat(row.requestId);
                      }}
                      style={{ flex: 1 }}
                    >
                      Chat
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InProgress;
