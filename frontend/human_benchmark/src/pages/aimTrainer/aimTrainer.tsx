import { useEffect, useState } from "react";
import Timer from "../../assets/timer";
import styles from "./aimTrainer.module.css";
import { motion } from "framer-motion";
import blaster from "/blaster.wav";
import backgroundMusic from "/backgroundMusic.wav";
import { useLocation } from "react-router-dom";
import Ufo from "../../assets/ufo";
import MusicON from "../../assets/musicON";
import MusicOFF from "../../assets/musicOFF";
import {
  gameContainerVariants,
  opacityFadeVariants,
} from "../../assets/animationVariants";
import axios from "axios";
import { useUserInfo } from "../../contexts/UserContext";

export default function AimTrainer() {
  const MAX_CLICKS = 12;
  const [targetX, setTargetX] = useState(50);
  const [targetY, setTargetY] = useState(50);
  const [clicksLeft, setClicksLeft] = useState(MAX_CLICKS);
  const [missedClicks, setMissedClicks] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const location = useLocation();
  const [bgMusic] = useState(new Audio(backgroundMusic));
  const [blasterSound] = useState(new Audio(blaster));
  const [isMusicON, setIsMusicON] = useState(true);

  const { userInfo } = useUserInfo();

  const token = sessionStorage.getItem("token");

  const post = async () => {
    if (token) {
      try {
        const res = await axios.post(
          "http://127.0.0.1:5000/aim-trainer",
          {
            id: JSON.stringify(userInfo._id),
            accuracy: (
              ((MAX_CLICKS - missedClicks) / MAX_CLICKS) *
              100
            ).toFixed(2),
            average_time: ((endTime - startTime) / MAX_CLICKS).toFixed(2),
            timestamp: new Date().toISOString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: JSON.parse(token),
            },
            withCredentials: true,
          }
        );
        console.log("Response received");
        if (res.status === 200) {
          console.log("Success");
          console.log(res.data);
        } else {
          console.log(`Unexpected status code: ${res.status}`);
        }
      } catch (error) {
        console.error("Error occurred while posting turns:", error);
      }
    }
  };

  const onTargetClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (clicksLeft > 0) {
      if (clicksLeft === MAX_CLICKS && startTime === 0) {
        setStartTime(Date.now());
      }
      blasterSound.volume = 0.3;
      if (isMusicON) {
        blasterSound.play();
      }
      setTargetX(Math.floor(Math.random() * 80) + 10);
      setTargetY(Math.floor(Math.random() * 80) + 10);
      setClicksLeft((prev) => prev - 1);
    }
  };

  const onOutsideTargetClick = () => {
    if (clicksLeft > 0) {
      if (clicksLeft === MAX_CLICKS && startTime === 0) {
        setStartTime(Date.now());
      }
      setMissedClicks((prev) => prev + 1);
      setClicksLeft((prev) => prev - 1);
    }
  };

  const resetGame = () => {
    setClicksLeft(MAX_CLICKS);
    setMissedClicks(0);
    setStartTime(0);
    setEndTime(0);
    setTargetX(50);
    setTargetY(50);
  };

  useEffect(() => {
    if (clicksLeft === 0 && startTime !== 0) {
      setEndTime(Date.now());
    }

    if (clicksLeft === MAX_CLICKS - 1 && isMusicON) {
      bgMusic.play();
    }

    if (clicksLeft === 0) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgMusic, clicksLeft, startTime]);

  useEffect(() => {
    if (endTime > 0) {
      post();
    }
  }, [endTime]);

  useEffect(() => {
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [location, bgMusic]);

  const handleMusicTrigger = () => {
    setIsMusicON(!isMusicON);

    if (clicksLeft < MAX_CLICKS) {
      if (!isMusicON) {
        bgMusic.play();
      } else {
        bgMusic.pause();
      }
    }
  };

  return (
    <div className={styles.AimTrainer}>
      {clicksLeft > 0 ? (
        <>
          <motion.div
            variants={opacityFadeVariants}
            initial="hidden"
            animate="visible"
            className={styles.turnsLeft}
          >
            {clicksLeft === MAX_CLICKS
              ? "Aim Trainer"
              : `Remaining : ${clicksLeft}`}
          </motion.div>
          <motion.div
            variants={opacityFadeVariants}
            initial="hidden"
            animate="visible"
            onClick={handleMusicTrigger}
            className={styles.musicTrigger}
          >
            {isMusicON ? <MusicON width={70} /> : <MusicOFF width={70} />}
          </motion.div>
          <motion.div
            variants={gameContainerVariants}
            initial="hidden"
            animate="visible"
            className={styles.gameContainer}
            onClick={onOutsideTargetClick}
          >
            <div
              className={styles.aimTarget}
              style={{ left: `${targetX}%`, top: `${targetY}%` }}
              onClick={onTargetClick}
            >
              <Ufo width={120 - 4 * (MAX_CLICKS - clicksLeft)} />
            </div>
            {clicksLeft === MAX_CLICKS ? (
              <div className={styles.instructionInfo}>
                <div>Hit {MAX_CLICKS} targets as quickly as you can</div>
                <div>Click the target above to begin</div>
              </div>
            ) : null}
          </motion.div>
        </>
      ) : (
        <>
          <div className={styles.turnsLeft}>Your Final Score</div>

          <div className={styles.gameContainer}>
            <Timer />
            <div className={styles.finalStat}>
              Accuracy :{" "}
              {(((MAX_CLICKS - missedClicks) / MAX_CLICKS) * 100).toFixed(2)} %
            </div>
            <div className={styles.finalStat}>
              Average time per target
              <div className={styles.averageTime}>
                {((endTime - startTime) / MAX_CLICKS).toFixed(2)} ms
              </div>
            </div>
            <div className={styles.buttonSection}>
              <button onClick={resetGame} className={styles.lostButton}>
                Try again
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
