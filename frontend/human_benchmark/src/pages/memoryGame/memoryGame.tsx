import { useEffect, useState } from "react";
import cardImages from "./cardImages.tsx";
import Card from "./card.tsx";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Brain from "../../assets/brain";
import { gameContainerVariants } from "../../assets/animationVariants";
import { motion } from "framer-motion";
import "./buttons.css";
import axios from "axios";
import { useUserInfo } from "../../contexts/UserContext.tsx";

interface CardImage {
  src: string;
  id: number;
  matched: boolean;
}

interface LevelState {
  [key: number]: string;
  numberOfCards?: number;
}

interface GridClass {
  [key: number]: string;
  numberOfCards?: number;
}

interface LevelColorMap {
  [key: number]: string;
  numberOfCards?: number;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<CardImage[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [firstCard, setFirstCard] = useState<CardImage | null>(null);
  const [secondCard, setSecondCard] = useState<CardImage | null>(null);
  const [blockButton, setBlockButton] = useState<boolean>(false);
  const [isGameLoaded, setIsGameLoaded] = useState<boolean>(false);
  const cardSize = 128;
  const [correctPicked, setCorrectPicked] = useState<number>(0);
  const [numberOfCards, setNumberOfCards] = useState<number | null>(null);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);

  const levelOptions: LevelState = {
    4: "Very Easy",
    6: "Easy",
    9: "Medium",
    12: "Hard",
    18: "Extreme",
  };
  const [levelChosen, setLevelChosen] = useState(levelOptions[4]);
  const [bgColor, setBgColor] = useState<string>("bg-[#131010]");

  const [gridClasses, setGridClasses] = useState<GridClass>({
    4: "3xl:w-[800px] 3xl:h-[400px] lg:w-[800px] lg:h-[400px] md:w-[550px] md:h-[260px] sm:w-[260px] sm:h-[550px] xsm:w-[260px] xsm:h-[560px] w-[260px] h-[550px] md:grid-cols-4 grid-cols-2",
    6: "3xl:w-[700px] 3xl:h-[520px] 2xl:w-[700px] 2xl:h-[520px] xl:w-[700px] xl:h-[520px] lg:w-[700px] lg:h-[520px] md:w-[520px] md:h-[410px] sm:w-[380px] sm:h-[520px] xsm:w-[380px] xsm:h-[520px] w-[320px] h-[440px] md:grid-cols-4 grid-cols-3",
    9: "3xl:w-[1000px] 3xl:h-[490px] 2xl:w-[1000px] 2xl:h-[490px] xl:w-[1000px] xl:h-[490px] lg:w-[750px] lg:h-[360px] md:w-[580px] md:h-[280px] sm:w-[420px] sm:h-[540px] xsm:w-[380px] xsm:h-[520px] w-[250px] h-[530px] md:grid-cols-6 xsm:grid-cols-4 grid-cols-3",
    12: "3xl:w-[1400px] 3xl:h-[510px] 2xl:w-[1150px] 2xl:h-[420px] xl:w-[950px] xl:h-[340px] lg:w-[750px] lg:h-[500px] md:w-[580px] md:h-[460px] sm:w-[350px] sm:h-[550px] xsm:w-[340px] xsm:h-[540px] w-[320px] h-[510px] xl:grid-cols-8 md:grid-cols-6 grid-cols-4",
    18: "3xl:w-[1250px] 3xl:h-[540px] 2xl:w-[1150px] 2xl:h-[500px] xl:w-[1000px] xl:h-[430px] lg:w-[700px] lg:h-[600px] md:w-[580px] md:h-[580px] sm:w-[480px] sm:h-[600px] xsm:w-[350px] xsm:h-[580px] w-[340px] h-[580px] xl:grid-cols-9 sm:grid-cols-7 grid-cols-5",
  });

  const [levelColorMap] = useState<LevelColorMap>({
    4: "text-[#7fff00]",
    6: "text-[#00ff02]",
    9: "text-[#ffff00]",
    12: "text-[#ff7e04]",
    18: "text-[#fe0000]",
  });

