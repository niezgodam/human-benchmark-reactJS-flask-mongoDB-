import { Link } from "react-router-dom";
import styles from "./gameCard.module.css";
import { motion } from "framer-motion";
import { opacityFadeVariants2 } from "../../assets/animationVariants";

interface GameCardProps {
  gameTitle: string;
  linkURL: string;
  gameIcon?: React.ReactNode;
}

export default function GameCard({
  gameTitle,
  linkURL,
  gameIcon,
}: GameCardProps) {
  return (
    <Link to={linkURL}>
      <motion.div
        className={styles.gameCard}
        variants={opacityFadeVariants2}
        initial="hidden"
        animate="visible"
      >
        <div>{gameIcon}</div>
        <div>{gameTitle}</div>
      </motion.div>
    </Link>
  );
}
