import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import axiosConfig from "../../utils/axiosConfig";

const ComplaintModal = ({
  modalTitle,
  isComplaint,
  setIsComplaint,
  subjectId,
  questionId,
}) => {
  const [complaint, setComplaint] = useState({
    title: "",
    content: "",
  });

  const handleModal = () => {
    setIsComplaint(!isComplaint);
  };

  const closeModalOnClickOutside = e => {
    if (e.target.id === "modal-background") {
      setIsComplaint(false);
    }
  };

  const handleComplaintReport = async () => {
    try {
      const PracticeComplaintsDTO = {
        subjectId: subjectId,
        subjectQuestionId: questionId,
        title: complaint.title,
        content: complaint.content,
      };

      const res = await axiosConfig.post(
        "/practice-complaints",
        PracticeComplaintsDTO,
      );

      if (res.status === 200) {
        alert("문제 오류 접수 완료");
        setIsComplaint(!isComplaint);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const message = err.response.data;
        setIsComplaint(!isComplaint);

        if (message === "이미 해당 문제에 대한 오류 신고가 접수되었습니다.") {
          alert("이미 해당 문제에 대한 오류 신고가 접수되었습니다.");
        } else if (message === "사용자 정보가 없습니다.") {
          alert("토큰만료. 다시 로그인 해주세요.");
        } else {
          alert("문제 접수 실패: " + message);
        }
      } else {
        alert("로그인시 이용 가능합니다.");
        setIsComplaint(!isComplaint);
        console.error("error occured: ", err);
      }
    }
  };

  return (
    <ModalBackground id="modal-background" onClick={closeModalOnClickOutside}>
      <ModalContainer>
        <ModalTitle>{modalTitle}</ModalTitle>
        <BoldText>제목</BoldText>
        <ComplaintTitle
          value={complaint.title}
          onChange={e =>
            setComplaint(prev => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
        <BoldText>내용</BoldText>
        <ComplaintText
          value={complaint.content}
          onChange={e =>
            setComplaint(prev => ({
              ...prev,
              content: e.target.value,
            }))
          }
        />
        <ButtonBox>
          <ComplaintSubmitButon onClick={handleComplaintReport}>
            신고
          </ComplaintSubmitButon>
          <CancelComplaintButton onClick={handleModal}>
            취소
          </CancelComplaintButton>
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
