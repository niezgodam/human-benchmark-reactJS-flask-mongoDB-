import './confetti.css'; 

export default function Confetti() {
  return (
    <div className="confetti-container">
        {Array.from({ length: 200 }).map((_, i) => (
          <div key={i} className={`confetti-piece confetti-${i % 25}`}></div>
        ))}
      </div>
  );
}