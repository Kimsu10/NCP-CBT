import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import NotFound from "../NotFound/NotFound";

const Practice = () => {
  const param = useParams();
  const subjectName = param.name;
  const [data, setData] = useState(null);
  const [randomIds, setRandomIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false); // 채점 상태 저장

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/data/${subjectName}.json`);
        setData(response.data);

        const ids = response.data.map(item => item.id);
        const shuffledIds = ids.sort(() => 0.5 - Math.random()).slice(0, 60);
        setRandomIds(shuffledIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (subjectName) {
      fetchData();
    }
  }, [subjectName]);

  const handleNextQuestion = () => {
    if (currentIdx < randomIds.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsChecked(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setSelectedOption(null);
      setIsChecked(false);
    }
  };

  const handleOptionChange = option => {
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    setIsChecked(true);
  };

  const handleResetQuestion = () => {
    setSelectedOption(null);
    setIsChecked(false);
  };

  const currentQuestion = data
    ? data.find(item => item.id === randomIds[currentIdx])
    : null;

  const isCorrect =
    currentQuestion && selectedOption
      ? currentQuestion.answer === selectedOption.num
      : false;

  return (
    <PracticeBody>
      <h1>{subjectName} 연습</h1>
      <ExplainBox>컨트롤러</ExplainBox>
      <ProblemBox>
        {currentQuestion ? (
          <div>
            <QuestionText>
              Q {currentIdx + 1}. {currentQuestion.question}
            </QuestionText>
            <OptionsContainer>
              {currentQuestion.example.map((example, Idx) => (
                <OptionLabel
                  key={Idx}
                  isSelected={selectedOption === example}
                  isCorrect={
                    isChecked && example.num === currentQuestion.answer
                  }
                  isWrong={
                    isChecked &&
                    selectedOption &&
                    selectedOption.num !== currentQuestion.answer &&
                    selectedOption.num === example.num
                  }
                >
                  <RadioInput
                    type="radio"
                    name="options"
                    value={example.text}
                    checked={selectedOption === example}
                    onChange={() => handleOptionChange(example)}
                    disabled={isChecked} // 채점 이후에는 선택 불가
                  />
                  <CustomRadio
                    isChecked={selectedOption === example}
                    isCorrect={
                      isChecked && example.num === currentQuestion.answer
                    }
                    isWrong={
                      isChecked &&
                      selectedOption &&
                      selectedOption.num !== currentQuestion.answer &&
                      selectedOption.num === example.num
                    }
                  >
                    {String.fromCharCode(0x2460 + Idx)}
                  </CustomRadio>
                  <ExampleText
                    isSelected={selectedOption === example}
                    isCorrect={
                      isChecked && example.num === currentQuestion.answer
                    }
                    isWrong={
                      isChecked &&
                      selectedOption &&
                      selectedOption.num !== currentQuestion.answer &&
                      selectedOption.num === example.num
                    }
                  >
                    {example.text}
                  </ExampleText>
                </OptionLabel>
              ))}
            </OptionsContainer>
            <ButtonContainer>
              <ResetButton onClick={handleResetQuestion}>다시 풀기</ResetButton>
              <CheckButton
                onClick={handleCheckAnswer}
                disabled={isChecked || !selectedOption}
              >
                채점하기
              </CheckButton>
            </ButtonContainer>
            {isChecked && (
              <AnswerExplanation>
                {isCorrect
                  ? "정답입니다!"
                  : `오답입니다. 정답: ${currentQuestion.answer}`}
                <p>{currentQuestion.explanation}</p>
              </AnswerExplanation>
            )}
          </div>
        ) : (
          <NotFound />
        )}
      </ProblemBox>
      <ButtonContainer>
        <PrevButton
          onClick={handlePreviousQuestion}
          disabled={currentIdx === 0}
        >
          이전 문제
        </PrevButton>
        <NextButton onClick={handleNextQuestion}>다음 문제</NextButton>
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
  min-height: 64vh;
  padding: 2rem;
  margin-top: 2rem;
  background-color: #edfdcc;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  display: none;
`;

const CustomRadio = styled.span`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.5rem;
  color: ${({ isChecked, isCorrect, isWrong }) =>
    isCorrect
      ? "rgb(2, 103, 255)"
      : isWrong
        ? "red"
        : isChecked
          ? "rgb(2, 103, 255)"
          : "black"};
  scale: ${({ isChecked }) => (isChecked ? 1.2 : 1)};
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 2rem;
  transition:
    border-color 0.2s,
    background-color 0.2s;
`;

const ExampleText = styled.span`
  color: ${({ isSelected, isCorrect, isWrong }) =>
    isCorrect ? "blue" : isWrong ? "red" : isSelected ? "blue" : "black"};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PrevButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: ${props => props.theme.mainColor};
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: lightgray;
    cursor: not-allowed;
  }
`;

const NextButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: ${props => props.theme.mainColor};
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const CheckButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: ${({ disabled }) => (disabled ? "lightgray" : "#4CAF50")};
  color: white;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: #f0ad4e;
  color: white;
  border: none;
  cursor: pointer;
`;

const AnswerExplanation = styled.div`
  margin-top: 1rem;
  font-size: 1.2rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-left: 5px solid green;
`;
