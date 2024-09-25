import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Practice = () => {
  const param = useParams();
  const subjectName = param.name;
  const [data, setData] = useState(null);
  const [randomIds, setRandomIds] = useState([]); // 랜덤하게 선택된 60개의 ID를 저장
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 표시할 문제의 인덱스

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/data/${subjectName}.json`);
        setData(response.data);

        // 랜덤하게 60개의 id를 선택 (데이터가 배열인 경우)
        const ids = response.data.map(item => item.id); // 전체 id 추출
        const shuffledIds = ids.sort(() => 0.5 - Math.random()).slice(0, 60); // 랜덤으로 섞고 60개 선택
        setRandomIds(shuffledIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (subjectName) {
      fetchData();
    }
  }, [subjectName]);

  // "다음" 버튼 클릭 시 호출될 함수
  const handleNextQuestion = () => {
    if (currentIndex < randomIds.length - 1) {
      setCurrentIndex(currentIndex + 1); // 인덱스를 증가시켜 다음 문제로 이동
    }
  };

  // "이전" 버튼 클릭 시 호출될 함수
  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // 인덱스를 감소시켜 이전 문제로 이동
    }
  };

  // 현재 문제를 가져오기 위한 로직
  const currentQuestion = data
    ? data.find(item => item.id === randomIds[currentIndex])
    : null;

  return (
    <PracticeBody>
      <h1>{subjectName} 연습</h1>
      <ExplainBox>컨트롤러</ExplainBox>
      <ProblemBox>
        {/* 현재 문제를 화면에 표시 */}
        {currentQuestion ? (
          <pre>{JSON.stringify(currentQuestion, null, 2)}</pre>
        ) : (
          "로딩 중..."
        )}
      </ProblemBox>
      <ButtonContainer>
        {/* 이전 버튼 */}
        <PrevButton
          onClick={handlePreviousQuestion}
          disabled={currentIndex === 0} // 첫 번째 문제일 때 비활성화
        >
          이전 문제
        </PrevButton>

        {/* 다음 버튼 */}
        <NextButton
          onClick={handleNextQuestion}
          disabled={currentIndex >= randomIds.length - 1} // 마지막 문제일 때 비활성화
        >
          다음 문제
        </NextButton>
      </ButtonContainer>
    </PracticeBody>
  );
};

export default Practice;

// 스타일링 부분
const PracticeBody = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: gray;
  padding: 2rem 1rem;
`;

const ExplainBox = styled.div`
  width: 16%;
  padding: 1.4rem;
  background-color: orange;
  position: absolute;
  top: 20%;
  left: 2%;
`;

const ProblemBox = styled.div`
  width: 60%;
  padding: 2rem;
  margin-top: 2rem;
  background-color: bisque;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PrevButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: lightblue;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const NextButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: lightblue;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;
