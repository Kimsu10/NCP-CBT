import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AuthModal from "../Modal/AuthModal";
import { useNavigate, useParams } from "react-router-dom";

const Nav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || "",
  );
  const [isToken, setIsToken] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  const { name: subjectName } = useParams();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("accessToken");
    const storedUsername = sessionStorage.getItem("username");
    if (storedToken) {
      setIsToken(storedToken);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [token]);

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

  const openProfile = () => {
    setIsProfileOpen(prev => !prev);
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username", username);
    window.location.reload();
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
      <NavLogo
        src="/images/logo.png"
        alt="logo"
        onClick={() => navigate("/")}
      />
      <SubjectTitle>{subjectName}</SubjectTitle>
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
              <>
                <ProfileIcon
                  className="bi bi-person-circle"
                  onClick={openProfile}
                ></ProfileIcon>
                <Username onClick={openProfile}>
                  <b>{username}</b>
                </Username>
                {isProfileOpen && (
                  <ProfileMenu>
                    {/* <UserProfile>내 정보</UserProfile> 나중에 추가작업시*/}
                    <LogoutButton onClick={logout}>로그아웃</LogoutButton>
                  </ProfileMenu>
                )}
              </>
            )}
          </>
        )}
        {windowWidth <= 720 && (
          <>
            {!token ? (
              <>
                <ListIcon className="bi bi-list" onClick={openList} />
                {isListOpen && (
                  <MobileList>
                    <MobileLogin onClick={() => openModal("login")}>
                      로그인
                    </MobileLogin>
                    <MobileRegister onClick={() => openModal("register")}>
                      회원가입
                    </MobileRegister>
                  </MobileList>
                )}
              </>
            ) : (
              <>
                <ProfileIcon
                  className="bi bi-person-circle"
                  onClick={openProfile}
                />
                {isProfileOpen && (
                  <MobileList>
                    <UserProfile>내 정보</UserProfile>
                    <MobileLogout onClick={logout}>로그아웃</MobileLogout>
                  </MobileList>
                )}
              </>
            )}
          </>
        )}
      </ControllerBox>
      {isModalOpen && (
        <AuthModal
          type={modalType}
          closeModal={closeModal}
          openModal={openModal}
        />
      )}
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
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const NavLogo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.4rem;
  opacity: 0.9;
  cursor: pointer;
`;

const SubjectTitle = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  padding-left: 4rem;

  @media (max-width: 720px) {
    padding-left: 0;
  }
`;

const ControllerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.white};
  gap: 1rem;
`;

const Username = styled.span`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
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
  cursor: pointer;
  z-index: 99;
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

const ProfileMenu = styled.div`
  position: absolute;
  top: 4.1rem;
  right: 1rem;
  background-color: ${props => props.theme.mainColor};
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  z-index: 99;
`;

const LogoutButton = styled.span`
  font-weight: 700;
  cursor: pointer;
  color: ${props => props.theme.white};

  &:hover {
    text-decoration: underline;
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
  z-index: 9999;
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

const MobileLogout = styled.span`
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
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
