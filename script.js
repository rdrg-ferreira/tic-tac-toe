const gameboard = (function () {
    let squares = [];

    const getSquares = () => squares;
    const addSquare = (square) => squares.push(square);

    return {getSquares, addSquare};
})();

function createGameSquare() {
    let isUsed = false;
    return {isUsed};
}

function createPlayer(id) {
    let occupiedSquares = [];

    const getOccupiedSquares = () => occupiedSquares;
    const addOccupiedSquare = (squareId) => occupiedSquares.push(squareId);

    return {id, getOccupiedSquares, addOccupiedSquare};
}

const game = (function () {
    const createSquares = () => {
        for (let i = 0; i < 9; i++) {
            const square = createGameSquare();
            gameboard.addSquare(square);
        }
    };

    let roundCounter = 0;
    const getRoundCounter = () => roundCounter;
    const increaseRoundCounter = () => roundCounter++;
    const checkForTie = () => {
        if (getRoundCounter() === 9) {
            return true;
        } else {
            return false;
        }
    };

    const winCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const checkForWin = (player) => {
        const playerSquares = player.getOccupiedSquares();

        winCombinations.forEach((combination) => {
            if (combination.every((square) => playerSquares.includes(square))) {
                return true;
            }
        });
        return false;
    };

    return {createSquares, getRoundCounter, increaseRoundCounter, checkForTie, checkForWin};
})();