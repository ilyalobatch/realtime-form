import ModalManager from "./components/modals/ModalManager";
import { useEffect } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { useAuthStore } from "./store/authStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/layout/Navbar";
import Main from "./components/layout/Main";
import io from "socket.io-client";

const socket = io(
  process.env.REACT_APP_SOCKET_LINK || "http://localhost:4000/"
);

function App() {
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    onAuthStateChanged(auth, (userCredentials) => {
      if (userCredentials) {
        signIn(userCredentials);
      } else {
        signOut();
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser]);

  return (
    <>
      <ToastContainer theme="colored" position="bottom-right" hideProgressBar />
      <ModalManager />
      <div className="app">
        <Navbar />
        <Main socket={socket} />
      </div>
    </>
  );
}

export default App;
