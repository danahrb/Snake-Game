// src/SnakeGame.js
import React, { useEffect, useState } from 'react';
import './SnakeGame.css';

const box = 20;

const SnakeGame = () => {
    const spawnFood = () => {
        return {
            x: Math.floor(Math.random() * (400 / box)) * box,
            y: Math.floor(Math.random() * (400 / box)) * box,
        };
    };

    const [snake, setSnake] = useState([{ x: box * 5, y: box * 5 }]);
    const [food, setFood] = useState(spawnFood());
    const [direction, setDirection] = useState('RIGHT');
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') setDirection('UP');
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP') setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') setDirection('LEFT');
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT') setDirection('RIGHT');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [direction]);

    useEffect(() => {
        if (isGameOver) return;

        const gameInterval = setInterval(() => {
            moveSnake();
        }, 150);

        return () => clearInterval(gameInterval);
    }, [snake, direction, isGameOver]);

    const moveSnake = () => {
        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        if (direction === 'LEFT') head.x -= box;
        if (direction === 'UP') head.y -= box;
        if (direction === 'RIGHT') head.x += box;
        if (direction === 'DOWN') head.y += box;

        if (head.x === food.x && head.y === food.y) {
            setFood(spawnFood());
            setScore((prevScore) => prevScore + 1);
        } else {
            newSnake.pop();
        }

        if (head.x < 0 || head.y < 0 || head.x >= 400 || head.y >= 400 || collision(head, newSnake)) {
            setIsGameOver(true);
        } else {
            newSnake.unshift(head);
            setSnake(newSnake);
        }
    };

    const collision = (head, snake) => {
        return snake.some(segment => segment.x === head.x && segment.y === head.y);
    };

    const restartGame = () => {
        setSnake([{ x: box * 5, y: box * 5 }]);
        setFood(spawnFood());
        setDirection('RIGHT');
        setScore(0);
        setIsGameOver(false);
    };

    return (
        <div className="game-container">
            <h1>Snake Game</h1>
            <h2>Score: {score}</h2>
            {!isGameOver ? (
                <div className="game-area">
                    {snake.map((segment, index) => (
                        <div key={index} className="snake-segment" style={{
                            position: 'absolute',
                            width: box,
                            height: box,
                            backgroundColor: index === 0 ? '#00ff00' : '#1abc9c',
                            left: segment.x,
                            top: segment.y,
                        }} />
                    ))}
                    <div className="food" style={{
                        position: 'absolute',
                        width: box,
                        height: box,
                        left: food.x,
                        top: food.y,
                    }} />
                </div>
            ) : (
                <div className="game-over">
                    <h2>Game Over!</h2>
                    <button onClick={restartGame}>Restart</button>
                </div>
            )}
        </div>
    );
};

export default SnakeGame;