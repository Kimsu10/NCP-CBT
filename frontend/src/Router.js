import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Main from "./pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Nav from "./components/Nav/Nav";
import Practice from "./pages/Practice/Practice";
import FinishPage from "./pages/Practice/FinishPage";
import NotFound from "./pages/NotFound/NotFound";
import NcpMain from "./pages/Main/NcpMain";
import Exam from "./pages/Exam/Exam";
import ExamFinishPage from "./pages/Practice/ExamFinishPage";
import NcaMain from "./pages/Main/NcaMain";
import TestMatch from "./pages/TestMatch/TestMatch";
import MatchResult from "./pages/TestMatch/MatchResult";
import MatchWaiting from "./pages/TestMatch/MatchWaiting";
import Quiz from "./pages/TestMatch/Quiz";
import FindUserPage from "./pages/User/FindUserPage";
import Admin from "./pages/Admin/Admin";
import Sponsor from "./components/Ads/Sponsor";
import SponsorSuccess from "./components/Ads/SponsorSuccess";
import SponsorFail from "./components/Ads/SponsorFail";

const Router = () => {
  const [username, setUsername] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      setUsername(decodedPayload.sub);

      // 관리자 여부 확인
      const role = decodedPayload.auth;
      if (role === "ROLE_ADMIN") {
        setIsAdmin(true);
      }
    }
  }, [token]);

  return (
    <BrowserRouter>
      {isAdmin ? (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Nav username={username} />
                <Admin />
              </>
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Nav nick={username} />
                <Main />
              </>
            }
          />
          <Route path="/:name" element={<PageSwitch username={username} />} />
          <Route
            path="/:name/practice"
            element={<PageWrapper username={username} Component={Practice} />}
          />
          <Route
            path="/:name/exam"
            element={<PageWrapper username={username} Component={Exam} />}
          />
          <Route
            path="/:name/practice/finish"
            element={<PageWrapper username={username} Component={FinishPage} />}
          />
          <Route
            path="/:name/exam/finish"
            element={
              <PageWrapper username={username} Component={ExamFinishPage} />
            }
          />
          <Route
            path="/:name/who-are-you"
            element={<PageWrapper username={username} Component={NotFound} />}
          />
          <Route
            path="/quiz"
            element={<PageWrapper username={username} Component={Quiz} />}
          />
          <Route
            path="/quiz/:selectedName/:roomName"
            element={
              <PageWrapper username={username} Component={MatchWaiting} />
            }
          />
          <Route
            path="/quiz/:selectedName/:roomName/result"
            element={
              <PageWrapper username={username} Component={MatchResult} />
            }
          />
          <Route
            path="/find-account"
            element={<PageWrapper Component={FindUserPage} />}
          />
          {/* 이 아래는 후원기능용 테스트 겸 사이즈 확인용  */}
          <Route
            path="/sponsor"
            username={username}
            element={<PageWrapper Component={Sponsor} />}
          />
          <Route
            path="/sponsor/success"
            element={<PageWrapper Component={SponsorSuccess} />}
          />
          <Route
            path="/sponsor/fail"
            element={<PageWrapper Component={SponsorFail} />}
          />
        </Routes>
      )}
      <Footer />
    </BrowserRouter>
  );
};

const PageSwitch = ({ username }) => {
  const { name } = useParams();

  const getComponent = () => {
    switch (name) {
      case "NCA":
        return <NcaMain />;
      default:
        return <NcpMain />;
    }
  };

  return (
    <>
      <Nav username={username} subjectName={name} />
      {getComponent()}
    </>
  );
};

const PageWrapper = ({ username, Component }) => {
  const { name, selectedName } = useParams();
  return (
    <>
      <Nav username={username} subjectName={name || selectedName} />
      <Component username={username} />
    </>
  );
};

export default Router;
