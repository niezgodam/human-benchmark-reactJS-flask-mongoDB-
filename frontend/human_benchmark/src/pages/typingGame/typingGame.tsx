import { motion } from "framer-motion";
import styles from "./typingGame.module.css";
import {
  gameContainerVariants,
  opacityFadeVariants,
} from "../../assets/animationVariants";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserInfo } from "../../contexts/UserContext";

export default function TypingGame() {
  const [userInputText, setUserInputText] = useState("");
  const [timerSEC, setTimerSEC] = useState(0);
  const [userStartedTyping, setUserStartedTyping] = useState(false);
  const [isTextProperlyRewrited, setIsTextProperlyRewrited] = useState(false);
  const [typeText, setTypeText] = useState(" ");
  const wordsArray = typeText.split(" ");

  const token = sessionStorage.getItem("token");
  const { userInfo } = useUserInfo();

  const post = async () => {
    if (token) {
      try {
        const res = await axios.post(
          "http://127.0.0.1:5000/typing",
          {
            id: JSON.stringify(userInfo._id),
            score: timerSEC,
            timestamp: new Date().toISOString(),
            calculated_score: timerSEC,
          },
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `${token + "" + token}`,
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

  
  useEffect(() => {
    if(isTextProperlyRewrited){
      post();
    }
}, [isTextProperlyRewrited]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/random_story")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Wrong response");
        }
        return response.json();
      })
      .then((data) => {
        setTypeText(data.story);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, [isTextProperlyRewrited]);

  const resetGame = () => {
    setIsTextProperlyRewrited(false);
    setUserInputText("");
    setTimerSEC(0);
  };

  useEffect(() => {
    if (userInputText.length === 1) {
      setUserStartedTyping(true);
    }

    if (userInputText === typeText) {
      setIsTextProperlyRewrited(true);
    }

    if (isTextProperlyRewrited) {
      setUserStartedTyping(false);
    }
    console.log("text1: " + typeText)
    console.log("text2: " + userInputText)
  }, [isTextProperlyRewrited, userInputText]);

  useEffect(() => {
    let timer;

    if (userStartedTyping) {
      timer = setInterval(() => {
        setTimerSEC((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [userStartedTyping, isTextProperlyRewrited]);

  const getHighlightedWord = (word, wordIndex) => {
    const userInputWords = userInputText.split(" ");
    const userWord = userInputWords[wordIndex] || "";

    return word.split("").map((letter, letterIndex) => {

      const isCorrect = userWord[letterIndex] === letter;
      const isIncorrect = userWord[letterIndex] && userWord[letterIndex] !== letter;

      return (
        <span
          key={letterIndex}
          style={{
            backgroundColor: isCorrect
              ? "green"
              : isIncorrect
              ? "red"
              : "",
          }}
        >
          {letter}
        </span>
      );
    });
  };

  return (
    <div className={styles.typingGame}>
      <motion.div
        variants={opacityFadeVariants}
        initial="hidden"
        animate="visible"
        className={styles.timer}
      >
        {userStartedTyping ? (
          <div>Time : {timerSEC}s</div>
        ) : isTextProperlyRewrited ? (
          <div></div>
        ) : (
          <div>Start Typing To Begin The Test</div>
        )}
      </motion.div>
      <motion.div
        variants={gameContainerVariants}
        initial="hidden"
        animate="visible"
        className={styles.gameContainer}
      >
        {isTextProperlyRewrited ? (
          <div>
            <div className={styles.timer}>Final Time : {timerSEC}s</div>
            <div className={styles.lostButton} onClick={resetGame}>
              Try Again
            </div>
          </div>
        ) : (
          <>
            <div className={styles.textContainer}>
              {wordsArray.map((word, wordIndex) => (
                <span key={wordIndex} className={styles.word}>
                  {getHighlightedWord(word, wordIndex)}{" "}
                </span>
              ))}
            </div>
            <textarea
              spellCheck={false}
              className={styles.textInput}
              onChange={(e) => setUserInputText(e.target.value)}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
