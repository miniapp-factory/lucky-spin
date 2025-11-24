"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Fruit = "Apple" | "Banana" | "Cherry" | "Lemon";

const fruits: Fruit[] = ["Apple", "Banana", "Cherry", "Lemon"];

function getRandomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(
    Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => getRandomFruit())
    )
  );
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col, idx) => {
          const newCol = [...col];
          newCol.pop();
          newCol.unshift(getRandomFruit());
          return newCol;
        });
        return newGrid;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  // Check win condition directly in render
  const hasWon =
    // rows
    grid[0].every((f) => f === grid[0][0]) ||
    grid[1].every((f) => f === grid[1][0]) ||
    grid[2].every((f) => f === grid[2][0]) ||
    // columns
    grid[0].every((_, i) => grid[i][0] === grid[0][0]) ||
    grid[0].every((_, i) => grid[i][1] === grid[0][1]) ||
    grid[0].every((_, i) => grid[i][2] === grid[0][2]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <img
              key={`${colIdx}-${rowIdx}`}
              src={`/${fruit.toLowerCase()}.png`}
              alt={fruit}
              width={64}
              height={64}
              className="rounded-md"
            />
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {hasWon && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-green-600 font-semibold">You win!</p>
          <Share text={`I won the slot machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
