function generateCrossSVG(containerId) {
  const svgWidth = 130;
  const svgHeight = 130;
  const color = "#FFC000";
  const animationDuration = 300;
  const lineThickness = 15;

  const svgCode = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <g transform="translate(${svgWidth / 2}, ${svgHeight / 2})">
        <line x1="${-svgWidth / 4}" y1="${-svgHeight / 4}" x2="${svgWidth / 4}" y2="${svgHeight / 4}" stroke="${color}" stroke-width="${lineThickness}">
          <animate attributeName="x1" dur="${animationDuration}ms" from="${svgWidth / 4}" to="${-svgWidth / 4}" fill="freeze" />
          <animate attributeName="y1" dur="${animationDuration}ms" from="${svgHeight / 4}" to="${-svgHeight / 4}" fill="freeze" />
        </line>
        <line x1="${svgWidth / 4}" y1="${-svgHeight / 4}" x2="${-svgWidth / 4}" y2="${svgHeight / 4}" stroke="${color}" stroke-width="${lineThickness}">
          <animate attributeName="x1" dur="${animationDuration}ms" from="${-svgWidth / 4}" to="${svgWidth / 4}" fill="freeze" />
          <animate attributeName="y1" dur="${animationDuration}ms" from="${svgHeight / 4}" to="${-svgHeight / 4}" fill="freeze" />
        </line>
      </g>
    </svg>
  `;

  const container = document.getElementById(containerId);
  container.innerHTML = svgCode;
}

function generateCircleSVG(containerId) {
  const svgCode = `
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90">
      <circle cx="45" cy="45" r="37.5" fill="transparent" stroke="#00B0EF" stroke-width="15">
        <animate attributeName="r" from="0" to="37.5" dur="300ms" fill="freeze" />
      </circle>
    </svg>
  `;

  const container = document.getElementById(containerId);
  container.innerHTML = svgCode;
}


// Array to store the current state of the Tic-Tac-Toe board
const boardState = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Flag to keep track of the current player (cross or circle)
let currentPlayer = 'cross';

// Function to handle a move made by the player
function makeMove(row, col) {
  // Check if the selected field is already occupied
  if (boardState[row][col] !== null) {
    return; // Field is already occupied, do nothing
  }

  // Update the board state with the current player's symbol
  boardState[row][col] = currentPlayer;

  // Get the field element based on the row and column
  const fieldId = 'field' + ((row * 3) + col + 1);
  const fieldElement = document.getElementById(fieldId);

  // Call the appropriate function to generate and animate the symbol SVG
  if (currentPlayer === 'cross') {
    generateCrossSVG(fieldId);
  } else {
    generateCircleSVG(fieldId);
  }

  // Check if the current player has won
  if (checkWinner(currentPlayer)) {
    // Makes all the fields unclickable
    makeFieldsUnclickable();
    // Wait for the last animation to finish before showing the winner message
    setTimeout(() => {
      // Draw the line through the winning fields
      drawWinningLine();
      //Make the new game button visible
      document.getElementById('reset-btn').classList.remove("d-none");
    }, 700); // Adjust the delay (in milliseconds) as needed for the last animation

  }

  // Check if the game is a draw
  if (checkDraw()) {
    // Wait for the last animation to finish before showing the "It's a draw!" message
    setTimeout(() => {
      // Display a message or perform any other action to indicate a draw
      alert('It\'s a draw!');
      // Reset the game or perform any other necessary actions
      resetGame();
      return;
    }, 1500);
  }

  // Switch to the next player
  currentPlayer = currentPlayer === 'cross' ? 'circle' : 'cross';
}

// Function to check if a player has won
function checkWinner(player) {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (
      boardState[row][0] === player &&
      boardState[row][1] === player &&
      boardState[row][2] === player
    ) {
      return true; // Player has won
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    if (
      boardState[0][col] === player &&
      boardState[1][col] === player &&
      boardState[2][col] === player
    ) {
      return true; // Player has won
    }
  }

  // Check diagonals
  if (
    (boardState[0][0] === player && boardState[1][1] === player && boardState[2][2] === player) ||
    (boardState[0][2] === player && boardState[1][1] === player && boardState[2][0] === player)
  ) {
    return true; // Player has won
  }

  return false; // No winner yet
}

// Function to check if the game is a draw
function checkDraw() {
  // Check if all fields are occupied
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (boardState[row][col] === null) {
        return false; // At least one field is still available
      }
    }
  }
  return true; // All fields are occupied (draw)
}


// Function to reset the game
function resetGame() {
  // Clear the board state
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      boardState[row][col] = null;
    }
  }

  // Clear the field containers
  for (let i = 1; i <= 9; i++) {
    const fieldId = 'field' + i;
    const fieldElement = document.getElementById(fieldId);
    fieldElement.innerHTML = '';
  }

  // Reset the current player
  currentPlayer = 'cross';

  //Remove the winning line
  document.getElementById('winning-line').remove();

  //Make the new game button dissappear
  document.getElementById('reset-btn').classList.add("d-none");

  //Make the fields clickable again
  makeFieldsClickable();

}

function makeFieldsUnclickable() {

  for (let i = 1; i <= 9; i++) {
    const fieldId = 'field' + i;
    const fieldElement = document.getElementById(fieldId);
    fieldElement.classList.add("unclickable");
  }
}
function makeFieldsClickable() {

  for (let i = 1; i <= 9; i++) {
    const fieldId = 'field' + i;
    const fieldElement = document.getElementById(fieldId);
    fieldElement.classList.remove("unclickable");
  }
}

function getWinningFields() {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (
      boardState[row][0] !== null &&
      boardState[row][0] === boardState[row][1] &&
      boardState[row][1] === boardState[row][2]
    ) {
      return [row, 0, row, 1, row, 2]; // Winning row
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    if (
      boardState[0][col] !== null &&
      boardState[0][col] === boardState[1][col] &&
      boardState[1][col] === boardState[2][col]
    ) {
      return [0, col, 1, col, 2, col]; // Winning column
    }
  }

  // Check diagonals
  if (
    boardState[0][0] !== null &&
    boardState[0][0] === boardState[1][1] &&
    boardState[1][1] === boardState[2][2]
  ) {
    return [0, 0, 1, 1, 2, 2]; // Winning diagonal (top-left to bottom-right)
  }

  if (
    boardState[0][2] !== null &&
    boardState[0][2] === boardState[1][1] &&
    boardState[1][1] === boardState[2][0]
  ) {
    return [0, 2, 1, 1, 2, 0]; // Winning diagonal (top-right to bottom-left)
  }

  return []; // No winning fields
}
// Function to draw the line through the winning fields
function drawWinningLine() {
  const lineThickness = '5px';
  const color = '#ffffff';

  // Get the coordinates of the winning fields
  const [row1, col1, row2, col2, row3, col3] = getWinningFields();

  // Calculate the start and end coordinates of the line
  const startX = (col1 * 150) + 75;
  const startY = (row1 * 150) + 75;
  const endX = (col3 * 150) + 75;
  const endY = (row3 * 150) + 75;

  // Create the line element
  const line = document.createElement('div');
  line.classList.add('winning-line');
  line.setAttribute("id", "winning-line");

  // Determine line direction and position
  if (startX === endX) {
    // Vertical line
    line.style.width = lineThickness;
    line.style.height = Math.abs(endY - startY) + 'px';
    line.style.left = startX - parseFloat(lineThickness) / 2 + 'px';
    line.style.top = Math.min(startY, endY) + 'px';
  } else if (startY === endY) {
    // Horizontal line
    line.style.width = Math.abs(endX - startX) + 'px';
    line.style.height = lineThickness;
    line.style.left = Math.min(startX, endX) + 'px';
    line.style.top = startY - parseFloat(lineThickness) / 2 + 'px';
  } else {
    // Diagonal line
    const diagonalLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX);
    line.style.width = diagonalLength + 'px';
    line.style.height = lineThickness;
    line.style.transformOrigin = '0 50%';
    line.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}rad)`;
  }

  // Append the line to the game container
  const gameContainer = document.getElementById('game-container');
  gameContainer.appendChild(line);

  // Apply line styling
  line.style.backgroundColor = color;

  // Add a class to the winning fields to exclude border style
  const winningFields = document.querySelectorAll('.field.winning');
  winningFields.forEach(field => {
    field.classList.remove('field');
    field.classList.add('winning-field');
  });
} 