import React, {useEffect, useState} from "react";
import './MemoryGame.css';

type Card = {
    id: number;
    value: string,
    isFlipped: boolean;
    isMatched: boolean;
};

const MemoryGame: React.FC = () => {
    const shuffle = (array: Card[]): Card[] => {
        return array.sort (() => Math.random() - 0.5);
    };
   const generateCards = (): Card[] => {
    const values = [
         "🍎", "🍌", "🍇", "🍉", "🍓", "🍒",
        "🥝", "🍍", "🥑", "🍋", "🍊", "🥥"
    ];
     const cards = values.flatMap((value, index) => [
        {id: index * 2, value, isFlipped: false, isMatched: false},
        {id: index * 2 + 1, value, isFlipped: false, isMatched: false}
     ]);
     
     return shuffle(cards);
   };



   const [cards, setCards] = useState<Card[]>(generateCards);
   const [flippedCards, setFlippedCards] = useState<number[]>([]);
   const [score, setScore] = useState(0);
   const [time, setTime] = useState(0);
   const [isGameRunning, setIsGameRunning] = useState(false);
   const [gameStarted, setGameStarted] = useState(false);

   useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isGameRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timer) {
      clearInterval(timer);
    }
    return () => {
       if(timer) clearInterval(timer);
    }
  }, [isGameRunning]);

  useEffect(() => {
    if(cards.every((card) => card.isMatched)) {
        setIsGameRunning(false);
    }
  }, [cards]);


   const handleCardClick = (id: number) => {
    if(!gameStarted) {
        setGameStarted(true);
        setIsGameRunning(true);
    }
    const clickedCard = cards.find((card) => card.id === id);
    if (!clickedCard || clickedCard.isFlipped || flippedCards.length === 2) return;
  
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);
  
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
  
    if (updatedFlippedCards.length === 2) {
      const [firstId, secondId] = updatedFlippedCards;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);
  
      if (firstCard?.value === secondCard?.value) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setScore((prevScore) => prevScore + 10); 
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
        setScore((prevScore) => prevScore - 5);
      }
      setFlippedCards([]);
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setScore(0);
    setTime(0);
    setIsGameRunning(false);
    setGameStarted(false);
  };



    return (
        <div className="game-container">
            <h1>Memory-spel</h1> <h2>Poäng : {score}</h2> <h2>Tid : {time} sekunder</h2>
            <button onClick={resetGame}> Starta om spelet</button>
            <div className="card-grid">
                {cards.map((card) => (
                    <div key={card.id} className="card"
                    onClick={() => handleCardClick(card.id)}
                    >
                        {card.isFlipped || card.isMatched ? card.value : "❓"}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemoryGame;