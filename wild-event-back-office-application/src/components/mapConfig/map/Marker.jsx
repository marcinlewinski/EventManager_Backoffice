import React from "react";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
0%, 100% {
  transform: scale(1);
} 
50% {
  transform: scale(1.2);
}
`;

const StyledIconButton = styled(IconButton)`
  &:hover {
    animation: ${pulse} 1s infinite;
  }
`;

const Marker = ({ children }) => {
  return (
    <StyledIconButton className="marker">
      {children}
    </StyledIconButton>
  );
};

export default Marker;
