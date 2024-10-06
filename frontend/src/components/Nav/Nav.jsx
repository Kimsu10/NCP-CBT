import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "../Modal/Modal";

const Nav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const token = localStorage.getItem("token");

  const openModal = type => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  const openList = () => {
    setIsListOpen(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 720) {
        setIsListOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <NavBody>
      <NavLogo src="/images/logo.png" alt="logo" />
      <ControllerBox>
        {windowWidth > 720 && (
          <>
            {!token ? (
              <>
                <Login onClick={() => openModal("login")}>로그인</Login>
                <Register onClick={() => openModal("register")}>
                  회원가입
                </Register>
              </>
            ) : (
              <ProfileIcon className="bi bi-person-circle"></ProfileIcon>
            )}
          </>
        )}
        {windowWidth <= 720 && (
          <>
            <ListIcon className="bi bi-list" onClick={openList} />
            {isListOpen && (
              <MobileList>
                {token ? (
                  <UserProfile>내 정보</UserProfile>
                ) : (
                  <>
                    <MobileLogin onClick={() => openModal("login")}>
                      로그인
                    </MobileLogin>
                    <MobileRegister onClick={() => openModal("register")}>
                      회원가입
                    </MobileRegister>
                  </>
                )}
              </MobileList>
            )}
          </>
        )}
      </ControllerBox>
      {isModalOpen && <Modal type={modalType} closeModal={closeModal} openModal={openModal} />}
    </NavBody>
  );
};

export default Nav;

const NavBody = styled.div`
  width: 100%;
  height: 4rem;
  background-color: ${props => props.theme.mainColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem 0 1rem;
`;

const NavLogo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.4rem;
  opacity: 0.9;
`;

const ControllerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.white};
  gap: 1rem;
`;

const Login = styled.span`
  cursor: pointer;
  font-weight: 700;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

const Register = styled.span`
  cursor: pointer;
  font-weight: 700;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

const ProfileIcon = styled.i`
  font-size: 1.8rem;
  color: ${props => props.theme.white};
`;

const ListIcon = styled.i`
  font-size: 1.8rem;
  color: ${props => props.theme.white};
  display: none;

  @media (max-width: 720px) {
    display: block;
  }

  &:hover {
    color: ${props => props.theme.hoverColor};
  }
`;

const MobileList = styled.div`
  position: absolute;
  top: 4.1rem;
  right: 0.4rem;
  background-color: ${props => props.theme.mainColor};
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 1rem;
`;

const MobileLogin = styled.span`
  font-weight: 700;
  cursor: pointer;
  color: ${props => props.theme.white};

  &:hover {
    text-decoration: underline;
  }
`;

const MobileRegister = styled.span`
  font-weight: 700;
  cursor: pointer;
  color: ${props => props.theme.white};

  &:hover {
    text-decoration: underline;
  }
`;

const UserProfile = styled.div`
  font-weight: 700;
  color: ${props => props.theme.white};
`;
