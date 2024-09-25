import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Nav from "./components/Nav/Nav";
import Practice from "./pages/Practice/Practice";

const Router = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:name/practice" element={<Practice />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
