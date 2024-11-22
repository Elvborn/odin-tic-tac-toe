const Player = function(name, mark) {
    this.name = name;
    this.mark = mark;
}

const GameBoard = (function(){
    let board = [];

    function play(player, position){
        // Make sure position is valid
        if(position < 0 || position > 8) return false;

        if(board[position] !== undefined){
            console.log("Position already taken!");
            return false;
        }
        
        board[position] = player;


        if(gameOver()){
            GameManager.gameOver();
            return false;
        }

        return true;
    }

    function resetBoard(){
        board = [];
    }

    function displayBoard(){
        for(let i=0; i < 3; i++){
            let row = "";

            for(let j=0; j < 3; j++){
                const mark = board[(i*3)+j] !== undefined ? board[(i*3)+j].mark : "-";
                row += `${mark} `
            }

            console.log(row);
        }
    }

    function isEqual(positions){
        return positions.every(function(pos){
            return pos === positions[0];
        });
    }

    function gameOver(){
        let positions = [];
        
        // Check horizontal
        for(let row=0; row < 3; row++){
            positions = [board[(row*3)+0], board[(row*3)+1], board[(row*3)+2]]

            if(positions.includes(undefined)) continue;

            if(isEqual(positions))
                return true;
        }

        // Check vertical
        for(let column=0; column < 3; column++){
            positions = [board[column], board[column+3], board[column+6]]

            if(positions.includes(undefined)) continue;

            if(isEqual(positions))
                return true;
        }

        // Check cross
        positions = [board[0], board[4], board[8]]; 
        if(!positions.includes(undefined))
            if(isEqual(positions))
                return true;

        positions = [board[6], board[4], board[2]]; 
        if(!positions.includes(undefined))
            if(isEqual(positions))
                return true;
    }

    function getBoard(){
        return board;
    }

    return {
        play,
        resetBoard,
        getBoard
    }
})();

const Display = (function(){
    const ul = document.querySelector("ul");
    const output = document.querySelector(".output");
    const footer = document.querySelector("#footer");
    const dialog = document.querySelector("dialog");
    const form = document.querySelector("form");
    
    function update(){
        ul.innerHTML = "";
        board = GameBoard.getBoard();

        for(let i=0; i < 9; i++){
            const li = document.createElement("li");
            li.setAttribute("index", i);
            li.addEventListener("click", (event) => {
                GameManager.play(event.target.getAttribute("index"));
            });

            ul.append(li);

            if(typeof(board[i]) === "object"){
                const span = document.createElement("span");
                span.classList = board[i].mark.toLowerCase() === "x" ? "playerOne" : "playerTwo";
                li.append(span);
            }
        }
    }
    
    function getPlayerNames(){
        dialog.showModal()

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = Object.fromEntries(new FormData(form));

            dialog.close();

            const players = [
                new Player(formData.playerOneName, "X"),
                new Player(formData.playerTwoName, "O"),
            ];

            GameManager.setPlayers(players);
        });
    }

    function displayWinner(winnerName){
        output.textContent = `${winnerName} is the winner!`;
        
        const restartBtn = document.createElement("button");
        restartBtn.textContent = "Try again!";
        restartBtn.addEventListener("click", (e) => {
            GameManager.reset();
            e.target.remove();
        });
        footer.append(restartBtn);
    }

    function reset(){
        output.textContent = "";
        update();
    }

    return {
        getPlayerNames,
        update,
        displayWinner,
        reset
    }
})();

const GameManager = (function(){
    let players = [];

    let currentPlayer = 0;
    let isGameOver = false;
    
    Display.getPlayerNames();
    Display.update();

    function play(position){
        if(isGameOver) return;

        if(GameBoard.play(players[currentPlayer], position)){
            turnEnded();
            Display.update();
        }
    }

    function turnEnded(){
        currentPlayer++;

        if(currentPlayer >= players.length) currentPlayer = 0;
    }

    function gameOver(){
        Display.displayWinner(players[currentPlayer].name);
        Display.update();

        isGameOver = true;
    }

    function setPlayers(value){
        players = value;

        console.log(players)
    }

    function reset(){
        currentPlayer = 0;
        isGameOver = false;

        GameBoard.resetBoard();
        Display.reset();
    }

    return {
        play,
        reset,
        gameOver,
        setPlayers
    }
})();