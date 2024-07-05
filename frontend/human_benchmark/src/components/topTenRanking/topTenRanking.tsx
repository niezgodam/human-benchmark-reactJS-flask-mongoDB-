/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import styles from "./topTenRanking.module.css";
import { useEffect, useState } from "react";
import GoldenMedal from "../../assets/goldenMedal";
import { useUserInfo } from "../../contexts/UserContext";

export default function TopTenRanking({
  currentGame,
}: {
  currentGame: string;
}) {
  const { userInfo } = useUserInfo();
  const colorForEachGame = {
    "Aim-Trainer": "#783dcb",
    Sequence: "green",
    Memory: "blue",
    Typing: "yellow",
    Clicker: "pink",
    "TZWCTR(CH)": "red",
  } as { [key: string]: string };
  const token = sessionStorage.getItem("token");

  const [bestScoresForEachGame, setBestScoresForEachGame] = useState<{
    [key: string]: any;
  }>({
    "aim-trainer": [],
    "sequence-memory": [],
    "memory-game": [],
    typing: [],
    clicker: [],
    tzwctr: [],
  });

  const convertGameNamesFrontendToBackend = {
    "Aim-Trainer": "aim-trainer",
    Sequence: "sequence-memory",
    Memory: "memory-game",
    Typing: "typing",
    Clicker: "clicker",
    "TZWCTR(CH)": "tzwctr",
  } as { [key: string]: string };

  const scoreNameFrontendToBackend = {
    "Aim-Trainer": "calculated_score",
    Sequence: "calculated_score",
    Memory: "calculated_score",
    Typing: "calculated_score",
    Clicker: "calculated_score",
    "TZWCTR(CH)": "calculated_score",
  } as { [key: string]: string };
  const getTopTenScoresOfCurrentGame = async (gameNameBackend: string) => {
    if (token) {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/top-ten/${gameNameBackend}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: JSON.parse(token),
            },
            withCredentials: true,
          }
        );

        setBestScoresForEachGame((prevScores) => ({
          ...prevScores,
          [gameNameBackend]: res.data.data,
        }));
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getTopTenScoresOfCurrentGame("aim-trainer");
    getTopTenScoresOfCurrentGame("memory-game");
    getTopTenScoresOfCurrentGame("sequence-memory");
    getTopTenScoresOfCurrentGame("typing");
    getTopTenScoresOfCurrentGame("clicker");
    getTopTenScoresOfCurrentGame("tzwctr");
  }, []);

  useEffect(() => {
    console.log(bestScoresForEachGame);
  }, [bestScoresForEachGame]);
  return (
    <div className={styles.topTenRanking}>
      <div
        className={styles.tableHeading}
        style={{
          border: `4px solid ${colorForEachGame[currentGame]}`,
          borderBottom: "0px solid transparent",
        }}
      >
        Best Players in{" "}
        {currentGame === "Aim-Trainer" ? "Aim Trainer" : currentGame}
      </div>

      <table
        className={styles.top10Table}
        style={{ backgroundColor: colorForEachGame[currentGame] }}
      >
        <thead>
          <tr>
            <th>Place</th>
            <th>Score</th>
            <th>Player</th>
          </tr>
        </thead>
        <tbody>
          {bestScoresForEachGame[
            convertGameNamesFrontendToBackend[currentGame]
          ].map((score: { [x: string]: string }, index: number) => (
            <tr
              key={index}
              style={{
                color: userInfo.username === score.username ? "green" : "white",
              }}
            >
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                #{index + 1}
                {index + 1 === 1 ? <GoldenMedal width={45} /> : null}
              </td>
              <td key={index}>
                {score[scoreNameFrontendToBackend[currentGame]]}
              </td>

              <td>{score.username ? score.username : "user unknown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
