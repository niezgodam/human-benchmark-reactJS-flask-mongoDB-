import {useState, useEffect, useRef} from "react";
import { gameContainerVariants } from "../../assets/animationVariants";
import styles from './speedClicker.module.css';
import { motion } from "framer-motion";
import axios from "axios";
import Ripple from './Ripple.tsx'
import { useUserInfo } from "../../contexts/UserContext.tsx";

export default function speedClicker() {
   const [clickerValue, setClickerValue] = useState<number>(0);
   const [isGameOnValue, setIsGameOnValue] = useState<boolean>(false);
   const [isGameOver, setGameOver] = useState<boolean>(false);
   const intervalRef = useRef<number>();
   const [now, setNow] = useState<number>();
   const [startTime, setStartTime] = useState<number>();  
   const [isGameLoaded, setIsGameLoaded] = useState<boolean>(false);
   const [initialTime, setInitialTime] = useState<number>(0);

   const { userInfo } = useUserInfo();

   const token = sessionStorage.getItem("token");
 
   const post = async () => {
     if (token) {
       try {
         const res = await axios.post(
           "http://127.0.0.1:5000/clicker",
           {
             id: JSON.stringify(userInfo._id),
             clicks_per_second: (clickerValue/initialTime).toFixed(3),
             clicks: clickerValue,
             time: initialTime, 
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
     if(isGameOver){
       post();
     }
 }, [isGameOver]);

    const onClickInitializeGame = () => {
        setIsGameOnValue(true);
        setGameOver(false);
        setClickerValue(1);
        setStartTime(Date.now());
        setNow(Date.now());

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setNow(Date.now());
        }, 10);


    }
    const onClickGame = () => {
        setClickerValue(clickerValue+1);
    }
    const onClickReset = () => {
      setIsGameOnValue(false);
      setClickerValue(0);
      setGameOver(false);
      setIsGameLoaded(false);
    }

    
    let secondsPassed = 0;  
    if (startTime != null && now != null) {
      secondsPassed = (now - startTime) / 1000;
    }
    let clicksPerSecond = (clickerValue/secondsPassed).toFixed(3);

    useEffect(() => {
      if (isGameOnValue && secondsPassed >= initialTime) {
          clearInterval(intervalRef.current);
          setIsGameOnValue(false); // Zatrzymaj grę
          setGameOver(true);
      }
  }, [secondsPassed, initialTime]);

  const handleTime = (time : number) => {
    setInitialTime(time);
    setIsGameLoaded(true);
    
}


    
    return (
        <div className={styles.speedClicker}>
            <motion.div 
             className={styles.gameContainer}
             variants={gameContainerVariants}
             initial="hidden"
             animate="visible"
             >  
             {isGameLoaded ? (
              <>
                <div className={styles.statsBlock}>
                    <div className={styles.timeBlock}>
                      <p>Time</p>
                      {isGameOnValue ? (initialTime - secondsPassed).toFixed(3) : (<>0</>)}
                    </div>
                    <div className={styles.clicksBlock}>
                      <p>Click/s</p>
                      {clickerValue > 0 ? clicksPerSecond : (<></>)}
                    </div>
                    <div className={styles.clickBlock}>
                      <p>Click</p>
                      {clickerValue > 0 ?  clickerValue : (<></>)}
                    </div>
                </div>
                
                <div className={styles.buttonBlock}>{isGameOnValue && !isGameOver ? ( 
                  <button disabled={ secondsPassed >= initialTime } onClick={onClickGame} style={{
                    position: 'relative',
                    overflow: 'hidden',
                    isolation: 'isolate',
                  }}> <Ripple></Ripple> </button>
                
                ) : isGameOver ? (
                  <>
                  <div className={styles.buttonResetBlock}> <button onClick={onClickReset}> Try Again </button></div>
                  <div className={styles.buttonBlock}> <button style={{
                    position: 'relative',
                    overflow: 'hidden',
                    isolation: 'isolate',
                    backgroundColor: '#E30022'
                  }}> Time's up! 
                  <Ripple></Ripple>
                  </button>
                  </div>
                  
                  </>

                  ) : (
                  <button  onClick={onClickInitializeGame}> Click here to start! </button>
                )} 
                </div>
              </>) : (
                <div className={styles.setBlock}>
                  <div className={styles.buttonTimeBlock}><button onClick={() => handleTime(5)}>5 Seconds</button></div>
                  <div className={styles.buttonTimeBlock}><button onClick={() => handleTime(10)}>10 Seconds</button></div>
                  <div className={styles.buttonTimeBlock}><button onClick={() => handleTime(15)}>15 Seconds</button></div>
                  <div className={styles.buttonTimeBlock}><button onClick={() => handleTime(20)}>20 Seconds</button></div>
                  <div className={styles.buttonTimeBlock}><button onClick={() => handleTime(25)}>25 Seconds</button></div>
                </div>
              )}
            </motion.div>
        </div>
        
    );
}