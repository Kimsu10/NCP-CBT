import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../Modal/Modal";

const Nav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const openModal = type => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  return (
    <NavBody>
      <NavLogo />
      <ControllerBox>
        <Login onClick={() => openModal("login")}>로그인</Login>
        <Register onClick={() => openModal("register")}>회원가입</Register>
      </ControllerBox>
      {isModalOpen && <Modal type={modalType} closeModal={closeModal} />}
    </NavBody>
  );
};

export default Nav;

const NavBody = styled.div`
  width: 100vw;
  height: 4rem;
  background-color: ${props => props.theme.mainColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

const NavLogo = styled.img`
  width: 3rem;
  height: 3rem;
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
`;

const Register = styled.span`
  cursor: pointer;
  font-weight: 700;

  &:hover {
    text-decoration: underline;
  }
`;
