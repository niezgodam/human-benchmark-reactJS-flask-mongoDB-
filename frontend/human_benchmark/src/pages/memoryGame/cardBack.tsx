import cardBackground from './assetsMemoryGame/cardBackground.jpg';
import CardFront from './cardFront';
import {motion} from 'framer-motion';

interface CardImage {
    src: string;
    id: number;
    matched: boolean;
}

interface CardBackProps {
    handleChoice: (card: CardImage) => void;
    card: CardImage;
    picked: boolean;
    blockButton: boolean;
    size:number;
}

export default function CardBack({ handleChoice, card, picked, blockButton,size }: CardBackProps) {
    
    function handleClick(): void {
      if(!blockButton){
        handleChoice(card); 
      }
    }
  
    return (
      picked ? (
        <CardFront src={card.src} size={size}/>
      ) : (
        <motion.div className={`rounded-3xl flip-card-back flex justify-center items-center`}
        >
          <img 
            className={`border-2 border-white rounded-3xl flex justify-center items-center`}
            src={cardBackground}
            alt="Card Background" 
            onClick={handleClick}
          />
        </motion.div>
      )
    );
  }
