import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import styled from "styled-components";
import TestMatch from "./TestMatch";

const MatchResult = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  // Socket연결
  useEffect(() => {
    const newSocket = io(`${process.env.WEBSOCKET_URL}`, {
      path: "/quiz",
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");

      newSocket.emit("greet", "안녕");
    });

    newSocket.on("response", data => {
      console.log("Response from server:", data);
      setMessage(data);
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // NodeJS 통신
  const fetchTest = async () => {
    try {
      const response = await axios.get(`${process.env.WEBSOCKET_URL}/test`);
      console.log(response.data);
    } catch (error) {
      console.error("GET 요청 실패:", error);
    }
  };

  const score = sessionStorage.getItem("score");
  console.log("matchResult 페이지에서 들어온 세션의 스코어", score);

  useEffect(() => {
    fetchTest();
  }, []);

  return (
    <>
      <TestMatchBody>
        <h1>Test Match Page</h1>
        {message && <p>서버 응답: {message}</p>}
        <TestMatch />
      </TestMatchBody>
    </>
  );
};

export default MatchResult;

const TestMatchBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6rem 0;
`;
