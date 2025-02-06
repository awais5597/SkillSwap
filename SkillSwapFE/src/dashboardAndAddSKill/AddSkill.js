import { Delete } from "@mui/icons-material";
import { Box, Button, Container, IconButton, TextField } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "1200px",
  margin: "25px auto",
});

const StyledTextField = styled(TextField)({});

const StyledButton = styled(Button)({});

const AddSkill = ({ handleSetToastDetails }) => {
  const [skills, setSkills] = useState([""]);
  const [isValidInput, setIsValidInput] = useState(false);
  const navigate = useNavigate();

  const handleSkillChange = (index, skillName) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = skillName;
    setSkills(updatedSkills);
    const isAnyEmpty = updatedSkills.some(
      (skill) => !skill || skill.trim() === ""
    );
    setIsValidInput(!isAnyEmpty);
  };

  const handleSkillRemove = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
    const isAnyEmpty = updatedSkills.some(
      (skill) => !skill || skill.trim() === ""
    );
    setIsValidInput(!isAnyEmpty);
  };

  const addSkillField = () => {
    setSkills([...skills, ""]);
    setIsValidInput(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost/skillswap/skills.php/addSkill",
        { skillData: skills, UserID: localStorage.getItem("UserID") }
      );
      const message =
        response.data.alreadyExists > 0
          ? `Skills Added Successfully.\n ${response.data.success} new skills added, ${response.data.alreadyExists} so ignored`
          : `Skill Added Successfully.\n ${response.data.success} new skills added`;
      handleSetToastDetails({
        message: message,
        severity: "success",
      });
      navigate("/");
    } catch (error) {
      handleSetToastDetails({
        message: "API Failed",
        severity: "error",
      });
    }
  };

  return (
    <StyledContainer>
      {skills.map((skill, index) => (
        <Box key={index} sx={{ display: "flex" }}>
          <StyledTextField
            size="small"
            margin="dense"
            label="Skill"
            value={skill.skillName}
            onChange={(e) => handleSkillChange(index, e.target.value)}
          />
          {(index !== 0 || skills.length !== 1) && (
            <IconButton
              onClick={() => handleSkillRemove(index)}
              color="error"
              aria-label="Delete Skill"
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      ))}
      <StyledButton onClick={addSkillField} disabled={!isValidInput}>
        Add Another Skill
      </StyledButton>
      <StyledButton
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!isValidInput}
      >
        Submit
      </StyledButton>
    </StyledContainer>
  );
};

export default AddSkill;
