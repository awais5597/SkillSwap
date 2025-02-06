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

const MyReceivedRequests = ({ isAuthenticated }) => {
  const [data, setData] = useState([]);
  const [callApi, setCallApi] = useState(true);
  const UserID = parseInt(localStorage.getItem("UserID"));
  const navigate = useNavigate();
  const requestStatusArray = {
    "-1": "Rejected",
    0: "Pending",
    1: "Accepted",
  };
  const callApiFunction = () => {
    axios
      .post("http://localhost/skillswap/skillsSwap.php/myreceivedrequests", {
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
    if (isAuthenticated && callApi) {
      callApiFunction();
    } else {
      navigate("/dashboard");
    }
  }, [callApi]);

  const handleAccept = (requestid) => {
    axios
      .post("http://localhost/skillswap/skillsSwap.php/acceptRequest", {
        requestId: requestid,
      })
      .then((response) => {
        if (response.data.status === 1 || response.data.status === 0) {
          setCallApi(true);
          callApiFunction();
        }
      })
      .catch((error) => {
        callApiFunction();
        console.error("Error fetching data:", error);
      });
  };

  const handleReject = (requestid) => {
    axios
      .post("http://localhost/skillswap/skillsSwap.php/rejectRequest", {
        requestId: requestid,
      })
      .then((response) => {
        if (response.data.status === 1 || response.data.status === 0) {
          setCallApi(true);
          callApiFunction();
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <TableContainer component={Paper} sx={{ maxWidth: "1200px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Request ID
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                My Name
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Partner Name
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                My Skill For Swap
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Partner Skill
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Status
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "600" }}>
                Take Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.requestid}>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.requestid}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.user1name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.user2name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.user1skill}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.user2skill}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {requestStatusArray[row.accepted]}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {requestStatusArray[row.accepted] === "Pending" ? (
                    <Box display="flex" gap="8px">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(row.requestid)}
                        style={{ flex: 1 }}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAccept(row.requestid)}
                        style={{ flex: 1 }}
                      >
                        Accept
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      disabled
                      style={{ flex: 1 }}
                    >
                      {requestStatusArray[row.accepted]}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyReceivedRequests;
