import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import styled from "styled-components";

const TestMatch = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      path: "/testMatch",
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

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/test");
      console.log(response.data);
    } catch (error) {
      console.error("GET 요청 실패:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <TestMatchBody>
        <h1>Test Match Page</h1>
        {message && <p>서버 응답: {message}</p>}
      </TestMatchBody>
    </>
  );
};

export default TestMatch;

const TestMatchBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6rem 0;
`;
