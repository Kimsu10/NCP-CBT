import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AuthModal from "../Modal/AuthModal";
import { useNavigate, useParams } from "react-router-dom";

const Nav = ({ nick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isToken, setIsToken] = useState(false);
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || "",
  );

  const navigate = useNavigate();

  const { name: subjectName } = useParams();

  const getAccessToken = () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      const currentTime = new Date().getTime();

      if (currentTime > exp) {
        sessionStorage.removeItem("accessToken");
        return null;
      }

      return token;
    } catch (error) {
      console.error("토큰 검증 중 오류:", error);
      sessionStorage.removeItem("accessToken");
      return null;
    }
  };

  const handleUpdateToken = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/refreshToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (response.ok) {
        const newAccessToken = response.headers.get("Authorization");
        if (newAccessToken) {
          const accessToken = newAccessToken.split(" ")[1];

          sessionStorage.setItem("accessToken", accessToken);
          response.headers.get("Set-Cookie");

          setIsToken(true);
          window.location.reload();
        }
      }

      if (response.status === 401) {
        setIsToken(false);
        // alert("사용자 정보가 만료되었습니다. 다시 로그인 해주세요.");
        // navigate("/");
      }
    } catch (error) {
      console.error("토큰 갱신 중 오류 발생", error);
      setIsToken(false);
      // navigate("/");
    }
  };

  // 로그인 유지를 위한 토큰 검증
  useEffect(() => {
    const token = getAccessToken();
    const storedUsername = sessionStorage.getItem("username");

    if (token) {
      setIsToken(true);
    } else if (!token && nick) {
      handleUpdateToken();
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

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
    setIsToken(false);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username", username);
    deleteCookie();
    navigate("/");
  };

  const deleteCookie = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/form/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.ok) {
        sessionStorage.removeItem("accessToken");
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
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
            {!isToken ? (
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
                  <b>{nick}</b>
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
            {!isToken ? (
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
                <Username onClick={openProfile}>
                  <b>{nick}</b>
                </Username>
                {isProfileOpen && (
                  <MobileList>
                    {/* <UserProfile>내 정보</UserProfile> */}
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
