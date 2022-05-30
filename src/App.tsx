import { useEffect, useRef, useState } from "react";
import "./App.css";

enum GameDirection {
  "LEFT" = "LEFT",
  "RIGHT" = "RIGHT",
  "UP" = "UP",
  "DOWN" = "DOWN",
}

enum GameState {
  "PLAYING" = "PLAYING",
  "LOST" = "LOST",
  "WON" = "WON",
}

function getSnakeInitialCoords() {
  const firstPoint = { left: 0, top: 2 };
  const secondPoint = { left: 2, top: 2 };
  const thirdPoint = { left: 4, top: 2 };

  return [firstPoint, secondPoint, thirdPoint];
}

function getRandomCoords() {
  let left = Math.round(Math.random() * 98);
  let top = Math.round(Math.random() * 98);

  if (left % 2 === 1) left = left + 1;
  if (top % 2 === 1) top = top + 1;

  return { left, top };
}

function App() {
  const intervalId = useRef(0);
  const [gameState, setGameState] = useState(GameState.PLAYING);
  const [foodPos, setFoodPos] = useState(() => getRandomCoords());
  const [snakeCoords, setSnakeCoords] = useState(() => getSnakeInitialCoords());
  const [snakeSpeed, setSnakeSpeed] = useState(400);
  const [gameDirection, setGameDirection] = useState(GameDirection.RIGHT);

  useEffect(() => {
    intervalId.current = setInterval(moveSnake, snakeSpeed);

    return () => {
      clearInterval(intervalId.current);
    };
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  useEffect(() => {
    if (
      snakeCoords.at(-1)?.left === foodPos.left &&
      snakeCoords.at(-1)?.top === foodPos.top
    ) {
      enlargeSnake();
    }
  }, [snakeCoords]);

  function onKeyDown(e: KeyboardEvent) {
    if (gameDirection !== GameDirection.UP && e.key === "ArrowUp")
      setGameDirection(GameDirection.UP);
    if (gameDirection !== GameDirection.RIGHT && e.key === "ArrowRight")
      setGameDirection(GameDirection.RIGHT);
    if (gameDirection !== GameDirection.DOWN && e.key === "ArrowDown")
      setGameDirection(GameDirection.DOWN);
    if (gameDirection !== GameDirection.LEFT && e.key === "ArrowLeft")
      setGameDirection(GameDirection.LEFT);
  }

  function moveSnake() {
    let _snakeCoords = [...snakeCoords];
    _snakeCoords.shift();

    if (gameDirection === GameDirection.UP) {
      // [0,0], [2,0], [4,0]
      // [2,0], [4,0], [98,0]
      // [4,0], [98,0], [96,0]
      // [98,0], [96,0], [94,0]
      _snakeCoords.push({
        left: _snakeCoords.at(-1)!.left,
        top:
          _snakeCoords.at(-1)!.top - 2 >= 0 ? _snakeCoords.at(-1)!.top - 2 : 98,
      });
    }

    if (gameDirection === GameDirection.RIGHT) {
      // [0,0], [2,0], [4,0]
      // [2,0], [4,0], [6,0]
      // [4,0], [6,0], [8,0]
      // [6,0], [8,0], [10,0]
      _snakeCoords.push({
        left:
          _snakeCoords.at(-1)!.left + 2 < 100
            ? _snakeCoords.at(-1)!.left + 2
            : 0,
        top: _snakeCoords.at(-1)!.top,
      });
    }

    if (gameDirection === GameDirection.DOWN) {
      // [0,0], [2,0], [4,0]
      // [2,0], [4,0], [6,0]
      // [4,0], [6,0], [8,0]
      // [6,0], [8,0], [10,0]
      _snakeCoords.push({
        left: _snakeCoords.at(-1)!.left,
        top:
          _snakeCoords.at(-1)!.top + 2 < 100 ? _snakeCoords.at(-1)!.top + 2 : 0,
      });
    }

    if (gameDirection === GameDirection.LEFT) {
      // [0,0], [2,0], [4,0]
      // [0,0], [2,0], [2,0]
      // [0,0], [2,0], [0,0]
      // [2,0], [0,0], [98,0]
      _snakeCoords.push({
        left:
          _snakeCoords.at(-1)!.left - 2 >= 0
            ? _snakeCoords.at(-1)!.left - 2
            : 98,
        top: _snakeCoords.at(-1)!.top,
      });
    }

    setSnakeCoords(_snakeCoords);
  }

  function enlargeSnake() {
    let _snakeCoords = [...snakeCoords];

    if (gameDirection === GameDirection.UP) {
      // [0,0], [0,98], [0,96]
      // [0,0], [0,98], [0,96], [0,94]
      _snakeCoords.push({
        left: _snakeCoords.at(-1)!.left,
        top:
          _snakeCoords.at(-1)!.top - 2 >= 0 ? _snakeCoords.at(-1)!.top - 2 : 98,
      });
    }

    if (gameDirection === GameDirection.RIGHT) {
      // [0,0], [2,0], [4,0]
      // [0,0], [2,0], [4,0], [6,0]
      _snakeCoords.push({
        left:
          _snakeCoords.at(-1)!.left + 2 < 100
            ? _snakeCoords.at(-1)!.left + 2
            : 0,
        top: _snakeCoords.at(-1)!.top,
      });
    }

    if (gameDirection === GameDirection.DOWN) {
      // [0,0], [0,2], [0,4]
      // [0,0], [0,2], [0,4], [0,6]
      _snakeCoords.push({
        left: _snakeCoords.at(-1)!.left,
        top:
          _snakeCoords.at(-1)!.top + 2 < 100 ? _snakeCoords.at(-1)!.top + 2 : 0,
      });
    }

    if (gameDirection === GameDirection.LEFT) {
      // [0,0], [2,0], [4, 0]
      // [2,0], [4,0], [2, 0]
      // [4,0], [2,0], [0, 0]
      _snakeCoords.push({
        left:
          _snakeCoords.at(-1)!.left - 2 >= 0
            ? _snakeCoords.at(-1)!.left - 2
            : 98,
        top: _snakeCoords.at(-1)!.top,
      });
    }

    setFoodPos(() => getRandomCoords());
    setSnakeSpeed((prevSpeed) => (prevSpeed - 40 >= 30 ? prevSpeed - 40 : 30));
    setSnakeCoords(_snakeCoords);
  }

  return (
    <div className="App">
      <div className="game-scene">
        <div className="snake">
          {snakeCoords.map(({ left, top }, index) => (
            <span
              key={index}
              className="square"
              style={{ left: `${left}%`, top: `${top}%` }}
            ></span>
          ))}
        </div>
        <div
          className="food square"
          style={{ left: `${foodPos.left}%`, top: `${foodPos.top}%` }}
        ></div>
      </div>
    </div>
  );
}

export default App;
