import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { flexRowBox } from "../../styles/Variables";
import axios from "axios";

const AuthModal = ({ type, closeModal }) => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [isRequestBlocked, setIsRequestBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showCheckCode, setShowCheckCode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    roles: "USER",
    code: "",
  });

  const handleInputChange = e => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "username") {
      setIsUsernameAvailable(null);
    } else if (name === "email") {
      setIsEmailAvailable(null);
    }
  };

  const { email, username, password, confirmPassword, code } = formData;

  const isLoginValid = username !== "" && password !== "";
  const emailRegex = /^[^\s@]{1,}@[^\s@]{3,}\.[^\s@]{3,}$/;
  const isEmailValid = emailRegex.test(email);

  const isPasswordMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const getBorderColor = value =>
    value.length > 0 && !isPasswordMatch ? "red" : "";

  const isRegisterFormValid =
    email.length > 0 &&
    username.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    isPasswordMatch &&
    isEmailValid &&
    isEmailAvailable === true &&
    isUsernameAvailable === true &&
    isEmailVerified === true;

  // 회원가입
  const handleRegister = async e => {
    e.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/form/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setShowLoginForm(true);
    } catch (err) {
      console.error(
        "register user error:",
        err.response ? err.response.data : err.message,
      );
      alert(err.response.data);
    }
  };

  // 로그인
  const handleLogin = async e => {
    e.preventDefault();
    try {
      const loginData = {
        username: formData.username,
        password: formData.password,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/form/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status === 400) {
        navigate("/");
        alert("사용자 정보가 없습니다. 로그인을 다시 시도해주세요.");
      }

      if (response.status === 200) {
        const data = await response.headers.get("Authorization");
        const accessToken = data.split(" ")[1];
        sessionStorage.setItem("accessToken", accessToken);
        response.headers.get("Set-Cookie");
        sessionStorage.setItem("username", username);
        window.location.reload();
        navigate("/");
        closeModal();
      }
    } catch (err) {
      console.error(
        "login error:",
        err.response ? err.response.data : err.message,
      );
      alert("계정 또는 비밀번호가 다릅니다.");
    }
  };

  // 닉네임 중복확인
  const handleCheckNick = async () => {
    if (formData.username === "") {
      alert("사용하실 계정명을 입력해주세요.");
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/form/checkNick`,
          {
            params: {
              username: formData.username,
            },
          },
        );

        const isExisted = response.data;
        if (isExisted) {
          setIsUsernameAvailable(false);
          alert("이미 사용 중인 닉네임입니다.");
        } else {
          setIsUsernameAvailable(true);
          alert("사용 가능한 닉네임입니다.");
        }
      } catch (err) {
        console.error(
          "nickname check error:",
          err.response ? err.response.data : err.message,
        );
      }
    }
  };

  // email 인증 요청 및 중복확인
  const handleCheckEmail = async () => {
    if (email === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("유효하지 않은 이메일 형식입니다.");
      return;
    }

    setIsEmailAvailable(null);
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

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/form/email-code?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        const data = await response.text();
        if (response.status === 400) {
          setIsEmailAvailable(false);
          alert(data || "이미 사용 중인 이메일입니다.");
          clearInterval(interval);
          setIsRequestBlocked(false);
        } else {
          alert("서버와의 연결에 실패했습니다.");
          setShowCheckCode(true);
          console.error("이메일 인증 코드 요청 에러:", data);
        }
      } else {
        setShowCheckCode(true);
        alert("인증 코드가 발송되었습니다. 이메일을 확인해주세요.");
      }
    } catch (err) {
      console.error("이메일 인증 코드 요청 에러:", err.message);
      alert("서버와의 연결에 실패했습니다.");
      clearInterval(interval);
      setIsRequestBlocked(false);
    }
  };

  // email 인증코드 POST 요청
  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/form/email-verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, authCode: code }),
        },
      );

      if (response.ok) {
        setIsEmailVerified(true);
        setIsEmailAvailable(true);
        alert("이메일 인증 성공!");
      } else {
        const errorMessage = await response.text();
        setIsEmailVerified(false);
        alert(errorMessage);
      }
    } catch (err) {
      console.error("이메일 인증 에러:", err.message);
      alert("서버와의 연결에 실패했습니다.");
    }
  };

  // 네이버 로그인
  const doNaverLogin = () => {
    let state = encodeURI(process.env.REACT_APP_NAVER_REDIRECT_URI);
    window.location.href =
      "https://nid.naver.com/oauth2.0/authorize?response_type=code" +
      "&client_id=" +
      process.env.REACT_APP_NAVER_CLIENT_ID +
      "&redirect_uri=" +
      process.env.REACT_APP_NAVER_REDIRECT_URI +
      "&state=" +
      state;
  };

  // 깃허브 로그인 페이지로 전송
  const doGitLogin = () => {
    window.location.href =
      "https://github.com/login/oauth/authorize?client_id=" +
      process.env.REACT_APP_GITHUB_CLIENT_ID +
      "&scope=user:email";
  };

  return (
    <AuthModalContainer>
      <AuthModalContent>
        <span className="closeAuthModalButton" onClick={closeModal}>
          X
        </span>
        {showLoginForm || type === "login" ? (
          <form onSubmit={handleLogin}>
            <LoginForm>
              <h2 className="modal-title">로그인</h2>
              <input
                type="text"
                name="username"
                placeholder="닉네임(계정)"
                value={username}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={password}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="login-btn"
                disabled={!isLoginValid}
              >
                로그인
              </button>
              <span
                className="find-button"
                onClick={() => navigate("/find-account")}
              >
                계정/비밀번호 찾기
              </span>
              <hr
                style={{
                  backgroundColor: "lightGray",
                  height: "1px",
                  border: "none",
                }}
              />
              <GithubLogin type="button" onClick={() => doGitLogin()}>
                <img src="/images/github.png" alt="github-icon" />
                <span> GitHub Login</span>
              </GithubLogin>
              <NaverLogin type="button" onClick={() => doNaverLogin()}>
                <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                  N
                </span>
                <span> Naver Login</span>
              </NaverLogin>
            </LoginForm>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <RegisterForm
              email={email}
              username={username}
              password={password}
              confirmPassword={confirmPassword}
              handleInputChange={handleInputChange}
              getBorderColor={getBorderColor}
              verifyEmail={verifyEmail}
              handleCheckNick={handleCheckNick}
              isUsernameAvailable={isUsernameAvailable}
              handleCheckEmail={handleCheckEmail}
              isEmailAvailable={isEmailAvailable}
              isEmailValid={isEmailValid}
              showCheckCode={showCheckCode}
              isEmailVerified={isEmailVerified}
              isRequestBlocked={isRequestBlocked}
              remainingTime={remainingTime}
              isRegisterFormValid={isRegisterFormValid}
            />
          </form>
        )}
      </AuthModalContent>
    </AuthModalContainer>
  );
};

const RegisterForm = ({
  email,
  username,
  password,
  confirmPassword,
  code,
  handleInputChange,
  getBorderColor,
  isEmailValid,
  handleCheckNick,
  isUsernameAvailable,
  handleCheckEmail,
  isEmailAvailable,
  verifyEmail,
  isEmailVerified,
  showCheckCode,
  isRequestBlocked,
  remainingTime,
  isRegisterFormValid,
}) => {
  return (
    <RegisterFormContainer>
      <h2 className="modal-title">회원가입</h2>
      <CheckEmail>
        <input
          type="email"
          name="email"
          className="email-input"
          placeholder="이메일"
          value={email}
          onChange={handleInputChange}
          style={{
            borderColor: email.length > 0 && !isEmailValid ? "red" : "",
          }}
          disabled={isEmailVerified}
        />
        <span
          className="checkEmail-btn"
          onClick={
            !isEmailVerified && !isRequestBlocked ? handleCheckEmail : null
          }
          disabled={isEmailVerified}
          style={{
            color: isEmailAvailable === true ? "green" : "red",
            cursor: isEmailAvailable === true ? "not-allowed" : "pointer",
          }}
        >
          {isEmailAvailable === null
            ? isRequestBlocked
              ? `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, "0")}`
              : "인증 요청"
            : isEmailAvailable
              ? "사용 가능"
              : "인증 요청"}
        </span>
      </CheckEmail>
      {showCheckCode && (
        <CheckCode>
          <input
            type="text"
            name="code"
            className="insert-code"
            placeholder="인증 코드"
            value={code}
            onChange={handleInputChange}
          />
          <span
            className="checkCode-btn"
            onClick={verifyEmail}
            style={{ color: isEmailVerified === true ? "green" : "red" }}
          >
            {isEmailVerified === null ? "인증 확인" : "인증 완료"}
          </span>
        </CheckCode>
      )}
      <CheckNick>
        <input
          type="text"
          className="insert-nick"
          name="username"
          placeholder="닉네임(계정)"
          value={username}
          onChange={handleInputChange}
        />
        <span
          className="checkNick-btn"
          onClick={handleCheckNick}
          style={{ color: isUsernameAvailable === true ? "green" : "red" }}
        >
          {isUsernameAvailable === null
            ? "중복확인"
            : isUsernameAvailable
              ? "사용 가능"
              : "사용 불가"}
        </span>
      </CheckNick>
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={password}
        onChange={handleInputChange}
        style={{
          borderColor: getBorderColor(password),
        }}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="비밀번호 재입력"
        value={confirmPassword}
        onChange={handleInputChange}
        style={{
          borderColor: getBorderColor(confirmPassword),
        }}
      />
      <button type="submit" disabled={!isRegisterFormValid}>
        회원가입
      </button>
    </RegisterFormContainer>
  );
};

export default AuthModal;

const AuthModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  button {
    width: 100%;
  }
`;

const AuthModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  position: relative;
  text-align: center;

  .closeAuthModalButton {
    position: absolute;
    top: 3%;
    right: 5%;
    background: none;
    border: none;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    color: black;

    &:hover {
      color: ${props => props.theme.subColor};
      box-shadow: none;
    }
  }
`;

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 0.5rem;
    font-size: 1rem;
  }

  button {
    &:disabled {
      background-color: lightgray;
      cursor: not-allowed;
    }
  }

  .find-button {
    font-size: 0.9rem;
    color: gray;
    text-align: right;
    cursor: pointer;

    &:hover {
      text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
    }
  }
`;

const GithubLogin = styled.button`
  ${flexRowBox("row", "center", "center")};
  gap: 1rem;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.black}!important;
  height: 2.8rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const NaverLogin = styled.button`
  ${flexRowBox("row", "center", "center")};
  gap: 1rem;
  border-radius: 0.5rem;
  height: 2.8rem;
  background-color: ${props => props.theme.mainColor};
`;

const RegisterFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  button {
    &:disabled {
      background-color: lightgray;
      cursor: not-allowed;
    }
  }

  .server-message {
    color: red;
  }
`;

// 이메일 중복 확인
const CheckEmail = styled.div`
  position: relative;

  .email-input {
    width: 100%;
  }

  .checkEmail-btn {
    color: red;
    font-size: 0.8rem;
    width: 4rem;
    position: absolute;
    top: 8%;
    right: 0%;
    cursor: pointer;
    padding: 0.5rem;
  }
`;

// 이메일 인증 번호 입력
const CheckCode = styled.div`
  position: relative;

  .insert-code {
    width: 100%;
  }

  .checkCode-btn {
    width: 4rem;
    font-size: 0.8rem;
    color: red;
    position: absolute;
    top: 8%;
    right: 0;
    cursor: pointer;
    padding: 0.5rem;
  }
`;

// 닉네임 중복확인
const CheckNick = styled.div`
  position: relative;

  .insert-nick {
    width: 100%;
  }

  .checkNick-btn {
    color: red;
    font-size: 0.8rem;
    width: 4rem;
    position: absolute;
    top: 8%;
    right: 0;
    padding: 0.5rem;
    cursor: pointer;
  }
`;
