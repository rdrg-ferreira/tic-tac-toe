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

        const players = [createPlayer("Player 1", "X"), createPlayer("Player 2", "0")];

        const getPlayers = () => players;

        return {getPlayers};
    })();

    const gameController = (function () {
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
            if (getTurnCounter() === 9) {
                return true;
            } else {
                return false;
            }
        };

        const winCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        const checkForWin = () => {
            const playerSquares = currentPlayer.getOccupiedSquares();

            winCombinations.forEach((combination) => {
                if (combination.every((square) => playerSquares.includes(square))) {
                    return true;
                }
            });
            return false;
        };

        const playRound = (squareIndex) => {
            if (!currentPlayer.addOccupiedSquare(squareIndex)) return;
            increaseTurnCounter();

            if (checkForWin()) {
                console.log(`${currentPlayer.name} won!`);
            } else if (checkForTie()) {
                console.log("game is tied");
            }
            
            changeCurrentPlayer();
        }

        return {getCurrentPlayer, getTurnCounter, playRound};
    })();

    return {
        getBoard: gameboard.getSquares,
        getPlayers: playerController.getPlayers,
        getCurrentPlayer: gameController.getCurrentPlayer,
        getTurnCounter: gameController.getTurnCounter,
        playRound: gameController.playRound
    }
}