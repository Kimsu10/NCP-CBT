import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { flexRowBox } from "../../styles/Variables";
import axios from "axios";

const Modal = ({ type, closeModal }) => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    roles: "USER",
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

  const { email, username, password, confirmPassword } = formData;

  const isLoginValid = username !== "" && password !== "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    isUsernameAvailable === true;

  // 회원가입
  const handleRegister = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/form/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response.data);
      setShowLoginForm(true);
    } catch (err) {
      console.error(
        "register user error:",
        err.response ? err.response.data : err.message,
      );
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
        "http://localhost:8080/form/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const { accessToken, refreshToken } = response.data;

      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      navigate("/");
      closeModal();
    } catch (err) {
      console.error(
        "login error:",
        err.response ? err.response.data : err.message,
      );
    }
  };

  // 닉네임 중복확인
  const handleCheckNick = async () => {
    if (formData.username === "") {
      alert("사용하실 계정명을 입력해주세요.");
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8080/form/checkNick`,
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

  // email 중복확인
  const handleCheckEmail = async () => {
    if (email === "") {
      alert("이메일을 입력해주세요.");
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8080/form/checkEmail`,
          {
            params: {
              email: email,
            },
          },
        );

        const isExisted = response.data;
        if (isExisted) {
          setIsEmailAvailable(false);
          alert("이미 사용 중인 이메일입니다.");
        } else {
          setIsEmailAvailable(true);
          alert("사용 가능한 이메일입니다.");
        }
      } catch (err) {
        console.error(
          "email check error:",
          err.response ? err.response.data : err.message,
        );
      }
    }
  };

  return (
    <ModalContainer>
      <ModalContent>
        <CloseModalButton onClick={closeModal}>X</CloseModalButton>
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
              <button type="submit" disabled={!isLoginValid}>
                로그인
              </button>
              <span className="find-button"> 계정/비밀번호 찾기</span>
              <hr
                style={{
                  backgroundColor: "lightGray",
                  height: "1px",
                  border: "none",
                }}
              />
              <GithubLogin>
                <img src="/images/github.png" alt="github-icon" />
                <span> GitHub Login</span>
              </GithubLogin>
              <KakaoLogin>
                <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                  N
                </span>
                <span> Naver Login</span>
              </KakaoLogin>
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
              isFormValid={isRegisterFormValid}
              getBorderColor={getBorderColor}
              isEmailValid={isEmailValid}
              handleCheckNick={handleCheckNick}
              isUsernameAvailable={isUsernameAvailable}
              handleCheckEmail={handleCheckEmail}
              isEmailAvailable={isEmailAvailable}
            />
          </form>
        )}
      </ModalContent>
    </ModalContainer>
  );
};

const RegisterForm = ({
  email,
  username,
  password,
  confirmPassword,
  handleInputChange,
  isFormValid,
  getBorderColor,
  isEmailValid,
  handleCheckNick,
  isUsernameAvailable,
  handleCheckEmail,
  isEmailAvailable,
}) => {
  return (
    <RegisterFormContainer>
      <h2 className="modal-title">회원가입</h2>
      <input
        type="email"
        name="email"
        placeholder="이메일"
        value={email}
        onChange={handleInputChange}
        style={{
          borderColor: email.length > 0 && !isEmailValid ? "red" : "",
        }}
      />
      <CheckEmail
        onClick={handleCheckEmail}
        style={{ color: isEmailAvailable === true ? "green" : "red" }}
      >
        {isEmailAvailable === null
          ? "중복확인"
          : isEmailAvailable
            ? "사용 가능"
            : "사용 불가"}
      </CheckEmail>
      <input
        type="text"
        name="username"
        placeholder="닉네임(계정)"
        value={username}
        onChange={handleInputChange}
      />
      <CheckNick
        onClick={handleCheckNick}
        style={{ color: isUsernameAvailable === true ? "green" : "red" }}
      >
        {isUsernameAvailable === null
          ? "중복확인"
          : isUsernameAvailable
            ? "사용 가능"
            : "사용 불가"}
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
      <button type="submit" disabled={!isFormValid}>
        회원가입
      </button>
    </RegisterFormContainer>
  );
};

export default Modal;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  position: relative;
  text-align: center;
`;

const CloseModalButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: black;

  &:hover {
    color: ${props => props.theme.subColor};
    box-shadow: none;
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

const KakaoLogin = styled.button`
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
`;

const CheckEmail = styled.span`
  color: red;
  font-size: 0.8rem;
  width: 4rem;
  position: absolute;
  top: 29%;
  right: 9%;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    color: blue;
  }
`;

const CheckNick = styled.span`
  color: red;
  font-size: 0.8rem;
  width: 4rem;
  position: absolute;
  top: 42%;
  right: 9%;
  padding: 0.5rem;
  cursor: pointer;
`;
