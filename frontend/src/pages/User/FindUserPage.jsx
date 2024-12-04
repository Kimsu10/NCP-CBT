import styled, { css } from "styled-components";
import { device } from "../../styles/theme";
import { useState } from "react";

const FindUserPage = () => {
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");

  const handleFindAccount = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    console.log(email);

    try {
      const response = await fetch(
        `http://localhost:8080/form/find-account?email=${encodeURIComponent(email)}`,
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

  return (
    <FindUserPageBody>
      <FindAccountSection>
        <div className="find-account-container">
          <h1>계정 찾기</h1>
          <p>가입한 이메일을 입력해주세요</p>
          <input
            type="email"
            className="insert-email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="find-account-button" onClick={handleFindAccount}>
            계정 찾기
          </button>
          {account && <h2>찾은 계정: {account}</h2>}
        </div>
      </FindAccountSection>
      <VerticalDivider />
      <FindPasswordSection>
        <div className="find-password-container">
          <h1>비밀번호 재설정</h1>
          <p>계정 또는 이메일을 입력해주세요</p>
          <input type="text" className="insert-account" />
          <button className="find-password-button">인증 번호 보내기</button>
        </div>
      </FindPasswordSection>
    </FindUserPageBody>
  );
};

export default FindUserPage;

const FindUserPageBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34rem;
  height: 80vh;

  @media ${device.mobile} {
    flex-direction: column;
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
    border: 1px solid gray;

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
    border-bottom: 1px solid black; // 수평선 추가
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
    border: 1px solid gray;

    .insert-account {
      width: 70%;
      height: 2.4rem;
      padding: 0 0.5rem;
    }

    .find-password-button {
      width: 70%;
    }
  }
`;

// 수직선을 따로 긋는게 나을까 영역만큼만 긋는게 나을까
const VerticalDivider = styled.div`
  width: 1px;
  min-height: 34rem;
  background-color: black;

  @media ${device.mobile} {
    /* width: 100%; //수평선 변경
    height: 1px; */
    display: none;
  }
`;
