import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Main from "./pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Nav from "./components/Nav/Nav";
import Practice from "./pages/Practice/Practice";
import FinishPage from "./pages/Practice/FinishPage";
import NotFound from "./pages/NotFound/NotFound";
import NcpMain from "./pages/Main/NcpMain";
import MatchPage from "./pages/TestMatch/MatchPage";
import OneOnOne from "./pages/TestMatch/OneOnOne";

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
        <Route
          path="/:name"
          element={<PageWrapper username={username} Component={NcpMain} />}
        />
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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

const PageWrapper = ({ username, Component }) => {
  const { name } = useParams();
  return (
    <>
      <Nav username={username} subjectName={name} />
      <Component />
    </>
  );
};

export default Router;
