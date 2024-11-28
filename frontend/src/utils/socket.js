import io from "socket.io-client";

const socket = io("http://localhost:4000", {
  path: "/quiz",
  withCredentials: true,
  auth: {
    token: sessionStorage.getItem("accessToken"),
  },
});

export default socket;
