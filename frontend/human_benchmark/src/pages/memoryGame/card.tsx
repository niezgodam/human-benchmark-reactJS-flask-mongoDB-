
import CardFront from "./cardFront";
import CardBack from "./cardBack";
import {motion} from 'framer-motion';

interface CardImage {
    src: string;
    id: number;
    matched: boolean;
}

interface CardProps {
    handleChoice: (card: CardImage) => void;
    card: CardImage;
    picked: boolean;
    blockButton: boolean;
    size: number;
}

export default function Card({ card, handleChoice, picked, blockButton,size }: CardProps) {
    return (
      <div className={`flex justify-center items-center`}>
        <motion.div
          className={`flip-card-inner  ${picked ? 'flip' : ''} justify-center items-center flex`}
          animate={{ rotateY: picked ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {card.matched ? (
            <CardFront src={card.src} size={size}/>
          ) : (
            <CardBack card={card} handleChoice={handleChoice} picked={picked} blockButton={blockButton} size={size}/>
          )}
        </motion.div>
      </div>
    );
  }
