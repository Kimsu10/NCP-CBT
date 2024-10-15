import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Nav from "./components/Nav/Nav";
import Practice from "./pages/Practice/Practice";
import FinishPage from "./pages/Practice/FinishPage";

const Router = () => {
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
