import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Main from "./pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Nav from "./components/Nav/Nav";
import Practice from "./pages/Practice/Practice";
import FinishPage from "./pages/Practice/FinishPage";
import NotFound from "./pages/NotFound/NotFound";
import NcpMain from "./pages/Main/NcpMain";
import NcaMain from "./pages/Main/NcaMain";
import OneOnOne from "./pages/TestMatch/OneOnOne";
import TestMatch from "./pages/TestMatch/TestMatch";

const Router = () => {
  const [username, setUsername] = useState("");
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      setUsername(decodedPayload.sub);
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Nav username={username} />
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
          path="/:name/practice/finish"
          element={<PageWrapper username={username} Component={FinishPage} />}
        />
        <Route
          path="/:name/who-are-you"
          element={<PageWrapper username={username} Component={NotFound} />}
        />
        <Route
          path="/1on1"
          element={<PageWrapper username={username} Component={OneOnOne} />}
        />
        <Route
          path="/1on1/:selectedName/:roomName"
          element={<PageWrapper username={username} Component={TestMatch} />}
        />
      </Routes>
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
      <Component />
    </>
  );
};

export default Router;
