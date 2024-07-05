My specific contributions included:
•Designing and implementing the difficulty level menu for games.
•Developing the login and registration pages with user authentication functionalities.
•Creating the frontend components and interfaces for the memory game and find and remember game.
•Implementing the backend API for the typing speed game.
•For every game utilizing Axios for efficient data transmission between the frontend and backend for every game, enabling seamless storage and retrieval of game scores from MongoDB

Technologies used:
•Frontend: ReactJS, TypeScript, TailwindCSS, CSS
•Backend: Flask
•Additional tools: Axios, framer motion

Components made by me:
<img width="438" alt="register" src="https://github.com/niezgodam/human-benchmark-reactJS-flask-mongoDB-/assets/116079315/6f0b54ef-08df-4461-bb2a-f1d1c2722b46">
<img width="930" alt="login" src="https://github.com/niezgodam/human-benchmark-reactJS-flask-mongoDB-/assets/116079315/c90e8dbb-80da-4f89-bd3e-8b3e332d35e0">
<img width="797" alt="menu" src="https://github.com/niezgodam/human-benchmark-reactJS-flask-mongoDB-/assets/116079315/cde64e21-18e7-4555-b32d-18da4cbb4fae">
<img width="797" alt="memory_Game" src="https://github.com/niezgodam/human-benchmark-reactJS-flask-mongoDB-/assets/116079315/3967f712-abbc-4163-857d-2ff7e32941bf">
<img width="796" alt="find game" src="https://github.com/niezgodam/human-benchmark-reactJS-flask-mongoDB-/assets/116079315/750e502e-1e39-439c-859d-c17eafe9232f">
<img width="808" alt="find_game_final" src="https://github.com/niezgodam/human-benchmark-reactJS-flask-mongoDB-/assets/116079315/4aee2b37-a792-4c94-b84a-18f0353b1ab3">


# HumanBenchmark

Welcome to the humanBenchmark project! This repository contains a full-stack application developed with Flask for the backend and React for the frontend. This application is designed to test and benchmark human cognitive abilities through various interactive tests.

## Table of Contents
- [Authors](#authors)
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Authors
- [Miyagi](https://github.com/Patr0sss) - PROJECT MANAGER / FRONTEND DEVELOPER
- [Kamil](https://github.com/Kamil-Hebda) - FLASK MASTER
- [Jakub](https://github.com/JaSycz) - CLICKER DEVELOPER
- [Paweł](https://github.com/pawel-rus) - BACKEND DEVELOPER
- [Zgoda](https://github.com/poteznymichu) - CSS ENJOYER

## Introduction
The humanBenchmark project provides a platform for users to engage in cognitive tests that measure reaction time, memory, and other mental abilities. The results can help users understand their cognitive strengths and weaknesses.

## Features
- **Reaction Time Test**: Measure how quickly you can respond to a visual stimulus.
- **Memory Test**: Test and improve your short-term memory with a sequence recall challenge.
- **Typing Test**: Evaluate your typing speed and accuracy.
- **Aim Trainer**: Practice and improve your mouse accuracy and speed.
- **Number Memory Test**: Test your ability to remember sequences of numbers.
- **Verbal Memory Test**: Challenge your memory with words and sequences.


## Tech Stack
- **Backend**: Flask
- **Frontend**: React, TypeScript, CSS
- **Database**: MongoDB
- **Authentication**: JWT

## Installation

### Backend
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Patr0sss/humanBenchmark.git
   cd humanBenchmark/backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server**:
   ```bash
   flask run
   ```

### Frontend
1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install the dependencies**:
   ```bash
   yarn
   ```

3. **Run the frontend development server**:
   ```bash
   yarn dev
   ```

## Usage
1. Ensure both backend and frontend servers are running.
2. Open your web browser and navigate to `http://localhost:5173`.
3. Register a new account or log in to start taking tests.

## Project Structure
```bash
humanBenchmark/
├── backend/
│   ├── app/
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── README.md
```

## Contributing
We welcome contributions to improve the project! Here are some ways you can contribute:
- Report bugs and issues
- Submit feature requests
- Create pull requests with enhancements

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using humanBenchmark! If you have any questions or need further assistance, feel free to open an issue on the repository.

[GitHub Repository](https://github.com/Patr0sss/humanBenchmark)
