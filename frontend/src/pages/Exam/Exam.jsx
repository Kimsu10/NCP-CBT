import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExamWait from "../../components/Wait/ExamWait";
import styled from "styled-components";
import axios from "axios";
import AnswerTable from "../../components/Exam/AnswerTable";
import EmptyAnswerTable from "../../components/Exam/EmptyAnswerTable";
import ResultModal from "../../components/Modal/ResultModal";
import axiosConfig from "../../utils/axiosConfig";
import useResponsive from "../../hooks/useResponsive";

const Exam = () => {
  const param = useParams();
  const subjectName = param.name;
  const navigate = useNavigate();
  const [isExamStart, setIsExamStart] = useState(false);
  const [examData, setExamData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(60).fill(null));
  const currentQuestion = examData[currentIndex];
  const [emptyCheckButton, setEmptyCheckButton] = useState(false);
  const [modal, setModal] = useState(false);
  let count = 0;

  const subjects = [{ NCA: 1 }, { NCP200: 2 }, { NCP202: 3 }, { NCP207: 4 }];

  const getSubjectId = subjectName => {
    const subject = subjects.find(el => Object.keys(el)[0] === subjectName);
    return subject ? subject[subjectName] : null;
  };

  const subjectId = getSubjectId(param.name);

  // 숫자를 원형 숫자로 변환하는 함수
  const getCircledNumber = num => {
    const numbers = ["①", "②", "③", "④"];
    return numbers[num - 1] || num;
  };

  // 로그인하지 않은 사용자는 NotFound 페이지로 보내고, 로그인한 사용자에게는 ExamWait 컴포넌트를 띄움.
  const token = sessionStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) {
      navigate(`/${subjectName}/who-are-you`);
    }
  }, [token]);

  // 사용자가 선택한 과목의 문제 60개 랜덤으로 가져오기
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/data/${subjectName}.json`);
        const shuffledData = [...res.data];
        knuthShuffle(shuffledData);
        const slicedData = shuffledData.slice(0, 60);
        setExamData(slicedData);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [subjectName]);

  // Knuth Shuffle 알고리즘 활용
  const knuthShuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  // ExamWait 컴포넌트에서 시험 시작 버튼을 누르면 시험이 시작된다.
  const handleStart = () => {
    setIsExamStart(true);
    startTimer();
  };

  // 제한시간 타이머
  let [min, setMin] = useState(59);
  let [sec, setSec] = useState(59);
  const startTimer = () => {
    const timer = setInterval(() => {
      setSec(prevSec => {
        if (prevSec === 0) {
          setMin(prevMin => prevMin - 1);
          return 59;
        }
        return prevSec - 1;
      });
      if (min === 0 && sec === 0) {
        clearInterval(timer);
        alert("📢시험 시간이 종료되었습니다");
        navigate(`/${subjectName}`);
      }
    }, 1000);
  };

  // 문제의 정답이 여러 개면 체크박스, 한 개면 라디오버튼으로 만들기.
  const renderOptions = options => {
    if (Array.isArray(currentQuestion?.answer)) {
      return options.map((option, index) => (
        <OptionWrapper key={index}>
          <HiddenCheckbox
            type="checkbox"
            id={option.num}
            value={option.num}
            checked={
              selectedAnswers[currentIndex]?.includes(option.num) || false
            }
            onChange={() => handleCheckboxChange(option.num)}
          />
          <OptionLabel
            htmlFor={option.num}
            isSelected={selectedAnswers[currentIndex]?.includes(option.num)}
          >
            <NumberSpan>{getCircledNumber(option.num)}</NumberSpan>
            {option.text}
          </OptionLabel>
        </OptionWrapper>
      ));
    } else {
      return options.map((option, index) => (
        <OptionWrapper key={index}>
          <HiddenRadio
            type="radio"
            id={option.num}
            name="answer"
            value={option.num}
            checked={selectedAnswers[currentIndex] === option.num}
            onChange={() => handleRadioChange(option.num)}
          />
          <OptionLabel
            htmlFor={option.num}
            isSelected={selectedAnswers[currentIndex] === option.num}
          >
            <NumberSpan>{getCircledNumber(option.num)}</NumberSpan>
            {option.text}
          </OptionLabel>
        </OptionWrapper>
      ));
    }
  };

  const handleCheckboxChange = optionNum => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      const currentAnswer = newAnswers[currentIndex] || [];

      if (currentAnswer.includes(optionNum)) {
        newAnswers[currentIndex] = currentAnswer.filter(
          item => item !== optionNum,
        );
      } else {
        newAnswers[currentIndex] = [...currentAnswer, optionNum];
      }

      return newAnswers;
    });
  };

  const handleRadioChange = optionNum => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = optionNum;
      return newAnswers;
    });
  };

  // 안 푼 문제만 표시하기 버튼 관련 로직
  const handleEmptyQuestion = () => {
    setEmptyCheckButton(true);
  };
  const handleAllQuestion = () => {
    setEmptyCheckButton(false);
  };

  // [다음] 버튼 누르면 답안 저장하고 넘어가기
  const handleNextPage = () => {
    if (currentIndex < examData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // [이전] 버튼 누르면 뒤로가기
  const handlePrevPage = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 결과 계산
  const handleGetResult = () => {
    for (let i = 0; i < examData.length; i++) {
      // 답이 배열인 경우 따로 체크
      if (Array.isArray(selectedAnswers[i])) {
        const sortedSelectedAnswers = selectedAnswers[i].sort();
        const sortedCorrectAnswer = examData[i].answer.sort();

        if (
          JSON.stringify(sortedSelectedAnswers) ===
          JSON.stringify(sortedCorrectAnswer)
        ) {
          count++;
        }
      } else if (selectedAnswers[i] === examData[i].answer) {
        count++;
      }
    }
    if (count >= 36) {
      navigate(`/${subjectName}/exam/finish`);
    } else {
      alert(
        `🥲 탈락입니다. 메인 화면으로 이동합니다. (정답 개수 : ${count} 개)`,
      );
      navigate(`/${subjectName}`);
    }

    recordScore();
  };

  const recordScore = () => {
    axiosConfig
      .post(`/exam/record`, { count: count, subjectId: subjectId })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  // 반응형
  const { windowWidth, isMobile, isTablet, isDesktop, getDeviceType } =
    useResponsive();

  return (
    <>
      {!isExamStart ? (
        <ExamWait onStart={handleStart} />
      ) : (
        <MainContainer>
          {modal ? (
            <ResultModal
              setModal={setModal}
              handleGetResult={handleGetResult}
            />
          ) : null}
          <ExamContainer>
            <ExamHead>
              <p>문제 수 : ( {currentIndex + 1} / 60 )</p>
              <h2>
                {currentIndex + 1}. {currentQuestion.question}
              </h2>
            </ExamHead>
            <ExamBody>{renderOptions(currentQuestion?.example)}</ExamBody>
            <ExamFoot>
              {currentIndex === 0 ? (
                <button disabled="disabled" className="disabled">
                  이전 문제
                </button>
              ) : (
                <button onClick={() => handlePrevPage()}>이전 문제</button>
              )}
              {currentIndex === 59 ? (
                <button disabled="disabled" className="disabled">
                  다음 문제
                </button>
              ) : (
                <button onClick={() => handleNextPage()}>다음 문제</button>
              )}
            </ExamFoot>
          </ExamContainer>
          <AnswerContainer>
            <div>
              ⏰ 남은 시간 : {min < 10 ? `0${min}` : min} 분{" "}
              {sec < 10 ? `0${sec}` : sec} 초
            </div>
            <div>
              {emptyCheckButton ? (
                <button onClick={() => handleAllQuestion()}>
                  모든 문제 확인
                </button>
              ) : (
                <button onClick={() => handleEmptyQuestion()}>
                  안 푼 문제 확인
                </button>
              )}
            </div>
            <div>
              {emptyCheckButton ? (
                <EmptyAnswerTable
                  selectedAnswers={selectedAnswers}
                  setCurrentIndex={setCurrentIndex}
                />
              ) : (
                <AnswerTable
                  selectedAnswers={selectedAnswers}
                  setCurrentIndex={setCurrentIndex}
                />
              )}
            </div>
            <div>
              <button onClick={() => setModal(true)}>제출하기</button>
            </div>
          </AnswerContainer>
        </MainContainer>
      )}
    </>
  );
};

const MainContainer = styled.div`
  margin: 6rem;
  display: grid;
  grid-template-columns: 6fr 4fr;
  gap: 1rem;
`;

const ExamContainer = styled.div`
  display: grid;
  grid-template-rows: 3fr 6fr 1fr;
  gap: 1rem;
`;

const ExamHead = styled.div``;

const ExamBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ExamFoot = styled.div`
  display: flex;
  justify-content: space-between;

  .disabled {
    background-color: #d1d5db;
    color: white;
  }

  button {
    width: 8rem;
    background-color: #02c95f;
    color: white;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const AnswerContainer = styled.div`
  display: grid;
  grid-template-rows: -5fr 1fr 7fr 1fr;
  gap: 1rem;
  justify-content: center;
  justify-items: center;

  button {
    width: 7rem;
    color: white;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HiddenCheckbox = styled.input`
  display: none;
`;

const HiddenRadio = styled.input`
  display: none;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${props => (props.isSelected ? "#2563eb" : "#000000")};
  transition: color 0.2s ease;
  font-size: 1rem;

  &:hover {
    color: ${props => (props.isSelected ? "#2563eb" : "#4B5563")};
  }
`;

const NumberSpan = styled.span`
  margin-right: 1rem;
  font-size: 1.2rem;
`;

export default Exam;
