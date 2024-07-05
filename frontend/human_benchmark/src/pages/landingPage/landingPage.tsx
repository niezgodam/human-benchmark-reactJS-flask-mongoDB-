import GameCard from "../../components/gameCard/gameCard";
import styles from "./landingPage.module.css";
import Keyboard from "../../assets/keyboard";
import Clicker from "../../assets/clicker";
import Treasure from "../../assets/treasure";
import Brain from "../../assets/brain";
import Puzzle from "../../assets/puzzle";
import Aim from "../../assets/aim";

const GAMES = [
  { title: "Aim Trainer", icon: <Aim />, linkURL: "tests/aim" },
  { title: "Sequence", icon: <Puzzle />, linkURL: "tests/sequence" },
  { title: "Memory", icon: <Brain />, linkURL: "tests/memory" },
  { title: "Typing", icon: <Keyboard />, linkURL: "/tests/typing" },
  { title: "Clicker", icon: <Clicker />, linkURL: "/tests/clicker" },
  { title: "Find Game", icon: <Treasure />, linkURL: "tests/find" },
];

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      {GAMES.map((game, index) => (
        <GameCard
          gameIcon={game.icon}
          gameTitle={game.title}
          linkURL={game.linkURL}
          key={index}
        />
      ))}
    </div>
  );
}
