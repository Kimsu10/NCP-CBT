import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Nav from "./components/Nav/Nav";
import Practice from "./pages/Practice/Practice";
import FinishPage from "./pages/Practice/FinishPage";

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
      <Nav />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:name/practice" element={<Practice />} />
        <Route path="/:name/practice/finish" element={<FinishPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
