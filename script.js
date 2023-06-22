// Create a hyperlink element for Paraverse World
const link1 = document.createElement("a");
link1.href = "https://twitter.com/paraverse_world";
link1.target = "_blank";
link1.style.position = "fixed";
link1.style.bottom = "885px";
link1.style.right = "20px";
link1.style.color = "#2a3136"; // Set the link color
link1.style.textDecoration = "none"; // Remove underline
link1.style.marginRight = "10px"; // Add some spacing

// Create the text element for Paraverse World
const text1 = document.createElement("span");
text1.textContent = "Visit Paraverse World  (click)";
text1.style.fontSize = "19px"; // Set the font size
text1.style.fontFamily = "Arial, sans-serif"; // Set the font family

// Append the text to the hyperlink element for Paraverse World
link1.appendChild(text1);

// Create a hyperlink element for @ji1n_loriann
const link2 = document.createElement("a");
link2.href = "https://twitter.com/ji1n_loriann";
link2.target = "_blank";
link2.style.position = "fixed";
link2.style.bottom = "20px";
link2.style.right = "1720px";
link2.style.color = "#2a3136"; // Set the link color
link2.style.textDecoration = "none"; // Remove underline

// Create the text element for @ji1n_loriann
const text2 = document.createElement("span");
text2.textContent = "@ji1n_loriann did it (click)";
text2.style.fontSize = "16px"; // Set the font size
text2.style.fontFamily = "Arial, sans-serif"; // Set the font family

// Append the text to the hyperlink element for @ji1n_loriann
link2.appendChild(text2);

// Append the hyperlink elements to the document body
document.body.appendChild(link1);
document.body.appendChild(link2);

