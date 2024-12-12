import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
  const [randomIdsAnswer, setRandomIdsAnswer] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [animation, setAnimation] = useState("fade-right");
  const { selectedName, roomName } = useParams();
  const [socket, setSocket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [riverProgress, setRiverProgress] = useState(0);
  const token = sessionStorage.getItem("accessToken");
  const socketRef = useRef(null);

  // 소켓 연결 설정
  useEffect(() => {
    const newSocket = io(process.env.WEBSOCKET_URL, {
      path: "/quiz",
      withCredentials: true,
    });
    setSocket(newSocket);
    socketRef.current = newSocket;

    socketRef.current.on("connect", () => {
      console.log(`✅ Socket connected with ID: ${newSocket.id}`);
      console.log(`🏠 Room Name: ${roomName}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, [currentIdx]);

  const questionId = randomIds[currentIdx];
  const totalPage = randomIds?.length;
  const progressBar = totalPage ? Math.ceil((currentIdx / totalPage) * 100) : 0;

  // 질문 데이터 가져오기
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
          const shuffledIds = ids.sort(() => 0.5 - Math.random()).slice(0, 10);
          const idAnswerPairs = shuffledIds.map(id => {
            const question = response.data.find(el => el.id === id);
            return question
              ? { id: question.id, answer: question.answer }
              : { id, answer: null };
          });

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

  useEffect(() => {
    if (finalScore !== null) {
      sessionStorage.setItem("score", finalScore);

      socket.emit(
        "completeTest",
        { username, score: finalScore, roomName },
        response => {
          if (response.success) {
            navigate(`/quiz/${selectedName}/${roomName}/result`);
          } else {
            console.error("Error completing the test:", response.message);
          }
        },
      );
    }
  }, [finalScore]);

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

  const handleButtonClick = optionNum => {
    if (Array.isArray(currentQuestion.answer)) {
      // 복수 선택
      if (selectedOptions.includes(optionNum)) {
        setSelectedOptions(selectedOptions.filter(num => num !== optionNum));
      } else {
        setSelectedOptions([...selectedOptions, optionNum]);
      }
    } else {
      // 단일 선택
      setSelectedOptions([optionNum]);
    }
  };

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
                        name="options"
                        value={ex.text}
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
            "데이터 불러오기 실패"
          )}
        </ProblemBox>
        <ButtonContainer>
          {[1, 2, 3, 4].map(num => (
            <OptionButton
              key={num}
              onClick={() => handleButtonClick(num)}
              $isSelected={selectedOptions.includes(num)}
            >
              {num}
            </OptionButton>
          ))}
        </ButtonContainer>

        <ProgressBarBox>
          <div className="ProgressBarContainer">
            <Progress width={progressBar} />
          </div>
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
  width: 40rem;
  min-width: 30rem;
  min-height: 32vh;
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
  /* cursor: pointer; */
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
  color: "black";
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 2rem;
  transition:
    border-color 0.2s,
    background-color 0.2s;
`;

const ExampleText = styled.span`
  color: black;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 2rem 0;
  gap: 1rem;
  min-width: 30rem;
  width: 40rem;
`;

const OptionButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  width: 100%;
  height: 3rem;
  background-color: ${({ $isSelected, props }) =>
    $isSelected ? "#65A07D" : "#02C95F"};
  border: none;
  /* cursor: pointer; */
`;

const CurrentPage = styled.span`
  font-size: 1.2rem;
  color: #7c7c7c;
`;

// 프로그래스 바
const ProgressBarBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .ProgressBarContainer {
    width: 80%;
    min-width: 32rem;
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
