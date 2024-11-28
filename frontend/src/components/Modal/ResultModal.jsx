import { useState } from "react";
import styled from "styled-components";

const ResultModal = ({ setModal, handleGetResult }) => {
  const [loading, setLoading] = useState(false);

  const handleModal = () => {
    setModal(false);
  };

  const closeModalOnClickOutside = e => {
    if (e.target.id === "modal-background") {
      setModal(false);
    }
  };

  // 결과 확인 버튼 클릭 시 실행되는 함수
  const handleResultCheck = () => {
    setLoading(true);

    setTimeout(() => {
      handleGetResult();
      setModal(false);
    }, 800);
  };

  return (
    <ModalBackground id="modal-background" onClick={closeModalOnClickOutside}>
      {loading ? (
        <ModalContainer>
          <img src="/images/Spinner@1x-1.0s-200px-200px.svg" alt="Loading" />
          loading...
        </ModalContainer>
      ) : (
        <ModalContainer>
          <ModalTitle>⚠️ 시험이 종료됩니다.</ModalTitle>
          <BoldText>모든 문제의 마킹을 완료했는지 확인해주세요.</BoldText>
          <ButtonBox>
            <ComplaintSubmitButon onClick={handleResultCheck}>
              결과 확인
            </ComplaintSubmitButon>
            <CancelComplaintButton onClick={handleModal}>
              취소
            </CancelComplaintButton>
          </ButtonBox>
        </ModalContainer>
      )}
    </ModalBackground>
  );
};

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
  align-items: center;
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

export default ResultModal;
