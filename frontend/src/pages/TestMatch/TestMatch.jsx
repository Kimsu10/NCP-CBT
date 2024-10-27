import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import styled from "styled-components";
import { io } from "socket.io-client";

const TestMatch = ({ username }) => {
  const param = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [randomIds, setRandomIds] = useState([]);
  const [randomIdsAnswer, setRandomIdsAnswer] = useState([]); // 문제 정답
  const [userAnswer, setUserAnswer] = useState([]); // 유저 정답 다풀면 채점해서 페이지 넘겨주기
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [animation, setAnimation] = useState("fade-right");
  const { selectedName, roomName } = useParams();
  const [socket, setSocket] = useState(null);
  const [riverProgress, setRiverProgress] = useState(0);
  const [roomStatus, setRoomStatus] = useState([]);
  const token = sessionStorage.getItem("accessToken");

  // console.log(riverProgress);
  // console.log(selectedOptions);
  // console.log(userAnswer);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      path: "/1on1",
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`✅ Socket connected with ID: ${newSocket.id}`);
      console.log(`🏠 Room Name: ${roomName}`);
    });

    return () => {
      newSocket.close();
      // sessionStorage.removeItem(`randomIds_${roomName}`);// 새로고침시 소켓 연결해제되서 문제가 랜덤하게 변해서 다른 방법으로 지워야함
    };
  }, []);

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
    const fetchData = async () => {
      try {
        const response = await axios.get(`/data/${selectedName}.json`);
        setData(response.data);

        const storedData = sessionStorage.getItem(`randomIds_${roomName}`);

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setRandomIds(parsedData.map(el => el.id));
          setRandomIdsAnswer(parsedData.map(el => el.answer));
        } else {
          const ids = response.data.map(el => el.id);
          const shuffledIds = ids.sort(() => 0.5 - Math.random()).slice(0, 60);

          // id와 answer 배열 생성
          const idAnswerPairs = shuffledIds.map(id => {
            const question = response.data.find(el => el.id === id);
            return question
              ? { id: question.id, answer: question.answer }
              : { id, answer: null };
          });

          sessionStorage.setItem(
            `randomIds_${roomName}`,
            JSON.stringify(idAnswerPairs),
          );

          setRandomIds(idAnswerPairs.map(pair => pair.id));
          setRandomIdsAnswer(idAnswerPairs.map(pair => pair.answer));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedName) {
      fetchData();
    }
  }, [roomName]);

  const currentQuestion = data
    ? data.find(item => item.id === randomIds[currentIdx])
    : null;

  // 다음 질문으로 이동
  const handleNextQuestion = () => {
    setUserAnswer(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentIdx] = {
        id: questionId,
        answer: selectedOptions,
      };

      sessionStorage.setItem(
        `${roomName}_userAnswer`,
        JSON.stringify(updatedAnswers),
      );

      return updatedAnswers;
    });

    if (currentIdx < randomIds.length - 1) {
      setAnimation("fade-left");
      setCurrentIdx(currentIdx + 1);
      setSelectedOptions([]);
      setIsChecked(false);
    } else {
      navigate(`/${selectedName}/practice/finish`);
    }
  };

  // 이전 질문으로 이동
  const handlePreviousQuestion = () => {
    setUserAnswer(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentIdx] = {
        id: questionId,
        answer: selectedOptions,
      };

      sessionStorage.setItem(
        `${roomName}_userAnswer`,
        JSON.stringify(updatedAnswers),
      );

      return updatedAnswers;
    });

    if (currentIdx > 0) {
      setAnimation("fade-right");
      setCurrentIdx(currentIdx - 1);
      setSelectedOptions([]);
      setIsChecked(false);
    }
  };

  // 보기 질문 선택
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

  // 현재 진도 보내기
  useEffect(() => {
    if (socket && currentIdx) {
      /*  console.log("Emitting progressUpdate:", {
        roomName, 
        username,
        progress: currentIdx + 1,
      });

     { progress: 10roomName: "zdoqqge5"username: "test02"[[Prototype]]: Object } 

      */
      socket.emit("progressUpdate", {
        roomName,
        username,
        progress: currentIdx + 1,
      });
    }
  }, [currentIdx]);

  // room에서 받을 상대방 진도 -> 왜 안넘어오지
  useEffect(() => {
    console.log("이벤트 발생");
    if (socket) {
      const handleRiverProgressUpdated = ({ roomName, roomStatus }) => {
        console.log(roomName);
        const otherUserProgress = roomStatus
          .filter(user => user.username !== username)
          .map(user => user.progress);
        setRoomStatus(roomStatus);
        setRiverProgress(
          otherUserProgress.length > 0 ? otherUserProgress[0] : 0,
        );

        console.log("River participant progress:", roomStatus);
        console.log("Other User Progress:", otherUserProgress);
      };

      socket.on("riverProgressUpdated", handleRiverProgressUpdated);

      return () => {
        if (socket) {
          socket.off("riverProgressUpdated", handleRiverProgressUpdated);
        }
      };
    }
  }, [currentIdx]);

  return (
    <>
      <TestMatchBody>
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
                  return (
                    <OptionLabel
                      key={Idx}
                      $isSelected={selectedOptions.includes(ex.num)}
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
                      >
                        {String.fromCharCode(0x2460 + Idx)}
                      </CustomRadio>
                      <ExampleText
                        $isSelected={selectedOptions.includes(ex.num)}
                      >
                        {ex.text}
                      </ExampleText>
                    </OptionLabel>
                  );
                })}
              </OptionsContainer>
            </div>
          ) : (
            "없어요"
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
          <CurrentPage>{currentIdx + 1} / 60</CurrentPage>
          <NextButton
            onClick={() => {
              handleNextQuestion();
              document.activeElement.blur();
            }}
          >
            다음 문제
          </NextButton>
        </ButtonContainer>
        <ProgressBarBox>
          <div className="ProgressBarContainer">
            <Progress width={progressBar} />
          </div>
          <RiverProgressBarContainer>
            <RiverProgressBar width={(riverProgress / 60) * 100} />
          </RiverProgressBarContainer>
        </ProgressBarBox>
      </TestMatchBody>
    </>
  );
};

export default TestMatch;

const TestMatchBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 94vh;
  padding: 4rem 0;
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
const ProgressBarBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .ProgressBarContainer {
    width: 80%;
    height: 2rem;
    background-color: #e0e0e0;
    border-radius: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    padding: 0.2rem 0.3rem;
  }
`;
const Progress = styled.div`
  height: 90%;
  width: ${props => props.width}%;
  border-radius: 1rem;
  background-color: #4b9a8f;
  transition: width 0.1s ease-in-out;
`;

const RiverProgressBarContainer = styled.div`
  width: 80%;
  height: 2rem;
  background-color: #e0e0e0;
  border-radius: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  padding: 0.2rem 0.3rem;
`;

const RiverProgressBar = styled.div`
  width: ${props => props.width}%;
  color: red;
  height: 90%;
`;
