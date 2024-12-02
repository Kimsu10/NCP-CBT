import styled from "styled-components";

const ControlExplain = () => {
  return (
    <ControlBox>
      <h4>키보드 컨트롤</h4>
      <ControlText>
        <p> 다음 문제 : → </p>
        <p> 이전 문제 : ← </p>
        <p> 채점 하기 : ↑ Enter </p>
        <p> 다시 풀기 : ↓ R </p>
        <p> 보기 선택 : 1 2 3 4 </p>
      </ControlText>
    </ControlBox>
  );
};

export default ControlExplain;

const ControlBox = styled.div`
  width: 14%;
  padding: 1.4rem;
  background-color: #ffa6004d;
  position: absolute;
  top: 30%;
  left: 4%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  box-shadow: 0px 2px 2px 2px lightgray;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const ControlText = styled.div`
  padding: 1rem 0 0 0;
  line-height: 1.6;
`;
