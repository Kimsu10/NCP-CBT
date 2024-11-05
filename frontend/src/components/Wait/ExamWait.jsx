import { useState } from "react";
import styled from "styled-components";

const ExamWait = ({ onStart }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  return (
    <MainContainer>
      <h1> 💁 모의고사 시작 전 안내사항</h1>
      <MainContent>
        <h3>1. 시험 시간은 총 60분이며, 객관식 60문제가 주어집니다.</h3>
        <h3>
          2. 전체 문제 중 60% 이상 정답을 맞추면 합격입니다. (36문제 이상)
        </h3>
        <h3>
          3. 시험이 끝나지 않은 상태에서 종료하면 진행사항이 저장되지 않으니
          주의 바랍니다.
        </h3>
      </MainContent>
      <label>
        <input
          type="checkbox"
          checked={isAgreed}
          onChange={e => setIsAgreed(e.target.checked)}
          style={{
            width: "1.3rem",
            height: "1.3rem",
          }}
        />
        <span> 위 안내사항을 모두 확인하였으며, 이에 동의합니다.</span>
      </label>
      <StyledButton onClick={onStart} disabled={!isAgreed}>
        시험 시작
      </StyledButton>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin: 2rem 0;
  }

  label {
    margin-top: 2rem;
    font-size: 1.1rem;
    color: #3b82f6;
  }
`;

const StyledButton = styled.button`
  width: 10rem;
  font-size: 1rem;
  margin: 3rem 0;
  transition: all 0.2s ease-in-out;

  background-color: ${props => (props.disabled ? "#D1D5DB" : "#02c95f")};
  color: white;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    background-color: #02c95f;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0.5rem 0;
    color: gray;
  }
`;

export default ExamWait;
