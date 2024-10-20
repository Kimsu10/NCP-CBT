import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import styled from "styled-components";
import NotFound from "../NotFound/NotFound";

const TestMatch = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [randomIds, setRandomIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [animation, setAnimation] = useState("fade-right");
  const [isTokenValid, setIsTokenValid] = useState(true);
  const subjectName = param.name;
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });

    AOS.refresh();
  }, [currentIdx]);

  const questionId = randomIds[currentIdx];
  const totalPage = randomIds?.length;
  const progressBar = totalPage ? Math.ceil((currentIdx / totalPage) * 100) : 0;

  const subjects = [{ NCA: 1 }, { NCP200: 2 }, { NCP202: 3 }, { NCP207: 4 }];

  const getSubjectId = subjectName => {
    const subject = subjects.find(el => Object.keys(el)[0] === subjectName);
    return subject ? subject[subjectName] : null;
  };

  const subjectId = getSubjectId(param.name);

  useEffect(() => {
    // if (!token) {
    //   navigate(`/${subjectName}/who-are-you`);
    // }

    const fetchData = async () => {
      try {
        const response = await axios.get(`/data/${subjectName}.json`);
        setData(response.data);

        const ids = response.data.map(el => el.id);
        const shuffledIds = ids.sort(() => 0.5 - Math.random());
        const limitedIds = shuffledIds.slice(0, 60);
        setRandomIds(limitedIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (subjectName) {
      fetchData();
    }
  }, [subjectName]);

  const currentQuestion = data
    ? data.find(item => item.id === randomIds[currentIdx])
    : null;

  const handleNextQuestion = () => {
    if (currentIdx < randomIds.length - 1) {
      setAnimation("fade-left");
      setCurrentIdx(currentIdx + 1);
      setSelectedOptions([]);
      setIsChecked(false);
    } else {
      navigate(`/${subjectName}/practice/finish`);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIdx > 0) {
      setAnimation("fade-right");
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

  return (
    <>
      <TestMatchBody>
        <ProgressBarContainer>
          <Progress width={progressBar} />
        </ProgressBarContainer>
        <ProblemBox key={currentIdx} data-aos={animation}>
          {currentQuestion ? (
            <div>
              <QuestionWrapper>
                <QuestionText>
                  Q.{currentIdx + 1} &nbsp;
                  {currentQuestion.question}
                </QuestionText>
              </QuestionWrapper>
              <OptionsContainer>
                {currentQuestion.example.map((ex, Idx) => {
                  const isAnswerCorrect =
                    isChecked &&
                    !Array.isArray(currentQuestion.answer) &&
                    currentQuestion.answer === ex.num;

                  const isAnswerWrong =
                    isChecked &&
                    !Array.isArray(currentQuestion.answer) &&
                    selectedOptions.includes(ex.num) &&
                    currentQuestion.answer !== ex.num;

                  const isAnswersCorrect =
                    isChecked &&
                    Array.isArray(currentQuestion.answer) &&
                    currentQuestion.answer.includes(ex.num);

                  const isAnswersWrong =
                    isChecked &&
                    Array.isArray(currentQuestion.answer) &&
                    selectedOptions.includes(ex.num) &&
                    !currentQuestion.answer.includes(ex.num);

                  return (
                    <OptionLabel
                      key={Idx}
                      $isSelected={selectedOptions.includes(ex.num)}
                      $isCorrect={isAnswersCorrect}
                      $isWrong={isAnswersWrong}
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
                        $isChecked={selectedOptions.includes(ex.num)}
                        $isCorrect={isAnswersCorrect || isAnswerCorrect}
                        $isWrong={isAnswersWrong || isAnswerWrong}
                      >
                        {String.fromCharCode(0x2460 + Idx)}
                      </CustomRadio>
                      <ExampleText
                        $isSelected={selectedOptions.includes(ex.num)}
                        $isCorrect={isAnswersCorrect || isAnswerCorrect}
                        $isWrong={isAnswersWrong || isAnswerWrong}
                      >
                        {ex.text}
                      </ExampleText>
                    </OptionLabel>
                  );
                })}
              </OptionsContainer>
            </div>
          ) : (
            <NotFound />
          )}
        </ProblemBox>

        <ButtonContainer>
          <PrevButton
            onClick={() => {
              handlePreviousQuestion();
              document.activeElement.blur();
            }}
            disabled={currentIdx === 0}
          >
            이전 문제
          </PrevButton>
          <CurrentPage>
            {currentIdx + 1} / {totalPage}
          </CurrentPage>
          <NextButton
            onClick={() => {
              handleNextQuestion();
              document.activeElement.blur();
            }}
          >
            다음 문제
          </NextButton>
        </ButtonContainer>
      </TestMatchBody>
    </>
  );
};

export default TestMatch;

const TestMatchBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProblemBox = styled.div`
  width: 60%;
  min-width: 30rem;
  min-height: 36vh;
  max-height: auto;
  padding: 2rem;
  margin-top: 2rem;
  background-color: ${props => props.theme.white};
  border-radius: 12px;
  box-shadow: 2px 2px 2px 2px lightgray;
`;

const QuestionWrapper = styled.div`
  position: relative;
  margin: 1rem 0;
`;

const QuestionText = styled.h2`
  font-size: 1.3rem;
  line-height: 1.6;
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
  color: ${({ $isChecked }) => ($isChecked ? "blue" : "black")};
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 2rem;
  transition:
    border-color 0.2s,
    background-color 0.2s;
`;

const ExampleText = styled.span`
  color: ${({ $isSelected }) => ($isSelected ? "blue" : "black")};
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 2rem 0;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  width: 60%;
  min-width: 30rem;
`;

const PrevButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: ${props => props.theme.mainColor2};
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: lightgray;
    cursor: not-allowed;
  }
`;

const CurrentPage = styled.span`
  font-size: 1.2rem;
  color: #7c7c7c;
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

// 프로그래스 바
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 0.3rem;
  background-color: #e0e0e0;
  position: fixed;
  top: 4rem;
  z-index: 1000;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #4b9a8f;
  transition: width 0.1s ease-in-out;
`;
