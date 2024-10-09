import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import NotFound from "../NotFound/NotFound";
import ControlExplain from "../../components/ControlExplain/ControlExplain";
import CorrectMark from "../../components/Marks/CorrectMark";
import AOS from "aos";
import "aos/dist/aos.css";

const Practice = () => {
  const param = useParams();
  const subjectName = param.name;
  const [data, setData] = useState(null);
  const [randomIds, setRandomIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const [animation, setAnimation] = useState("fade-right");

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });

    AOS.refresh();
  }, [currentIdx]);

  console.log(currentIdx);
  console.log(animation);

  const questionId = randomIds[currentIdx];
  const totalPage = data?.length;
  const progressBar = totalPage ? Math.ceil((currentIdx / totalPage) * 100) : 0;
  // 올림을 해도 99가 최고. 다음문제를 눌렀을때 나올 완료 컴포넌트 만들어서 넣자

  const subjects = [{ NCA: 1 }, { NCP200: 2 }, { NCP202: 3 }, { NCP207: 4 }];

  const getSubjectId = subjectName => {
    const subject = subjects.find(el => Object.keys(el)[0] === subjectName);
    return subject ? subject[subjectName] : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/data/${subjectName}.json`);
        setData(response.data);

        const ids = response.data.map(el => el.id);
        const shuffledIds = ids.sort(() => 0.5 - Math.random());
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
      setAnimation("fade-left");
      setCurrentIdx(currentIdx + 1);
      setSelectedOptions([]);
      setIsChecked(false);
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

  const handleCheckAnswer = () => {
    setIsChecked(true);
  };

  const handleRetry = () => {
    setSelectedOptions([]);
    setIsChecked(false);
  };

  // 북마크 요청
  const handleBookmark = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      const bookmarkDTO = {
        subjectId: getSubjectId(param.name),
        questionId: questionId,
      };

      if (!token) {
        alert("로그인이 필요합니다.");
      } else {
        const res = await axios.post("/bookmarks", bookmarkDTO, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          const message = res.data;
          if (message.includes("삭제")) {
            alert("북마크가 삭제되었습니다.");
          } else if (message.includes("추가")) {
            alert("북마크가 추가되었습니다.");
          }
        }
      }
    } catch (err) {
      console.error("북마크 추가 중 오류 발생:", err);
      alert("북마크 실패. 개발자에게 문의하세요");
    }
  };

  // 신고 요청
  const handleReport = () => {
    alert("신고 성공");
  };

  const currentQuestion = data
    ? data.find(item => item.id === randomIds[currentIdx])
    : null;

  const isCorrect =
    isChecked &&
    ((Array.isArray(currentQuestion.answer) &&
      currentQuestion.answer.length === selectedOptions.length &&
      currentQuestion.answer.every(num => selectedOptions.includes(num))) ||
      (!Array.isArray(currentQuestion.answer) &&
        currentQuestion.answer === selectedOptions[0]));

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = e => {
      if (isChecked && ["1", "2", "3", "4"].includes(e.key)) {
        return;
      }

      switch (e.key) {
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
        case "b":
          handleBookmark();
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
      <SubjectTitle>{subjectName}</SubjectTitle>
      <ProgressBarContainer>
        <Progress width={progressBar} />
        <CurrentPage>
          {currentIdx} / {totalPage}
        </CurrentPage>
      </ProgressBarContainer>
      <ControlExplain />
      <ProblemBox key={currentIdx} data-aos={animation}>
        <BookmarkButton onClick={handleBookmark}>
          <i className="bi bi-bookmark-star-fill"></i> 북마크
        </BookmarkButton>
        <ComplaintButton onClick={handleReport}>
          <i className="bi bi-bell-fill"></i> 신고
        </ComplaintButton>
        {currentQuestion ? (
          <div>
            <QuestionWrapper>
              <QuestionText>
                Q.{currentIdx + 1} &nbsp;
                {currentQuestion.question}
              </QuestionText>
              {isCorrect ? <CorrectMark /> : ""}
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
                        .reduce((acc, str, idx, arr) => {
                          if (str.trim().length <= 24 && idx < arr.length - 1) {
                            acc[acc.length - 1] += "." + str.trim();
                          } else {
                            acc.push(str.trim());
                          }
                          return acc;
                        }, [])
                        .map((str, idx, arr) => (
                          <span key={idx}>
                            {str}
                            {idx < arr.length - 1 ? "." : ""}
                            {idx < arr.length - 1 && <br />}
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
          onClick={() => {
            handlePreviousQuestion();
            document.activeElement.blur();
          }}
          disabled={currentIdx === 0}
        >
          이전 문제
        </PrevButton>
        <NextButton
          onClick={() => {
            handleNextQuestion();
            document.activeElement.blur();
          }}
        >
          다음 문제
        </NextButton>
      </ButtonContainer>
    </PracticeBody>
  );
};

export default Practice;

const PracticeBody = styled.div`
  width: 100%;
  min-height: 91vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.white};
  justify-content: center;
  position: relative; //
`;

const SubjectTitle = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  position: fixed;
  top: 1.3rem;
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

const BookmarkButton = styled.span`
  width: 6rem;
  font-size: 1rem;
  background-color: transparent;
  color: orange;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: orange;
  }
`;

const ComplaintButton = styled.span`
  width: 6rem;
  font-size: 1rem;
  background-color: transparent;
  color: red;
  margin-left: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: red;
  }
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
  color: ${({ $isChecked, $isCorrect, $isWrong }) =>
    $isCorrect
      ? "rgb(2, 103, 255)"
      : $isWrong
        ? "red"
        : $isChecked
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
  color: ${({ $isSelected, $isCorrect, $isWrong }) =>
    $isCorrect ? "blue" : $isWrong ? "red" : $isSelected ? "blue" : "black"};
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 2rem 0;
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
  margin-top: 2rem;
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

// 프로그래스 바
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 3.3rem;
  background-color: #e0e0e0;
  position: absolute;
  bottom: 0;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #4b9a8f;
  transition: width 0.1s ease-in-out;
`;

const CurrentPage = styled.span`
  font-size: 1.2rem;
  color: white;
  z-index: 40;
  position: absolute;
  top: 30%;
  left: 49%;
`;
