const fs = require('fs')

module.exports = class Snake {
    constructor(id, size, controlMode, displayMode) {
        this.snake = [
            [5, 5],
            [5, 6],
            [5, 7]
        ];
        this.size = size;
        this.fruitLoc = [Math.floor(Math.random() * size), Math.floor(Math.random() * size)]
        this.lastLetter = ''
        this.id = id
        this.controlMode = controlMode
        this.displayMode = displayMode
        this.displayMessage
    }
    assignDisplayMessage(message) {
        this.displayMessage = message
        return
    }

    display(game) {
        var board = game.board;
        var snake = game.snake;
        var fruitLoc = game.fruitLoc;
        var rows = new Array(game.size).fill("");
        for (var y = 0; y < rows.length; y++) {
            for (var x = 0; x < rows.length; x++) {
                if (this.checkIfIn(snake.slice(1, snake.length), [x, y])) {
                    rows[y] += "<:roomba:912235716493344789>";
                }else if (snake[0][0]==x&&snake[0][1]==y) {
                    rows[y] += "<:snakeheadv2:912903183762849822> ";
                }else if (game.fruitLoc[0] == x && game.fruitLoc[1] == y) {
                    rows[y] += "<:download:912238081770418216>";
                } else {
                    rows[y] += "[[[";
                }
            }
            rows[y] += "\n"
        }
        return rows.join('')
    }

    checkIfIn(snake, arr) {
        for (var i = 0; i < snake.length; ++i) {
            if (snake[i][0] == arr[0] && snake[i][1] == arr[1]) {
                return true
            }
        }
        return false;
    }

    move(direction, snake) {
        var prevPos = snake.map((x) => x);
        if (direction == "right") {
            snake[0] = [snake[0][0] + 1, snake[0][1]]
        }
        if (direction == "up") {
            snake[0] = [snake[0][0], snake[0][1] - 1]
        }
        if (direction == "left") {
            snake[0] = [snake[0][0] - 1, snake[0][1]]
        }
        if (direction == "down") {
            snake[0] = [snake[0][0], snake[0][1] + 1]
        }

        for (var pos = 1; pos < snake.length; pos++) {
            snake[pos] = prevPos[pos - 1]
        }
    }

    lost(game) {
        for (var i = 0; i < game.snake.length; ++i) {
            if (game.snake[i][0] > game.size - 1 || game.snake[i][0] < 0 || game.snake[i][1] > game.size - 1 || game.snake[i][1] < 0) {
                return true
            }
        }
        var combined = []
        for (var i = 0; i < game.snake.length; ++i) {
            combined[i] = game.snake[i][0] * 1000 + game.snake[i][1]
        }

        return (new Set(combined)).size !== combined.length;
    }
    getHighScore(player){
      const rawData = fs.readFileSync('./scores.txt', {encoding:'utf8', flag:'r'});
      var data = rawData.split("; ")
      var playersScores = []
      for (var i = 0; i < data.length; i++) { 
        if(data[i].split(", ")[1]==player){
        playersScores.push(parseInt(data[i].split(", ")[0]))
        }
      }
      return Math.max.apply(Math, playersScores);
    }
    getOverAllHighScore(){
      const rawData = fs.readFileSync('./scores.txt', {encoding:'utf8', flag:'r'});
      var data = rawData.split("; ")
      var scores = []
      for (var i = 0; i < data.length-1; i++) { 
          scores.push(parseInt( data[i].split(", ")[0] ))
      }
      return Math.max.apply(Math, scores);
    }

    gameTick(direction, message, game) {
        game = this
        this.move(direction, game.snake);
        if (this.checkIfIn(game.snake, game.fruitLoc)) {
            var last = game.snake.length - 1
            if (direction == "right") {
                game.snake.push([
                    [game.snake[last][0] - 1, game.snake[last][1]]
                ])
            }
            if (direction == "up") {
                game.snake.push([
                    [game.snake[last][0], game.snake[last][1] + 1]
                ])
            }
            if (direction == "left") {
                game.snake.push([
                    [game.snake[last][0] + 1, game.snake[last][1]]
                ])
            }
            if (direction == "down") {
                game.snake.push([
                    [game.snake[last][0], game.snake[last][1] - 1]
                ])
            }
            game.fruitLoc = [Math.floor(Math.random() * game.size), Math.floor(Math.random() * game.size)]
        }
        if (!this.lost(game)) {
            if (game.displayMessage == null || game.displayMode == "newMessage") {
                message.channel.send(this.display(game) + "\n\n\n---").then((msg) => {
                    if (game.controlMode == "reaction" && game.displayMessage!= undefined){
                       game.displayMessage.reactions.removeAll()
                      }
                    game.assignDisplayMessage(msg)
                    if (game.controlMode == "reaction" && game.displayMessage!= undefined){
                    game.displayMessage.react("⬅️")
                    game.displayMessage.react("⬆️")
                    game.displayMessage.react("⬇️")
                    game.displayMessage.react("➡️")

              

                  }})
            } else {
              game.displayMessage.edit(this.display(game) + "\n\n\n---")
              if (game.displayMode == "editMessage"){
               game.displayMessage.reactions.removeAll()
               if (game.controlMode == "reaction" && game.displayMessage!= undefined){
                game.displayMessage.react("⬅️")
                game.displayMessage.react("⬆️")
                game.displayMessage.react("⬇️")
                game.displayMessage.react("➡️")
               }
              }
            }
        } else {
            fs.writeFileSync("./scores.txt", (game.snake.length - 3)+ ", " + game.id+"; ",{ flag: 'a' });
            message.channel.send("You Lost :[\nYour Score was: " + (game.snake.length - 3).toString() + "\nYour High Score is:" + this.getHighScore(game.id) + "\nThe Overall High Score is: " + this.getOverAllHighScore());
            games.delete(game.id);
        }
    }
}