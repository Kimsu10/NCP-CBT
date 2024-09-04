import React from "react";
import styled from "styled-components";

const Modal = ({ type, closeModal }) => {
  return (
    <ModalContainer>
      <ModalContent>
        <CloseModalButton onClick={closeModal}>X</CloseModalButton>
        {type === "login" ? (
          <LoginForm>
            <h2 className="modal-title">로그인</h2>
            <input type="text" placeholder="닉네임(계정)" />
            <input type="password" placeholder="비밀번호" />
            <button>로그인</button>
          </LoginForm>
        ) : (
          <RegisterForm>
            <h2 className="modal-title">회원가입</h2>
            <input type="email" placeholder="이메일" />
            <input type="text" placeholder="닉네임(계정)" />
            <input type="password" placeholder="비밀번호" />
            <input type="password" placeholder="비밀번호 재입력" />
            <button>회원가입</button>
          </RegisterForm>
        )}
      </ModalContent>
    </ModalContainer>
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
    padding: 0.8rem;
    background-color: ${props => props.theme.mainColor};
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 2rem;
  }
`;

const RegisterForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 0.5rem;
    font-size: 1rem;
  }

  button {
    padding: 0.8rem;
    background-color: ${props => props.theme.mainColor};
    color: white;
    border: none;
    cursor: pointer;
  }
`;
