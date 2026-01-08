# ft_transcendence
**ft_transcendence** is the final boss of the 42 Common Core. It is a full-scale web application that transforms a simple game of Pong into a high-performance, real-time social platform. This project isn't just about gaming; it’s about mastering asynchronous web architecture, OAuth2 authentication, and real-time data streams.

## The Core Experience

the centerpiece is a smooth, server-side-validated game engine designed to eliminate "cheating" and minimize lag. *Physics Engine* Built with vanilla JavaScript to handle collisions, ball acceleration, and paddle movement.
*Zero-Lag Logic* Uses WebSockets for a constant duplex stream between the client and server. *Game Modes* From classic 1v1 Pong to a fast-paced Hockey variant with different physics and scoring.

## Tech Stack
  - Backend :	Django
  - Real-time	: Django Channels (Handling WebSockets for the game and chat)
  - Frontend : Vanilla JS
  - Database : PostgreSQL
  - Auth : OAuth 2.0
  - Infrastructure : Docker & Compose

Beyond the paddle, the project includes a fully functional social ecosystem:
  Smart Tournament System: Automated bracket generation, managing wins/losses, and crowning a champion locally or online.
  Embedded Chat: Real-time rooms and private messaging (DMs) with user status tracking
  Friend System: Send requests, block users, and invite friends directly to a game match.
  Dynamic Dashboard: Visualizing player stats, win rates, and global rankings using data fetched from PostgreSQL.


### Launch with Docker
```
docker-compose up --build
```

_The final step in becoming a Full-Stack Software Engineer… pretending you actually enjoy CSS_ (for real i enjoy tailwind)
