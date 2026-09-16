# 🌵 El Pollo Loco

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5 Canvas](https://img.shields.io/badge/HTML5_Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

A browser-based 2D side-scrolling platformer built from scratch with **Vanilla JavaScript** and the **HTML5 Canvas API**.

No framework. No game engine. No build tools.

🎮 **[Play El Pollo Loco](https://el-pollo-loco.maxbelich.de/)**

![Gameplay preview](docs/media/el_pollo_loco_preview.gif)

## 🎮 About the Game

Help Pepe cross the desert, defeat the chickens standing in his way and take down the Endboss - a giant chicken - by throwing salsa bottles at it.

Along the way you can collect coins and bottles, trade coins for additional ammunition and keep an eye on your health before the desert gets the better of you.

The project was created during my Fullstack Developer training at [Developer Akademie](https://developerakademie.com/) and was my first larger object-oriented JavaScript project.

## ✨ Features

- 🏃 Player movement with idle, walking, jumping, hurt and death animations
- 🐔 Regular and small chicken enemies
- 👑 Full Endboss fight with alert, attack, hurt and death states
- 🍾 Throwable salsa bottles as the main ranged attack
- 🪙 Collectible coins and bottles
- 🔄 Trade 5 coins for an additional bottle
- ❤️ Live status bars for health, coins, bottles and Endboss health
- 🌵 Parallax-scrolling desert background and camera
- 🔊 Background music, sound effects, volume control and mute toggle
- 🏆 Win and lose screens with restart and home options
- 📱 Responsive layout with dedicated touch controls
- 🔳 Fullscreen mode
- 🔄 Portrait-mode warning on mobile devices

## 🎮 Controls

| Action | Keyboard |
| --- | --- |
| Move | `←` `→` / `A` `D` |
| Jump | `↑` / `W` / `Space` |
| Throw bottle | `E` |
| Trade 5 coins for a bottle | `Q` |

On touch devices, dedicated on-screen controls appear automatically.

## 🛠️ Tech Stack

- **Vanilla JavaScript** with ES6 classes
- **HTML5 Canvas API** for rendering the game world
- **CSS3** with responsive media queries
- **Object-Oriented Programming**
- **JSDoc** documentation
- **Git & GitHub**

The project has no framework, game engine or build step. It runs as a plain HTML, CSS and JavaScript application.

## 🧩 Architecture

The game uses an object-oriented class hierarchy in which drawable and movable game objects share common behavior through inheritance.

```text
DrawableObject
└── MovableObject
    ├── Character
    ├── Chicken / ChickenSmall
    ├── Endboss
    ├── Cloud
    ├── BackgroundObject
    ├── ThrowableObject
    └── CollectibleObject
```

Several dedicated manager classes keep larger responsibilities separated from the individual game objects:

- 🌍 `World` - central game loop, drawing and game state
- 🗺️ `Level` - enemies, clouds, background objects and collectibles
- 💥 `CollisionManager` - collisions, damage, pickups and combat interactions
- 🔊 `SoundManager` - music, sound effects, mute state and volume
- ⌨️ `Keyboard` - keyboard input state
- ❤️ `StatusBar` - health, coins, bottles and Endboss status

One of the main refactoring steps was moving collision, damage and pickup logic out of the growing `World` class into a dedicated `CollisionManager`.

This keeps the game loop easier to understand and separates responsibilities more clearly.

### 🗺️ Class Diagram

A visual class diagram is included in the repository:

[`docs/class-diagram.drawio`](docs/class-diagram.drawio)

You can also [open the diagram directly in draw.io](https://app.diagrams.net/#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fmaxbelich%2FEL-Pollo-Loco%2Fmain%2Fdocs%2Fclass-diagram.drawio).

## 📁 Project Structure

```text
EL-Pollo-Loco/
├── index.html
├── impressum.html
├── classes/          # Game classes and managers
├── js/
│   └── main.js       # Bootstrap, UI wiring and input
├── levels/
│   └── level1.js     # Level configuration
├── assets/           # Sprites, audio and fonts
├── style/            # Base, responsive and legal styles
└── docs/             # Gameplay preview and class diagram
```

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/maxbelich/EL-Pollo-Loco.git
```

Open the project directory:

```bash
cd EL-Pollo-Loco
```

There are no dependencies to install and no build step is required.

Open `index.html` directly in your browser or serve the project with a local static server such as the VS Code **Live Server** extension.

## 🧠 What I Learned

This project was my first larger object-oriented JavaScript application and taught me much more than simply getting a game to run.

### 🧱 Object-Oriented JavaScript

I designed a reusable class hierarchy with inheritance and shared behavior instead of building the game as one large procedural script.

### 🎞️ Game Loop & Animation

I worked with Canvas rendering, sprite-based animations and continuous game-state updates while keeping movement, physics and rendering synchronized.

### 💥 Collision Detection

I implemented interactions between the player, enemies, collectibles, throwable objects and the Endboss and later separated this logic into its own `CollisionManager`.

### 🔊 Audio Management

The game coordinates background music and multiple sound effects through a dedicated `SoundManager`, including volume control and mute state.

### 📱 Responsive Game Design

I adapted the fixed game canvas for different screen sizes and added touch controls, fullscreen support and orientation handling for mobile devices.

### 🧹 Refactoring

As the project grew, I moved responsibilities into dedicated classes to keep files and functions focused and maintainable.

### 🌿 Git Workflow

I used feature branches and pull requests during development to practice a structured Git workflow even while working on the project independently.

## 👤 Author

**Max Belich**

[Portfolio](https://maxbelich.de/) · [LinkedIn](https://www.linkedin.com/in/max-belich-6b844b424/)

## 📜 Credits & License

This is a private, non-commercial portfolio project.

Character and enemy sprites were provided by Developer Akademie as part of the training project.

Full music and sound credits are listed in the in-game [Impressum](impressum.html).
