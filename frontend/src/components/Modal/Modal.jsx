import React, { useState } from "react";
import styled from "styled-components";
import { flexRowBox } from "../../styles/Variables";
import axios from "axios";

const Modal = ({type, closeModal }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
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
  };

  const { email, username, password, confirmPassword } = formData;

  const isLoginValid = username !== "" && password !== "";
  const isEmailValid = email.length > 0 && !email.includes("@");

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
    !isEmailValid;

  const handleRegister = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post(`http://localhost:8080/form/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);
      setShowLoginForm(true); 

    } catch (err) {
      console.error('register user error:', err.response ? err.response.data : err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
        const loginData = {
            username: formData.username,
            password: formData.password,
        };

        const response = await axios.post('http://localhost:8080/form/login', loginData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { accessToken, refreshToken } = response.data;

        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);

        console.log("login success:", response.data);
        
    } catch (err) {
        console.error('login error:', err.response ? err.response.data : err.message);
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
              <button type="submit" disabled={!isLoginValid}>로그인</button>
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
                <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>N</span>
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
          borderColor: isEmailValid ? "red" : "",
        }}
      />
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
      <button type="submit" disabled={!isFormValid}>회원가입</button> 
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
