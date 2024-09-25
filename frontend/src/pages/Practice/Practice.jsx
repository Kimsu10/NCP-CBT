import { useParams } from "react-router-dom";
import styled from "styled-components";

const Practice = () => {
  const param = useParams();
  const subjectName = param.name;

  return (
    <PracticeBody>
      <h1>{subjectName} 연습</h1>
      <ExplainBox>컨트롤러</ExplainBox>
      <ProblemBox>문제 박스</ProblemBox>
    </PracticeBody>
  );
};

export default Practice;

const PracticeBody = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: gray;
  padding: 1rem;
`;

const ExplainBox = styled.div`
  width: 16%;
  padding: 1.4rem;
  background-color: orange;
  position: absolute;
  top: 16%;
  left: 2%;
`;

const ProblemBox = styled.div`
  width: 60%;
  padding: 2rem;
  margin-top: 2rem;
  background-color: bisque;
`;
