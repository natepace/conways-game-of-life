import React, { useCallback, useState, useRef } from 'react';
import produce from 'immer';
import logo from './logo.svg';
import './App.css';

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, 0],
  [-1, 0],

]

// const handleClick = () => {

//   return grid
// }

const makeEmpty = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
  });

  const [running, setRunning] = useState(false)

  const runningRef = useRef(running)
  runningRef.current = running;
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    // simulate
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ]
              }
            })
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            }
            else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);

  }, [])
  return (
    <div>
      <button
        onClick={() => {
          setRunning(!running)
          runningRef.current = true;
          runSimulation()
        }}
      >{running ? 'Stop!' : 'Start!'}
      </button>
      <button onClick={() => {
        setGrid(makeEmpty())
      }}>Clear</button>

      <button onClick={() => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
          rows.push(Array.from(Array(numCols), () => Math.random() > .5 ? 1 : 0))
        }
        setGrid(rows);
      }}>Random</button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols},20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, j) =>
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });


                setGrid(newGrid)
              }}
              style={
                {
                  width: 20, height: 20, backgroundColor: grid[i][j] ? 'teal' : undefined,
                  border: 'solid 1px black',


                }} />))}
      </div>
    </div>
  );
}

export default App;