  const shuffleCards = (numberOfCards: number): void => {
    const slicedCardImages = cardImages.slice(0, numberOfCards);
    const twoShuffledCards = [...slicedCardImages, ...slicedCardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random(), matched: false }));
    setCards(twoShuffledCards);
  };

  const { userInfo } = useUserInfo();

  const token = sessionStorage.getItem("token");

  const postTurns = async () => {
    if (token) {
      try {
        const res = await axios.post(
          "http://127.0.0.1:5000/memory-game",
          {
            id: JSON.stringify(userInfo._id),
            score: turns,
            level: levelChosen,
            timestamp: new Date().toISOString(),
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
    if (isGameWon) {
      postTurns();
    }
  }, [isGameWon]);
  useEffect(() => {
    if (firstCard && secondCard) {
      setBlockButton(true);
      if (firstCard?.src === secondCard?.src) {
        setBgColor("bg-[#008000]");
        setTimeout(() => setBgColor("bg-[#131010]"), 150);
        setCorrectPicked(correctPicked + 1);
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src == firstCard.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        turnHandle();
      } else {
        setBgColor("bg-[#FF0000]");
        setTimeout(() => setBgColor("bg-[#131010]"), 150);
        setTimeout(() => turnHandle(), 1000);
      }
    }
  }, [firstCard, secondCard]);

  useEffect(() => {
    console.log("correctPicked: " + correctPicked);
    console.log("numberOfCards: " + numberOfCards);

    const checkGameStatus = async () => {
      if (numberOfCards !== null && correctPicked === numberOfCards) {
        setIsGameWon(true);
      }
    };

    checkGameStatus();
  }, [correctPicked, numberOfCards]);

  function handleChoice(card: CardImage): void {
    if (firstCard) {
      setSecondCard(card);
    } else {
      setFirstCard(card);
    }
  }

  const turnHandle = () => {
    setFirstCard(null);
    setSecondCard(null);
    setTurns((prevTurns) => prevTurns + 1);
    setBlockButton(false);
  };

  const handleLevel = (numberOfCards: number) => {
    setNumberOfCards(numberOfCards);
    shuffleCards(numberOfCards);
    setIsGameLoaded(true);
    setTurns(0);
    setCorrectPicked(0);
    setLevelChosen(levelOptions[numberOfCards]);
    console.log("asd: " + numberOfCards);
  };

  const handleGameMenu = () => {
    setIsGameLoaded(false);
    setIsGameWon(false);
  };

  const scrollSlideValue = () => {
    if (window.innerWidth <= 640) {
      return 250;
    } else {
      return 500;
    }
  };

  const slideLeft = () => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft - scrollSlideValue();
    } else {
      console.error("Slider element not found");
    }
  };

  const slideRight = () => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft + scrollSlideValue();
    } else {
      console.error("Slider element not found");
    }
  };

  const gridClass = numberOfCards ? gridClasses[numberOfCards] : "";
  const levelName = numberOfCards ? levelOptions[numberOfCards] : "";
  const levelClass = numberOfCards ? levelColorMap[numberOfCards] : "";

  return (
    <motion.div
      className="h-[calc(100vh-60px)] mt-[60px] w-full min-h-[500px] flex flex-col justify-center items-center"
      variants={gameContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {!isGameLoaded ? (
        <div className="mt-[60px] text-3xl p-4">Memory game</div>
      ) : (
        <>
          <div className={`mt-[60px] text-3xl p-4 ${levelClass} uppercase`}>
            {levelName}
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex">
            <h1
              className={`mx-auto ${
                !isGameLoaded || isGameWon ? "hidden" : "visible"
              } bg-[#783dcb] p-2 rounded-xl mb-2`}
            >
              TURNS: {turns}
            </h1>
          </div>
        </>
      )}

      <div
        className={`${bgColor} w-[80%] h-[80%] mx-auto rounded-[10px] relative mb-[5%] border-2 border-[#783dcb] flex justify-center items-center shadow-[#1c1c1c] shadow-[0_0_12px_3px]`}
      >
        {isGameWon ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {/* <Confetti/> */}
            <div className="relative max-w-[400px]">
              <div className="flex items-center justify-center">
                <Brain />
              </div>
              <div className="mt-8 text-4xl">
                You won in{" "}
                <span className="text-[#783dcb] font-bold relative">
                  {turns}
                </span>{" "}
                turns
              </div>
              <button
                className="items-center justify-center mx-auto bg-[#131010] text-white border-[#783dcb] border-2 mt-8 max-w-[250px] text-[2rem] rounded-[10px] p-[6px] font-bold hover:bg-[#9d67e7] hover:border-[#783dcb] hover:scale-110 hover:ease-in-out hover:duration-300 ease-in-out duration-300"
                onClick={handleGameMenu}
              >
                Try again
              </button>
            </div>
          </div>
        ) : null}
        {isGameLoaded && !isGameWon ? (
          <>
            <div className="flex items-center justify-center">
              <div className={`grid gap-8 mx-12 ${gridClass}`}>
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    handleChoice={handleChoice}
                    picked={
                      card === firstCard || card === secondCard || card.matched
                    }
                    blockButton={blockButton}
                    size={cardSize}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
        {/* <div className={`grid grid-cols-1 grid-rows-5 text-black gap-8 ${isGameLoaded ? "hidden" : "visible"} font-bold flex`}> */}
        <div
          className={`relative flex w-full h-full mt-[50px] items-center justify-center ${
            isGameLoaded ? "hidden" : "visible"
          }`}
        >
          <MdChevronLeft
            className="absolute left-0 z-10 mx-1 bg-black rounded-full cursor-pointer border-2 border-[#783dcb]"
            size={40}
            onClick={slideLeft}
          />
          <div
            id="slider"
            className="relative flex items-center h-full overflow-x-scroll whitespace-nowrap scrollbar-hide scroll-smooth"
          >
            <div className="flex mx-12 space-x-8">
              <button className="btn" onClick={() => handleLevel(4)}>
                <span>Very Easy</span>
              </button>
              <button className="btn" onClick={() => handleLevel(6)}>
                <span>Easy</span>
              </button>
              <button className="btn" onClick={() => handleLevel(9)}>
                <span>Medium</span>
              </button>
              <button className="btn" onClick={() => handleLevel(12)}>
                <span>Hard</span>
              </button>
              <button className="btn" onClick={() => handleLevel(18)}>
                <span>Extreme</span>
              </button>
            </div>
          </div>
          <MdChevronRight
            className="absolute right-0 z-10 items-center mx-1 bg-black rounded-full cursor-pointer border-2 border-[#783dcb]"
            size={40}
            onClick={slideRight}
          />
        </div>
        {/* </div> */}
      </div>
    </motion.div>
  );
}
