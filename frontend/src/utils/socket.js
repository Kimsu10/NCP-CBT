import io from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (!socket || socket.connected) {
    return; // 이미 연결되어 있으면 새로 연결 X
  }

  socket = io(process.env.WEBSOCKET_URL, {
    path: "/quiz",
    withCredentials: true,
    auth: {
      token: sessionStorage.getItem("accessToken"),
    },
  });

  socket.on("connect", () => {
    console.log("서버에 연결되었습니다.");
  });

  socket.on("disconnect", () => {
    console.log("서버와의 연결이 끊어졌습니다.");
  });

  socket.on("connect_error", error => {
    console.error("연결 오류:", error);
    socket.disconnect(); // 소켓 연결 안해도 계속 요청 보내서 연결 끊어둠 - 나중에 소켓 만들때 건드리기
  });
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    console.log("서버 연결을 해제했습니다.");
  }
};

export default { connectSocket, disconnectSocket };
