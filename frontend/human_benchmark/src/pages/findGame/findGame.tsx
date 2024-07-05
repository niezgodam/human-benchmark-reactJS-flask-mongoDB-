import { useState, useEffect } from "react";
import "./findGame.css"
import Treasure from "../../assets/treasure";
import {
    gameContainerVariants,
  } from "../../assets/animationVariants";
import { motion } from "framer-motion";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import "./buttons.css"
import { useUserInfo } from "../../contexts/UserContext";
import axios from "axios";

const FindGame = () => {
    const number = 30; 
    const finalGridSize = 20;
    const [gridItems, setGridItems] = useState<JSX.Element[]>([]);
    const [finalGridItems, setFinalGridItems] = useState<number[]>([]);
    const [numberOfRounds, setNumberOfRounds] = useState<number>(1);
    const [savedNumber, setSavedNumber] = useState<number | null>(null);
    const [isBoard, setIsBoard] = useState<boolean>(true);
    const [result, setResult] = useState<number[]>([]);
    const [arrayOfClicked, setArrayOfClicked] = useState<number[]>([]);
    const [isGameLoaded, setIsGameLoaded] = useState<boolean>(false);
    const [totalRounds, setTotalRounds] = useState<number>(0);
    const [isClicked, setIsClicked] = useState<boolean[]>(Array(finalGridSize - totalRounds).fill(false));
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [count, setCount] = useState(0);
    const [isGameWon,setIsGameWon] = useState<boolean>(false);
    const [bgColor, setBgColor] = useState<string>("bg-[#131010]");
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const { userInfo } = useUserInfo();

   const token = sessionStorage.getItem("token");
 
   const post = async () => {
     if (token) {
       try {
         const res = await axios.post(
           "http://127.0.0.1:5000/tzwctr",
           {
             id: JSON.stringify(userInfo._id),
             time: endTime-startTime,
             level: totalRounds,
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
     if(isGameWon){
       post();
     }
 }, [isGameWon]);
    


    // losowanie liczb
    const generateGridItems = () => {
        const randomNumbers = Array.from({ length: number }, () =>
            Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        );
        const items = randomNumbers.map((num, idx) => (
            <div key={idx} className="p-3 text-lg text-white bg-black hover:bg-[#783dcb] cursor-pointer" onClick={handleClick(num)}>
                {num}
            </div>
        ));
        const randomIndex = Math.floor(Math.random() * randomNumbers.length);
        const savedNum = randomNumbers[randomIndex];
        setGridItems(items);
        setSavedNumber(savedNum);
    };
    
    // tasowanie liczb
    const shuffleArray = (array: any[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // liczby do wyboru w finalnej wersji
    const generateGridItemsToChoose = (result: number[]) => {
        const randomNumbers = Array.from({ length: 20 - totalRounds }, () =>
            Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        );

        const combinedNumbers = [...randomNumbers, ...result];
        const shuffledArray = shuffleArray(combinedNumbers);
        setFinalGridItems(shuffledArray);
    };

    // wybieranie liczb w koncowym etapie gry
    const handleFinalClick = (idx: number) => {
        if (arrayOfClicked.length < totalRounds || isClicked[idx] === true) {
            setIsClicked((prevClicked) => {
                const newClicked = [...prevClicked];
                newClicked[idx] = !newClicked[idx];
                return newClicked;
            });
            if (isClicked[idx] === true) {
                setArrayOfClicked(prevArray => prevArray.filter(item => item !== finalGridItems[idx]));
            } else {
                setArrayOfClicked(prevArray => [...prevArray, finalGridItems[idx]]);
            }
        }

    };
    
    // funkcja do klikniecia danej ramki z liczba 
    const handleClick = (num: number) => () => {
        setSavedNumber((prevSavedNumber) => {
            const nextList = [...result, prevSavedNumber!];
            if (num === prevSavedNumber) {
                setResult(prevList => nextList);
                setNumberOfRounds((prevRounds) => prevRounds + 1);
                setIsAnimating(false);
                setBgColor("bg-[#008000]");
                setTimeout(() => setBgColor("bg-[#131010]"), 100);
                setCount((count) => count+1)
                if (numberOfRounds === totalRounds) {
                    setIsBoard(false);
                    generateGridItemsToChoose(nextList);
                }
            } else {
                setIsAnimating(false);
                setBgColor("bg-[#FF0000]");
                setTimeout(() => setBgColor("bg-[#131010]"), 100);
                setCount((count) => count+1)
                generateGridItems();
            }
            return prevSavedNumber;
        });

    };

    // funkcja pomocnicza do generowania grida z liczbami
    const helpFunc = () => {
        setIsAnimating(false);
        generateGridItems();
        setTimeout(() => setIsAnimating(true), 100);
    }

    useEffect(() => {
        if (!isStarted) return;
        generateGridItems();
        setIsAnimating(true);
        const intervalId = setInterval(() => {
            helpFunc();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [numberOfRounds, isStarted, count]);


    // ustawianie poziomu
    const handleLevel = (num: number) => {
        setTotalRounds(num);
        setIsGameLoaded(true);
    }


    // funkcja sprawdzajaca czy wartosci sa rowne 
    const arraysEqual = (arr1: number[], arr2: number[]): boolean => {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };
    
    // finalna odpowiedz funkcja do potwierdzenia, przycisk
    const handleConfirm = () => {
        const sortedUserChoice = arrayOfClicked.slice().sort();
        const sortedPicked = result.slice().sort();
        if (arraysEqual(sortedUserChoice, sortedPicked)) {
            setIsGameWon(true);
            setEndTime(Date.now());
        } else {
            setIsClicked(Array(finalGridSize - totalRounds).fill(false));
            setArrayOfClicked([]);
            generateGridItemsToChoose(result);
        }
    }

    // funkcja do startu gry
    const handleStart = () => {
        setIsStarted(true);
        setStartTime(Date.now());
    }

    const handleGameMenu = () => {
        setIsBoard(true);
        setIsGameLoaded(false);
        setIsGameWon(false);
        setGridItems([]);
        setFinalGridItems([]);
        setNumberOfRounds(1);
        setSavedNumber(null);
        setResult([]);
        setArrayOfClicked([]);
        setIsClicked(Array(finalGridSize - totalRounds).fill(false));
        setIsStarted(false);
        setIsAnimating(false);
        setCount(0);
        setStartTime(0);
        setEndTime(0);
    }

    const timeConverter = () => {
        let timeDifference = endTime - startTime;
        if(timeDifference < 60000){
            return `${(timeDifference/1000).toFixed(2)}s`
        }else if(timeDifference < 60000*60){
            let minutes = Math.floor(timeDifference/60000)
            let seconds = Math.floor((timeDifference % 60000) / 1000);
            return `${minutes.toFixed(0)}m ${seconds.toFixed(0)}s`
        }else {
            const hours = Math.floor(timeDifference / 3600000);
            const minutes = Math.floor((timeDifference % 3600000) / 60000);
            const seconds = ((timeDifference % 60000) / 1000);
            return `${hours.toFixed(0)}h ${minutes.toFixed(0)}m ${seconds.toFixed(0)}s`
        }
    }

    // slider

    const scrollSlideValue = () => {
        if (window.innerWidth <= 640) {
            return 250;
        } else {
            return 500;
        }
    };

      const slideLeft = () => {
        const slider = document.getElementById('slider');
        if (slider) {
            slider.scrollLeft = slider.scrollLeft - scrollSlideValue();
        } else {
            console.error('Slider element not found');
        }
    };
    
    const slideRight = () => {
        const slider = document.getElementById('slider');
        if (slider) {
            slider.scrollLeft = slider.scrollLeft + scrollSlideValue();
        } else {
            console.error('Slider element not found');
        }
    };

    return (
        
        <motion.div 
            className='h-[calc(100vh-60px)] mt-[60px] w-full min-h-[500px] flex flex-col justify-center items-center'
            variants={gameContainerVariants}
            initial="hidden"
            animate="visible"
        >
            {!isGameLoaded ?
                <div className='mt-[60px] text-3xl p-4'>FIND GAME</div>
                :
                <div className='mt-[60px] text-3xl p-4'>FIND GAME - {totalRounds} rounds</div>
            }
            <div className={`${bgColor} w-[80%] h-[80%] mx-auto rounded-[10px] relative mb-[5%] border-2 border-[#783dcb] flex justify-center items-center shadow-[#1c1c1c] shadow-[0_0_12px_3px]`}>
                {isGameLoaded && !isGameWon && (isBoard ?
                    <>
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <h1 className="py-1 text-2xl">{numberOfRounds}/{totalRounds}</h1>
                            <h1 className="py-2 text-2xl">FIND AND REMEMBER NUMBERS</h1>
                            <h1 className="text-2xl font-bold">{savedNumber}</h1>
                            <div className="grid grid-cols-5 grid-rows-6 gap-3">
                                {gridItems}
                            </div>
                            {!isStarted &&
                            <div className="bottom-[35%]">
                                <h1 className="font-bold hover:bg-[#783dcb] border-2 border-[#783dcb] rounded-xl cursor-pointer w-[400px] h-[150px] flex items-center justify-center ease-in-out duration-300 hover:ease-in-out hover:duration-300 hover:scale-110" onClick={handleStart}>START</h1>
                            </div>
                            }
                        </div>
                        <div className="progress-bar-container">
                            {isAnimating && <div className="progress-bar"></div>}
                        </div>
                    </>
                    :
                    <>
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="py-4 font-bold mb-[10px]">
                                <h1>CHOOSE CORRECT</h1>
                            </div>
                            <div className="grid grid-cols-5 grid-rows-4 gap-3">
                                {finalGridItems.map((num, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 text-lg text-white cursor-pointer ${isClicked[idx] ? 'bg-green-600' : 'bg-black'}`}
                                        onClick={() => handleFinalClick(idx)}
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                            <div className="flex-col mb-[10px] py-4">
                                <div 
                                    className='flex px-6 py-1 text-start border-[#783dcb] border-2 rounded-2xl text-xl cursor-pointer' 
                                    onClick={handleConfirm}
                                >
                                    Confirm
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {!isGameLoaded && (
                    <>
                        <MdChevronLeft className="absolute left-0 z-10 mx-1 bg-black rounded-full cursor-pointer border-2 border-[#783dcb]" size={40} onClick={slideLeft} />
                            <div id="slider" className="relative flex items-center h-full overflow-x-scroll whitespace-nowrap scrollbar-hide scroll-smooth">
                                <div className="flex mx-12 space-x-8">
                                    <button className='btn' onClick={() => handleLevel(2)}><span>2 ROUNDS</span></button>
                                    <button className='btn' onClick={() => handleLevel(3)}><span>3 ROUNDS</span></button>
                                    <button className='btn' onClick={() => handleLevel(5)}><span>5 ROUNDS</span></button>
                                    <button className='btn' onClick={() => handleLevel(8)}><span>8 ROUNDS</span></button>
                                    <button className='btn'onClick={() => handleLevel(10)}><span>10 ROUNDS</span></button>
                                </div>
                            </div>
                        <MdChevronRight className="absolute right-0 z-10 items-center mx-1 bg-black rounded-full cursor-pointer border-2 border-[#783dcb]" size={40} onClick={slideRight} />  
                    </>
                )}
                {isGameWon ? 
                    <div className='absolute inset-0 z-10 flex items-center justify-center'>
                    <div className='relative max-w-[400px]'>
                        <div className='flex items-center justify-center'>
                            <Treasure />
                        </div>
                        <div className='mt-8 text-4xl'>
                            You won in <span className='text-[#783dcb] font-bold relative'>{timeConverter()}</span>
                        </div>
                        <button className="items-center justify-center mx-auto bg-[#131010] text-white border-[#783dcb] border-2 mt-8 max-w-[250px] text-[2rem] rounded-[10px] p-[6px] font-bold hover:bg-[#9d67e7] hover:border-[#783dcb] hover:scale-110 hover:ease-in-out hover:duration-300 ease-in-out duration-300" onClick={handleGameMenu}>Try again</button>
                    </div>
                </div>
                :
                null
                }
            </div>
        </motion.div>
    );
};

export default FindGame;
