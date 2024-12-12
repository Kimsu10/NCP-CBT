import { useState } from "react";
import styled from "styled-components";

const SetPwdModal = ({ onClose, onSubmit, identifier }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/form/renewPassword`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: identifier,
          password: newPassword,
        }),
      },
    );

    const resMessage = await response.text();

    if (response.ok) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      onSubmit(newPassword);
      onClose();
    } else {
      setMessage(resMessage);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>비밀번호 재설정</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="set-username"
            value={identifier}
            readOnly
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {message && <p className="server-message">{message}</p>}
          <div className="button-control-box">
            <button type="submit">비밀번호 변경</button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(211, 211, 211, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 32rem;
  max-width: 24rem;
  height: 28rem;
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 2rem;
    text-align: center;
  }

  .set-username {
    color: gray;
  }

  input {
    padding: 0.5rem;
    margin: 0.5rem 0;
    width: 100%;
  }

  .server-message {
    margin-top: 1rem;
    color: red;
    text-align: center;
  }

  .button-control-box {
    width: 100%;
    margin: 2rem 0;
    display: flex;
    justify-content: space-around;

    button {
      width: 47%;
    }
  }
`;

export default SetPwdModal;
