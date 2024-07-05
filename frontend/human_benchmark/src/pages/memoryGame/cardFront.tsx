import {motion} from 'framer-motion';

interface CardFrontProps {
    src: string;
    size:number;
}

export default function CardFront({ src,size }: CardFrontProps) {
    return (
      <motion.div 
        className={`flip-card-front border-2 border-white rounded-3xl bg-[#783dcb] flex justify-center items-center`}
        >
          <img 
            className={` overflow-hidden`}
            src={src} 
            alt="Card Front" 
          />
      </motion.div>
    );
  }
