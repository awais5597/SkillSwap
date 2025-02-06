import { Box, Button, Modal, TextField, styled } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ChatModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatContainer = styled("div")`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 400px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ChatsBox = styled(Box)`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  max-height: 300px; /* Limit the height for a scrollbar */
  overflow-y: auto; /* Add a scrollbar when content exceeds container height */
`;

const ChatMessage = styled("div")`
  background-color: #f0f0f0;
  padding: 8px;
  margin: 4px 0;
  border-radius: 4px;
  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
`;

const ChatInput = styled(TextField)`
  margin-top: 16px;
`;

const SendButton = styled(Button)`
  margin-top: 16px;
`;

const ChatWindow = ({ modalOpen, handleModalClose, requestid, UserID }) => {
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchChats = () => {
    axios
      .post("http://localhost/skillswap/skillsSwap.php/chats", {
        requestid: requestid,
      })
      .then((response) => {
        setChats(JSON.parse(response.data[0].chats));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    if (modalOpen) {
      fetchChats();
    }
  }, [modalOpen, requestid]);

  const onSend = () => {
    axios
      .post("http://localhost/skillswap/skillsSwap.php/sendMessage", {
        requestid: requestid,
        chat: {
          senderId: UserID,
          message: newMessage,
        },
      })
      .then(() => {
        setNewMessage(""); // Clear the input field after sending
        fetchChats(); // Refresh chat messages after sending
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <ChatModal open={modalOpen} onClose={handleModalClose}>
      <ChatContainer>
        <ChatsBox>
          {chats &&
            chats.map((chat, index) => {
              return (
                <ChatMessage key={index} isUser={chat.senderId === UserID}>
                  {chat.message}
                </ChatMessage>
              );
            })}
        </ChatsBox>

        <ChatInput
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <SendButton
          variant="contained"
          onClick={() => {
            fetchChats();
          }}
        >
          Fetch New Chats
        </SendButton>
        <SendButton
          variant="contained"
          onClick={() => {
            onSend(newMessage);
            setNewMessage("");
          }}
        >
          Send
        </SendButton>
        <SendButton
          variant="contained"
          onClick={() => {
            handleModalClose();
          }}
        >
          Close
        </SendButton>
      </ChatContainer>
    </ChatModal>
  );
};

export default ChatWindow;