// Wait for the document to load before running the game
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  const context = canvas.getContext("2d");

  // Rest of your code...
});
// Wait for the document to load before running the game
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");
 
  // Load the background image
  const backgroundImage = new Image();
  backgroundImage.src = "https://media.discordapp.net/attachments/1041980432805277718/1121022368308015134/3.png?width=1017&height=572";
 
  // Load the player image
  const playerImage = new Image();
  playerImage.src = "https://media.discordapp.net/attachments/1041980432805277718/1121011365713289216/-xRcOfGXwd-transformed.png?width=443&height=572";
 
  // Load the platform image
  const platformImage = new Image();
  platformImage.src = "https://media.discordapp.net/attachments/1041980432805277718/1120977598651039814/1-NCcR8zzkf-transformed.png?width=1017&height=572";
 
  // Set the canvas size to be smaller than the window size
  canvas.width = window.innerWidth - 27; // Subtract 100 pixels from the width
  canvas.height = window.innerHeight - 22; // Subtract 100 pixels from the height
  // Define the player object
  const player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 70,
    height: 70,
    velocityX: 0,
    velocityY: 0,
    jumpPower: 20,
    moveSpeed: 9,
    airAcceleration: 0.45, // New property for air acceleration
    isJumping: false,
  };
  // Define the platform objects
  let platforms = [
    { x: 0, y: canvas.height - 50, width: canvas.width, height: 50 },
    { x: 100, y: canvas.height - 200, width: 200, height: 50 },
    { x: canvas.width - 300, y: canvas.height - 400, width: 200, height: 50 },
  ];
  // Modify the initial y-coordinate of the lowest platform
  platforms[0].y = canvas.height - 10;
  // Define the platform spring objects
  let platformSprings = [];
  // Define the screen offset
  let screenOffset = 0;
  // Define the coins array
  let coins = [];
  // Define the collected coins array
  let collectedCoins = [];
  // Define the score
  let score = 0;
  // Define the game over flag
  let gameOver = false;
  // Handle keyboard input
  const keys = {};
  document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });
  document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });
  // Draw the player on the canvas
  function drawPlayer() {
    context.drawImage(playerImage, player.x, player.y - screenOffset, player.width, player.height);
  }
  // Draw the platforms on the canvas
  function drawPlatforms() {
    platforms.forEach((platform) => {
      context.drawImage(platformImage, platform.x, platform.y - screenOffset, platform.width, platform.height);
    });
  }
  // Draw the platform springs on the canvas
  function drawPlatformSprings() {
    platformSprings.forEach((spring) => {
      context.beginPath();
      context.rect(
        spring.x,
        spring.y - screenOffset,
        spring.width,
        spring.height
      );
      context.fillStyle = "#ffffff";
      context.fill();
      context.closePath();
    });
  }
  // Draw the coins on the canvas
  function drawCoins() {
    coins.forEach((coin) => {
      if (!collectedCoins.includes(coin)) {
        const coinImage = new Image();
        coinImage.src = "https://media.discordapp.net/attachments/1041980432805277718/1121030527483400302/eb0c025b378fb9b9f70c8feeb0d19b93400cdb9d.png?width=715&height=572";
        context.drawImage(coinImage, coin.x - coin.radius, coin.y - screenOffset - coin.radius, coin.radius * 2, coin.radius * 2);
      }
    });
  }
  // Generate new platforms above the current highest platform
  function generateNewPlatforms() {
    const highestPlatform = platforms[platforms.length - 1];
    const numPlatforms = Math.floor(Math.random() * 3) + 1; // Generate 1 to 3 new platforms
    const minY = highestPlatform.y - Math.random() * 100 - 50;
    const maxY = minY - 100;
    for (let i = 0; i < numPlatforms; i++) {
      const newPlatform = {
        x: Math.random() * (canvas.width - 200),
        y: Math.random() * (maxY - minY) + minY,
        width: 200,
        height: 50,
        isLandedOn: false, // New property to track if the player has landed on this platform
      };
      platforms.push(newPlatform);
      // Add a coin to every third platform
      if (i === 2) {
        const coin = {
          x: newPlatform.x + newPlatform.width / 2,
          y: newPlatform.y - 10,
          radius: 22,
        };
        coins.push(coin);
      }
      // Add a platform spring to every twentieth platform
      if (platforms.length % 20 === 0) {
        const platformSpring = {
          x: newPlatform.x + newPlatform.width / 2 - 25,
          y: newPlatform.y - 20,
          width: 50,
          height: 20,
        };
        platformSprings.push(platformSpring);
      }
    }
  }
  // Collect a coin
  function collectCoin() {
    coins.forEach((coin, index) => {
      if (
        player.x + player.width > coin.x - coin.radius &&
        player.x < coin.x + coin.radius &&
        player.y + player.height > coin.y - coin.radius &&
        player.y < coin.y + coin.radius
      ) {
        coins.splice(index, 1);
        collectedCoins.push(coin);
        score += 5;
      }
    });
  }
  // Check platform springs
  function checkPlatformSprings() {
    platformSprings.forEach((spring) => {
      if (
        player.x + player.width > spring.x &&
        player.x < spring.x + spring.width &&
        player.y + player.height > spring.y &&
        player.y + player.height < spring.y + player.velocityY &&
        player.velocityY >= 0
      ) {
        player.y -= 50; // Adjust the value to change the upward thrust
        player.velocityY = -50; // Adjust the value to change the upward velocity
      }
    });
  }
  // Restart the game
  function restartGame() {
    // Reset player position and velocity
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
    // Reset score
    score = 0;
    // Clear collected coins
    collectedCoins = [];
    // Reset platforms and generate new ones
    platforms = [
      { x: 0, y: canvas.height - 50, width: canvas.width, height: 50 },
      { x: 100, y: canvas.height - 100, width: 200, height: 50 },
      { x: canvas.width - 300, y: canvas.height - 180, width: 200, height: 50 },
    ];
    // Modify the initial y-coordinate of the lowest platform
    platforms[0].y = canvas.height - 10;
    // Clear platform springs
    platformSprings = [];
    // Clear coins
    coins = [];
    // Reset game over flag
    gameOver = false;
    // Start the game again
    update();
  }
  // Update the game state
  function update() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Apply gravity to the player
    player.velocityY += 0.5;
    player.y += player.velocityY;
    // Check for collision with each platform
    platforms.forEach((platform) => {
      if (
        player.y + player.height >= platform.y &&
        player.y + player.height <= platform.y + player.velocityY &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width
      ) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isJumping = false; // Reset the jump flag
        if (!platform.isLandedOn) {
          platform.isLandedOn = true;
          score += 1; // Increment the score by 1 when the player lands on a platform for the first time
        }
      }
    });
    // Handle horizontal movement
    if (keys["ArrowLeft"]) {
      if (player.velocityY !== 0) {
        player.velocityX -= player.airAcceleration; // Air acceleration when moving left
      } else {
        player.velocityX = -player.moveSpeed; // No acceleration when on the ground
      }
    } else if (keys["ArrowRight"]) {
      if (player.velocityY !== 0) {
        player.velocityX += player.airAcceleration; // Air acceleration when moving right
      } else {
        player.velocityX = player.moveSpeed; // No acceleration when on the ground
      }
    } else {
      player.velocityX = 0;
    }
    // Update player's horizontal position
    player.x += player.velocityX;
    // Make the player jump when the spacebar is pressed
    if (keys[" "] && !player.isJumping) {
      player.velocityY = -player.jumpPower;
      player.isJumping = true; // Set the jump flag
    }
    // Check if the player has fallen down
    if (player.y - screenOffset > canvas.height) {
      gameOver = true;
    }
    // Check platform springs
    checkPlatformSprings();
    // Check if the game is over
    if (gameOver) {
      // Display game over message
      context.font = "30px Arial";
      context.fillStyle = "#FF0000";
      context.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
      // Display final score
      context.font = "20px Arial";
      context.fillStyle = "#000";
      context.fillText("Score: " + score, canvas.width / 2 - 40, canvas.height / 2 + 40);
      // Display restart message
      context.font = "20px Arial";
      context.fillStyle = "#000";
      context.fillText("Press Enter to Restart", canvas.width / 2 - 85, canvas.height / 2 + 80);
      // Listen for Enter key press to restart the game
      document.addEventListener("keydown", restartHandler);
      return; // Stop updating the game state
    }
    // Update the screen offset
    screenOffset = player.y - canvas.height / 2;
    // Collect coins
    collectCoin();
    // Generate new platforms if the player has reached the last platform
    const lastPlatform = platforms[platforms.length - 1];
    if (player.y < lastPlatform.y - screenOffset + canvas.height) {
      generateNewPlatforms();
    }
    // Remove platforms that are out of the visible area
    platforms = platforms.filter(
      (platform) => platform.y - screenOffset <= canvas.height
    );
    // Draw the background image
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // Draw the platforms
    drawPlatforms();
    // Draw the platform springs
    drawPlatformSprings();
    // Draw the coins
    drawCoins();
    // Draw the player
    drawPlayer();
    // Display the score
    context.font = "20px Arial";
    context.fillStyle = "#000";
    context.fillText("Score: " + score, 20, 40);
    // Request the next animation frame
    requestAnimationFrame(update);
  }
  // Event handler for restarting the game
  function restartHandler(event) {
    if (event.key === "Enter") {
      // Remove the event listener
      document.removeEventListener("keydown", restartHandler);
      // Restart the game
      restartGame();
    }
  }
  // Start the game
  update();
});