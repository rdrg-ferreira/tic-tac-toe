function createGame() {
    const gameboard = (function () {
        const squares = [];

        const createGameSquare = () => {
            let state = "";

            const getState = () => state;
            const setState = (token) => state = token;
            return {getState, setState};
        }

        for (let i = 0; i < 9; i++) {
            squares.push(createGameSquare());
        }

        const getSquares = () => squares;

        return {getSquares};
    })();

    const playerController = (function () {
        const createPlayer = (name, token) => {
            const occupiedSquares = [];

            const getOccupiedSquares = () => occupiedSquares;
            const addOccupiedSquare = (squareIndex) => {
                if (gameboard.getSquares()[squareIndex].getState() === "") {
                    occupiedSquares.push(squareIndex);
                    gameboard.getSquares()[squareIndex].setState(token);
                    return 1;
                } else {
                    console.log(`${name}: square of index ${squareIndex} is already occupied`);
                    return 0;
                }
            };

            return {name, token, getOccupiedSquares, addOccupiedSquare};
        }

        const players = [createPlayer("Player 1", "x"), createPlayer("Player 2", "o")];

        const getPlayers = () => players;

        return {getPlayers};
    })();

    const gameController = (function () {
        let gameState = "playing";
        const getGameState = () => gameState;

        let currentPlayer = playerController.getPlayers()[0];
        const getCurrentPlayer = () => currentPlayer;
        const changeCurrentPlayer = () => {
            if (currentPlayer === playerController.getPlayers()[0]) {
                currentPlayer = playerController.getPlayers()[1];
            } else {
                currentPlayer = playerController.getPlayers()[0];
            }
        }

        let turnCounter = 0;
        const getTurnCounter = () => turnCounter;
        const increaseTurnCounter = () => turnCounter++;

        const checkForTie = () => {
            return (getTurnCounter() === 9);
        }

        const winCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        const checkForWin = () => {
            const playerSquares = currentPlayer.getOccupiedSquares().map(square => parseInt(square));

            return winCombinations.some(combination =>
                combination.every(square => playerSquares.includes(square))
            );
        };

        const playRound = (squareIndex) => {
            if (!currentPlayer.addOccupiedSquare(squareIndex)) return;
            increaseTurnCounter();

            if (checkForWin()) {
                console.log(`${currentPlayer.name} won!`);
                gameState = "win";
            } else if (checkForTie()) {
                console.log("game is tied");
                gameState = "tie";
            }
            
            changeCurrentPlayer();
        }

        return {getGameState, getCurrentPlayer, getTurnCounter, playRound};
    })();

    return {
        getBoard: gameboard.getSquares,
        getPlayers: playerController.getPlayers,
        getGameState: gameController.getGameState,
        getCurrentPlayer: gameController.getCurrentPlayer,
        getTurnCounter: gameController.getTurnCounter,
        playRound: gameController.playRound
    }
}

const screenController = (function () {
    const game = createGame();
    const board = document.querySelector("#board");
    const turnDisplay = document.querySelector("#turn-display");
    const changeNamesButton = document.querySelector("#name-changer");
    const clearBoardButton = document.querySelector("#clear-board");

    const createSquareElement = (token, index) => {
        const square = document.createElement("div");
        square.classList.add("square", "flex", "items-center");
        square.dataset.index = index;
        
        if (token === "x") {
            square.classList.add("cross");
            square.textContent = "x";
        } else if (token === "o") {
            square.classList.add("circle");
            square.textContent = "o";
        }

        return square;
    }

    const updateScreen = () => {
        // update board
        board.textContent = "";

        const boardSquares = game.getBoard();

        boardSquares.forEach((square, index) => {
            board.appendChild(createSquareElement(square.getState(), index));
        });

        // update turn display
        const currentPlayer = game.getCurrentPlayer();
        const gameState = game.getGameState();

        if (gameState === "playing") {
            turnDisplay.textContent = `${currentPlayer.name}'s turn to play`;
        } else if (gameState === "win") {
            turnDisplay.textContent = `${currentPlayer.name} won the game`;
        } else {
            turnDisplay.textContent = "It's a tie";
        }
    }

    // event listeners
    board.addEventListener("click", e => {
        if (game.getGameState() !== "playing") return;

        const squareIndex = e.target.dataset.index;
        game.playRound(squareIndex);
        updateScreen();
    });

    changeNamesButton.addEventListener("click", e => {
        // TODO
    });

    clearBoardButton.addEventListener("click", e => {
        // TODO
    });

    updateScreen();
})();