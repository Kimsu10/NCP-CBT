import React from "react";
import styled from "styled-components";

const ComplaintModal = ({ modalTitle, isComplaint, setIsComplaint }) => {
  // 신고 요청
  const handleReport = () => {
    alert("신고 성공");
  };

  const handleModal = () => {
    setIsComplaint(!isComplaint);
  };

  const closeModalOnClickOutside = e => {
    if (e.target.id === "modal-background") {
      setIsComplaint(false);
    }
  };

  return (
    <ModalBackground id="modal-background" onClick={closeModalOnClickOutside}>
      <ModalContainer>
        <ModalTitle>{modalTitle}</ModalTitle>
        <BoldText>제목</BoldText>
        <ComplaintTitle />
        <BoldText>내용</BoldText>
        <ComplaintText />
        <ButtonBox>
          <ComplaintSubmitButon>신고</ComplaintSubmitButon>
          <CancelComplaintButton>취소</CancelComplaintButton>
        </ButtonBox>
      </ModalContainer>
    </ModalBackground>
  );
};

export default ComplaintModal;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 28rem;
  height: 32rem;
  border: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  gap: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  background-color: white;
  position: absolute;
`;

const ModalTitle = styled.h1`
  margin: 1rem 0;
  text-align: center;
`;

const BoldText = styled.b`
  text-align: left;
  padding-left: 2rem;
`;

const ComplaintTitle = styled.input`
  width: 90%;
  padding: 0.5rem;
  margin: 0 auto;
`;

const ComplaintText = styled.textarea`
  width: 90%;
  min-height: 10rem;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid lightgray;
  resize: none;
  outline: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin: 0 auto;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonBox = styled.div`
  margin: 0 auto;
`;

const ComplaintSubmitButon = styled.button`
  margin-top: 1rem;
  width: 8rem;
  margin-right: 1rem;
  background-color: ${props => props.theme.mainColor};
`;

const CancelComplaintButton = styled.button`
  background-color: gray;
  width: 8rem;
`;
