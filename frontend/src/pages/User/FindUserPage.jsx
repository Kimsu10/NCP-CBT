import styled from "styled-components";
import { device } from "../../styles/theme";
import { useState } from "react";
import PwdModal from "../../components/Modal/PwdModal";

const FindUserPage = () => {
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const [authCodeBox, seteAuthCodeBox] = useState(false);
  const [PwdModalOpen, SetPwdModalOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRequestBlocked, setIsRequestBlocked] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    code: "",
  });

  const handleInputChange = e => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { identifier, code } = formData;

  const handleFindAccount = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/form/find-account?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("계정을 정보가 없습니다.");
      }

      const username = await response.text();
      setAccount(username);
      alert(`계정: ${username}`);
    } catch (error) {
      console.error("계정 찾기 요청 실패:", error);
      alert(error.message);
    }
  };

  // 비밀번호 찾기 인증번호 요청
  const handleSendAuthCode = async () => {
    if (!identifier) {
      alert("닉네임 또는 이메일을 입력해주세요.");
      return;
    }

    try {
      const params = new URLSearchParams();
      const isEmail = identifier.includes("@");
      if (isEmail) {
        params.append("email", identifier);
      } else {
        params.append("nickname", identifier);
      }

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/form/send-code?${params.toString()}`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        const result = await response.text();
        seteAuthCodeBox(true);
        setMessage(result);

        setIsRequestBlocked(true);
        setRemainingTime(180);

        const interval = setInterval(() => {
          setRemainingTime(prevTime => {
            if (prevTime <= 1) {
              clearInterval(interval);
              setIsRequestBlocked(false);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        const error = await response.text();
        seteAuthCodeBox(false);
        setMessage(`에러: ${error}`);
      }
    } catch (error) {
      console.error("Error sending auth code:", error);
      seteAuthCodeBox(false);
      setMessage("인증 코드 요청 중 오류가 발생했습니다.");
    }
  };

  // 인증 확인
  const verifyPwdCode = async () => {
    try {
      const params = new URLSearchParams();
      const isEmail = identifier.includes("@");

      if (isEmail) {
        params.append("email", identifier);
      } else {
        params.append("username", identifier);
      }

      if (!code) {
        alert("인증코드를 입력하세요");
        return;
      }
      params.append("authCode", code);

      setIsRequestBlocked(true);
      setRemainingTime(180);

      const interval = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsRequestBlocked(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/form/verify-pwd-code?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        SetPwdModalOpen(true);
      } else {
        const errorMessage = await response.text();
        const match = errorMessage.match(/"([^"]+)"/);
        alert(match[1]);
      }
    } catch (err) {
      console.error("이메일 인증 에러:", err.message);
      alert("서버와의 연결에 실패했습니다.");
    }
  };

  return (
    <FindUserPageBody>
      <FindAccountSection>
        <div className="find-account-container">
          <h1>계정 찾기</h1>
          <p>가입한 이메일을 입력해주세요</p>
          <input
            type="email"
            className="insert-email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="find-account-button" onClick={handleFindAccount}>
            계정 찾기
          </button>
          {account && (
            <h2>
              찾은 계정: <span className="result-message">{account}</span>
            </h2>
          )}
        </div>
      </FindAccountSection>
      <VerticalDivider />
      <FindPasswordSection>
        <div className="find-password-container">
          <h1>비밀번호 찾기</h1>
          <p>계정 또는 이메일을 입력해주세요</p>
          <input
            type="text"
            name="identifier"
            placeholder="계정 또는 이메일"
            value={identifier}
            onChange={handleInputChange}
            className="insert-identifier"
          />
          {message && <p className="result-message">{message}</p>}
          {authCodeBox && (
            <div className="insert-pwd-code-box">
              <input
                type="text"
                name="code"
                placeholder="인증 코드를 입력해주세요"
                className="insert-authcode"
                value={code}
                onChange={handleInputChange}
              />
              {remainingTime > 0 ? (
                <span className="remaining-time">
                  {Math.floor(remainingTime / 60)}:
                  {(remainingTime % 60).toString().padStart(2, "0")}
                </span>
              ) : (
                <span
                  className="resend-code-button"
                  onClick={handleSendAuthCode}
                >
                  다시 받기
                </span>
              )}
            </div>
          )}
          {!authCodeBox ? (
            <button
              className="find-password-button"
              onClick={handleSendAuthCode}
              disabled={isRequestBlocked}
            >
              인증 번호 보내기
            </button>
          ) : (
            <button
              className="move-find-password-button"
              onClick={verifyPwdCode}
            >
              인증하기
            </button>
          )}
        </div>
      </FindPasswordSection>
      {PwdModalOpen && (
        <PwdModal
          onClose={() => SetPwdModalOpen(false)}
          onSubmit={() => {
            SetPwdModalOpen(false);
          }}
          identifier={identifier}
        />
      )}
    </FindUserPageBody>
  );
};

export default FindUserPage;

const FindUserPageBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4rem;
  min-width: 34rem;
  height: 80vh;

  .result-message {
    color: #2389fd;
  }

  @media ${device.mobile} {
    flex-direction: column;
    height: auto;
  }
`;

const FindAccountSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  //border-right: 1px solid black; //수직선
  min-height: 30rem;

  .find-account-container {
    height: 30rem;
    display: flex;
    flex-direction: column;
    width: 24rem;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    border-radius: 12px;
    box-shadow: 2px 2px 3px 2px lightgray;

    .insert-email {
      width: 70%;
      height: 2.4rem;
      padding: 0 0.5rem;
    }

    .find-account-button {
      width: 70%;
    }
  }

  @media ${device.mobile} {
    border-right: none; //수직선 제서
    border-bottom: 1px solid gray; // 수평선 추가
    margin-top: 4rem;
    padding-bottom: 3rem;
  }
`;

const FindPasswordSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  .find-password-container {
    height: 30rem;
    display: flex;
    flex-direction: column;
    width: 24rem;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    border-radius: 12px;
    box-shadow: 2px 2px 3px 2px lightgray;

    .insert-identifier {
      width: 70%;
      height: 2.4rem;
      padding: 0 0.5rem;
    }

    .move-find-password-button,
    .find-password-button {
      width: 70%;
    }

    .insert-pwd-code-box {
      display: flex;
      position: relative;
      width: 70%;
      align-items: center;
      justify-content: space-between;

      .insert-authcode {
        height: 2.4rem;
        padding: 0 0.5rem;
        width: 100%;
      }
      .resend-code-button,
      .remaining-time {
        position: absolute;
        color: red;
        font-size: 0.8rem;
        top: 30%;
        right: 4%;
        cursor: pointer;
      }
    }
  }

  @media ${device.mobile} {
    margin: 2rem;
  }
`;

// 수직선을 따로 긋는게 나을까 영역만큼만 긋는게 나을까
const VerticalDivider = styled.div`
  width: 1px;
  min-height: 34rem;
  background-color: gray;

  @media ${device.mobile} {
    /* width: 100%; //수평선 변경
    height: 1px; */
    display: none;
  }
`;
