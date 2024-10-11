import React from "react";
import styled from "styled-components";

const ComplaintModal = () => {
  return (
    <>
      <ModalContainer>
        <ComplaintTitle />
        <ComplaintText />
      </ModalContainer>
    </>
  );
};

export default ComplaintModal;

const ModalContainer = styled.div`
  width: 20rem;
  height: 20rem;
  border: 1px solid gray;
`;

const ComplaintTitle = styled.input``;

const ComplaintText = styled.input``;
