const mazeContainer = document.getElementById("maze");
const bfsBtn = document.getElementById("bfs-btn");
const dfsBtn = document.getElementById("dfs-btn");
const createMazeBtn = document.getElementById("create-maze-btn");
const mazeSizeInput = document.getElementById("maze-size");

let rows = 10;
let cols = 10;
let maze = [];
let start = [0, 0];
let end = [9, 9];

function initializeMaze() {
  mazeContainer.innerHTML = "";
  mazeContainer.style.display = "grid";
  mazeContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  mazeContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;

  maze = [];
  for (let row = 0; row < rows; row++) {
    maze[row] = [];
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add(
        "w-8",
        "h-8",
        "border",
        "bg-gray-200",
        "border-gray-400",
        "flex",
        "items-center",
        "justify-center",
        "relative"
      );

      cell.addEventListener("click", () => setTarget(row, col));

      if (row === start[0] && col === start[1]) {
        cell.classList.add("bg-green-400");
      }
      if (row === end[0] && col === end[1]) {
        cell.classList.add("bg-yellow-500", "target");
        cell.innerHTML = "💎";
      }

      maze[row][col] = { visited: false, element: cell };
      mazeContainer.appendChild(cell);
    }
  }
}

function setTarget(row, col) {
  const prevTargetCell = maze[end[0]][end[1]].element;
  prevTargetCell.classList.remove("bg-yellow-500", "target");
  prevTargetCell.innerHTML = "";

  end = [row, col];
  const newTargetCell = maze[row][col].element;
  newTargetCell.classList.add("bg-yellow-500", "target");
  newTargetCell.innerHTML = "💎";
}

function highlightTarget() {
  const targetCell = maze[end[0]][end[1]].element;

  const message = document.createElement("div");
  message.innerText = "Treasure Found!";
  message.classList.add(
    "absolute",
    "bg-black",
    "text-white",
    "p-2",
    "rounded",
    "animate-pulse"
  );

  // Style adjustments to fix z-index and positioning
  message.style.zIndex = "10";
  message.style.position = "absolute";
  message.style.top = "50%";
  message.style.left = "50%";
  message.style.transform = "translate(-50%, -150%)";

  targetCell.appendChild(message);
  targetCell.classList.add("animate-bounce");
}

function bfs() {
  const queue = [start];
  maze[start[0]][start[1]].visited = true;

  const interval = setInterval(() => {
    if (queue.length === 0) {
      clearInterval(interval);
      return;
    }

    const [x, y] = queue.shift();
    maze[x][y].element.classList.add("bg-blue-400");

    if (x === end[0] && y === end[1]) {
      clearInterval(interval);
      highlightTarget();
      return;
    }

    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 &&
        nx < rows &&
        ny >= 0 &&
        ny < cols &&
        !maze[nx][ny].visited
      ) {
        maze[nx][ny].visited = true;
        queue.push([nx, ny]);
      }
    }
  }, 100);
}

function dfs() {
  const stack = [start];
  maze[start[0]][start[1]].visited = true;

  const interval = setInterval(() => {
    if (stack.length === 0) {
      clearInterval(interval);
      return;
    }

    const [x, y] = stack.pop();
    maze[x][y].element.classList.add("bg-purple-400");

    if (x === end[0] && y === end[1]) {
      clearInterval(interval);
      highlightTarget();
      return;
    }

    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 &&
        nx < rows &&
        ny >= 0 &&
        ny < cols &&
        !maze[nx][ny].visited
      ) {
        maze[nx][ny].visited = true;
        stack.push([nx, ny]);
      }
    }
  }, 100);
}

function resetMaze() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = maze[row][col];
      cell.visited = false;
      cell.element.classList.remove(
        "bg-blue-400",
        "bg-purple-400",
        "animate-bounce"
      );
      if (row === end[0] && col === end[1]) {
        cell.element.classList.add("bg-yellow-500", "target");
        cell.element.innerHTML = "💎";
      } else {
        cell.element.innerHTML = ""; // Clear other cells
      }
    }
  }
}

createMazeBtn.addEventListener("click", () => {
  rows = cols = parseInt(mazeSizeInput.value);
  start = [0, 0];
  end = [rows - 1, cols - 1];
  initializeMaze();
});

bfsBtn.addEventListener("click", () => {
  resetMaze();
  bfs();
});

dfsBtn.addEventListener("click", () => {
  resetMaze();
  dfs();
});

initializeMaze();
