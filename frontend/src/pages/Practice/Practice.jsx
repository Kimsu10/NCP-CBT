import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import NotFound from "../NotFound/NotFound";
import ControlExplain from "../../components/ControlExplain/ControlExplain";

const Practice = () => {
  const param = useParams();
  const subjectName = param.name;
  const [data, setData] = useState(null);
  const [randomIds, setRandomIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

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
      setSelectedOptions([]);
      setIsChecked(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setSelectedOptions([]);
      setIsChecked(false);
    }
  };

  const handleOptionChange = optionNum => {
    if (Array.isArray(currentQuestion.answer)) {
      if (selectedOptions.includes(optionNum)) {
        setSelectedOptions(selectedOptions.filter(num => num !== optionNum));
      } else {
        setSelectedOptions([...selectedOptions, optionNum]);
      }
    } else {
      setSelectedOptions([optionNum]);
    }
  };

  const handleCheckAnswer = () => {
    setIsChecked(true);
  };

  const handleRetry = () => {
    setSelectedOptions([]);
    setIsChecked(false);
  };

  const currentQuestion = data
    ? data.find(item => item.id === randomIds[currentIdx])
    : null;

  const isCorrect =
    isChecked &&
    ((Array.isArray(currentQuestion.answer) &&
      currentQuestion.answer.every(num => selectedOptions.includes(num))) ||
      (!Array.isArray(currentQuestion.answer) &&
        currentQuestion.answer === selectedOptions[0]));

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = event => {
      switch (event.key) {
        case "1":
          handleOptionChange(1);
          break;
        case "2":
          handleOptionChange(2);
          break;
        case "3":
          handleOptionChange(3);
          break;
        case "4":
          handleOptionChange(4);
          break;
        case "Enter":
          if (selectedOptions.length > 0) {
            handleCheckAnswer();
          }
          break;
        case "ArrowRight":
          handleNextQuestion();
          break;
        case "ArrowLeft":
          handlePreviousQuestion();
          break;
        case "Escape":
          handleRetry();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedOptions, isChecked, currentIdx, currentQuestion]);

  return (
    <PracticeBody>
      <ControlExplain />
      <ProblemBox>
        {currentQuestion ? (
          <div>
            <QuestionText>
              Q.{currentIdx + 1} {currentQuestion.question}
            </QuestionText>
            <OptionsContainer>
              {currentQuestion.example.map((ex, Idx) => {
                const isExampleCorrect =
                  isChecked &&
                  !Array.isArray(currentQuestion.answer) &&
                  currentQuestion.answer === ex.num;

                const isExampleWrong =
                  isChecked &&
                  !Array.isArray(currentQuestion.answer) &&
                  selectedOptions.includes(ex.num) &&
                  currentQuestion.answer !== ex.num;

                const isExampleAnswerCorrect =
                  isChecked &&
                  Array.isArray(currentQuestion.answer) &&
                  currentQuestion.answer.includes(ex.num);

                const isExampleAnswerWrong =
                  isChecked &&
                  Array.isArray(currentQuestion.answer) &&
                  selectedOptions.includes(ex.num) &&
                  !currentQuestion.answer.includes(ex.num);

                return (
                  <OptionLabel
                    key={Idx}
                    isSelected={selectedOptions.includes(ex.num)}
                    isCorrect={isExampleAnswerCorrect}
                    isWrong={isExampleAnswerWrong}
                  >
                    <RadioInput
                      type={
                        Array.isArray(currentQuestion.answer)
                          ? "checkbox"
                          : "radio"
                      }
                      name="options"
                      value={ex.text}
                      checked={selectedOptions.includes(ex.num)}
                      onChange={() => handleOptionChange(ex.num)}
                      disabled={isChecked}
                    />
                    <CustomRadio
                      isChecked={selectedOptions.includes(ex.num)}
                      isCorrect={isExampleAnswerCorrect || isExampleCorrect}
                      isWrong={isExampleAnswerWrong || isExampleWrong}
                    >
                      {String.fromCharCode(0x2460 + Idx)}
                    </CustomRadio>
                    <ExampleText
                      isSelected={selectedOptions.includes(ex.num)}
                      isCorrect={isExampleAnswerCorrect || isExampleCorrect}
                      isWrong={isExampleAnswerWrong || isExampleWrong}
                    >
                      {ex.text}
                    </ExampleText>
                  </OptionLabel>
                );
              })}
            </OptionsContainer>
            {isChecked && (
              <RetryButton onClick={handleRetry}>다시 풀기</RetryButton>
            )}
            <CheckButton
              onClick={handleCheckAnswer}
              disabled={isChecked || selectedOptions.length === 0}
            >
              채점하기
            </CheckButton>

            {isChecked && (
              <ExplanationBox>
                {isCorrect
                  ? "정답입니다!"
                  : `오답입니다. 정답: ${currentQuestion.answer}`}
                <ExplanationText>
                  {currentQuestion.explanation
                    ? currentQuestion.explanation
                        .split(".")
                        .reduce((acc, sentence, idx, array) => {
                          if (
                            sentence.trim().length <= 24 &&
                            idx < array.length - 1
                          ) {
                            acc[acc.length - 1] += "." + sentence.trim();
                          } else {
                            acc.push(sentence.trim());
                          }
                          return acc;
                        }, [])
                        .map((sentence, idx, array) => (
                          <span key={idx}>
                            {sentence}
                            {idx < array.length - 1 ? "." : ""}
                            {idx < array.length - 1 && <br />}
                          </span>
                        ))
                    : "설명이 없습니다."}
                </ExplanationText>
              </ExplanationBox>
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

const PracticeBody = styled.div`
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.white};
`;

const ProblemBox = styled.div`
  width: 60%;
  min-width: 30rem;
  min-height: 64vh;
  max-height: auto;
  padding: 2rem;
  margin-top: 2rem;
  background-color: ${props => props.theme.white};
`;

const QuestionText = styled.h2`
  font-size: 1.3rem;
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

const RetryButton = styled.button`
  margin: 1rem 1rem 1rem 0;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: orange;
  color: white;
  border: none;
  cursor: pointer;
`;

const CheckButton = styled.button`
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #b3b3b3;
    cursor: not-allowed;
  }
`;

const ExplanationBox = styled.div`
  margin-top: 1rem;
  font-size: 1.2rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-left: 5px solid green;
`;

const ExplanationText = styled.p`
  padding: 1rem 0;
  line-height: 1.6;
`;
