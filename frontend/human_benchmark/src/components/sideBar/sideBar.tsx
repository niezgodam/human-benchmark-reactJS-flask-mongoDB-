import { useState } from "react";
import styles from "./sideBar.module.css";
import { motion } from "framer-motion";
import { opacityFadeVariants2 } from "../../assets/animationVariants";
import Treasure from "../../assets/treasure";
import Clicker from "../../assets/clicker";
import Keyboard from "../../assets/keyboard";
import Aim from "../../assets/aim";
import Brain from "../../assets/brain";
import Puzzle from "../../assets/puzzle";
import Cog from "../../assets/cog";
import { useUserInfo } from "../../contexts/UserContext";
const GAMES = [
  { title: "Aim-Trainer", icon: <Aim width={45} />, linkURL: "tests/aim" },
  { title: "Sequence", icon: <Puzzle width={45} />, linkURL: "tests/sequence" },
  { title: "Memory", icon: <Brain width={45} />, linkURL: "tests/memory" },
  { title: "Typing", icon: <Keyboard width={45} />, linkURL: "/tests/typing" },
  { title: "Clicker", icon: <Clicker width={45} />, linkURL: "/tests/clicker" },
  { title: "TZWCTR(CH)", icon: <Treasure width={45} />, linkURL: "tests/find" },
];

export default function SideBar({
  setGameCallback,
}: {
  setGameCallback: (game: string) => void;
}) {
  const [currentGame, setCurrentGame] = useState("Aim-Trainer");
  const [showLogoutButton, setShowLogoutButton] = useState(false);

  const handleGameBarClick = (game: string) => {
    setCurrentGame(game);
    setGameCallback(game);
  };

  const { checkUserStatus } = useUserInfo();

  function deleteCookie(name: string) {
    const cookieString = `${name}=; expires=${new Date(
      0
    ).toUTCString()}; path="/";`;
    document.cookie = cookieString;
    setShowLogoutButton(false);
    sessionStorage.removeItem("user");
    checkUserStatus();
  }
  return (
    <div>
      <motion.div
        variants={opacityFadeVariants2}
        initial="hidden"
        animate="visible"
        className={styles.sideBar}
      >
        <div className={styles.gamePart}>
          {GAMES.map((game, index) => (
            <div
              key={index}
              onClick={() => handleGameBarClick(game.title)}
              style={{
                backgroundColor: currentGame === game.title ? "lightgray" : "",
              }}
              className={styles.gameContainer}
            >
              <GameBar gameIcon={game.icon} gameTitle={game.title} />
            </div>
          ))}
        </div>
        <div className={styles.cogBox}>
          <div
            className={styles.optionsCOG}
            onClick={() => setShowLogoutButton((prev) => !prev)}
          >
            <Cog width={45} />
          </div>
          {showLogoutButton ? (
            <div className={styles.logoutButtonBox}>
              <div
                className={styles.logout}
                onClick={() => deleteCookie("csrftoken")}
              >
                LOGOUT
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

const GameBar = ({
  gameTitle,
  gameIcon,
}: {
  gameTitle: string;
  gameIcon: React.ReactNode;
}) => {
  return (
    <div className={styles.gameBar}>
      <div className={styles.gameBarIcon}>{gameIcon}</div>
      <div className={styles.gameBarTitle}>{gameTitle}</div>
    </div>
  );
};
