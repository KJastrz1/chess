## How to run

1. **Download or clone the repository**

2. **Run Docker Compose:**
    `docker compose up -d`

3. **The frontend application will be available at [localhost:5173](http://localhost:5173).**

## Introduction
This project is an online chess platform built using React for the frontend and Node.js for the backend. It offers a robust and real-time chess playing experience, allowing players from all over the world to challenge each other.

## Game Mechanics
The game mechanics are designed to replicate the traditional chess experience with the following features:
- **Real-Time Gameplay:** Players can make moves in real-time without waiting, thanks to WebSocket connections that ensure instant communication between the client and server.
- **Move Validation:** Each move is validated on the server to prevent illegal moves and ensure game integrity.
- **Player Authentication:** Players can register and log in to keep track of their games, ratings, and history. Authentication based on jwt send in http only cookies.
- **Elo Rating System:** The game implements an Elo rating system to rank players based on their game outcomes.

## Technologies Used
- **React**
- **Node.js** 
- **MongoDB** 
- **TypeScript**
  
## Gallery

**Game lobby**
<img src="img/lobby.png" width="800" height="600" alt="Screenshot of the game lobby showing player list and game options">

**Move time limit**
<img src="img/set_move_time.png" width="800" height="600" alt="Interface for setting time limits for player moves">

**Check...**
<img src="img/check.png" width="800" height="800" alt="Chess board in a state of check, highlighting the king in danger">

**Mate!**
<img src="img/checkmate.png" width="800" height="800" alt="Chess board displaying a checkmate position, game-ending move">

**Win by opponent forfeiture**
<img src="img/opponent_left.png" width="800" height="300" alt="Notification screen showing a win due to opponent leaving the game">

**History of played games**
<img src="img/history.png" width="800" height="800" alt="Screen showing the history of played games with details of each match">

**Game Replay Feature**
<img src="img/game_history.png" width="800" height="800" alt="Game replay interface allowing users to review moves from a past game">

**Players Ranking**
<img src="img/ranking.png" width="800" height="600" alt="Leaderboard displaying player rankings based on Elo ratings">
