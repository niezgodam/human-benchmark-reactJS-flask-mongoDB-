import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landingPage/landingPage";
import AuthPage from "./pages/authPage/authPage";
import LoginPage from "./pages/authPage/loginPage";
import AimTrainer from "./pages/aimTrainer/aimTrainer";
import NavBar from "./components/navbar/navBar";
import SequenceMemory from "./pages/sequenceMemory/sequenceMemory";
import MemoryGame from "./pages/memoryGame/memoryGame";
import UserDashboardPage from "./pages/userDashboardPage/userDashboardPage";
import SpeedClicker from "./pages/speedClicker/speedClicker";
import TypingGame from "./pages/typingGame/typingGame";
import FindGame from "./pages/findGame/findGame";
import { useEffect } from "react";
import { useUserInfo } from "./contexts/UserContext";

function App() {
  const location = useLocation();
  const { checkUserStatus, isUserAuthenticated } = useUserInfo();
  useEffect(() => {
    checkUserStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.cookie]);

  return (
    <div>
      {location.pathname !== "/auth" && location.pathname !== "/login" ? (
        <NavBar />
      ) : null}
      <Routes>
        <Route
          path="/"
          element={
            isUserAuthenticated ? <LandingPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/auth"
          element={isUserAuthenticated ? <Navigate to="/" /> : <AuthPage />}
        />
        <Route
          path="/login"
          element={isUserAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/profile"
          element={
            isUserAuthenticated ? (
              <UserDashboardPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/tests/aim"
          element={
            isUserAuthenticated ? <AimTrainer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tests/sequence"
          element={
            isUserAuthenticated ? <SequenceMemory /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tests/memory"
          element={
            isUserAuthenticated ? <MemoryGame /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tests/typing"
          element={
            isUserAuthenticated ? <TypingGame /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tests/clicker"
          element={
            isUserAuthenticated ? <SpeedClicker /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tests/find"
          element={
            isUserAuthenticated ? <FindGame /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
