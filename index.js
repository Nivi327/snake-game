function init() {
    canvas = document.getElementById('myCanvas');

    // setting canvas width and height to 75% and 80%
    W = canvas.width = window.innerWidth * 0.97;
    H = canvas.height = window.innerHeight * 0.94;
    pen = canvas.getContext('2d');
    console.log(pen);
    cell_size = 30;

    // creating the food
    food = createFood();

    game_over = false;
    score = 0;

    // Create a Image Object for food
    food_img = new Image();
    food_img.src = "images/apple.png";

    // Create a Image object for score
    thropy = new Image();
    thropy.src = "images/thropy.png";

    // create a snake object
    snake = {
        init_len: 3,
        color: "blue",
        cells: [],
        direction: "right",

        // create funtion to update initial cell locations
        createSnake: function () {
            for (let i = this.init_len; i > 0; i--) {
                this.cells.push({ x: i, y: 0 });
            }
        },

        // draw the snake with no-of-blocks = cells length
        drawSnake: function () {
            for (var i = 0; i < this.cells.length; i++) {
                pen.fillStyle = this.color;
                pen.fillRect(this.cells[i].x * cell_size, this.cells[i].y * cell_size, cell_size - 2, cell_size - 2);
            }
        },

        updateSnake: function () {
            var headX = this.cells[0].x;
            var headY = this.cells[0].y;

            if (headX == food.x && headY == food.y) {
                food = createFood();
                score += 1
            } else {
                this.cells.pop();
            }

            var nextX, nextY;

            if (snake.direction == 'right') {
                nextX = headX + 1;
                nextY = headY;
            } else if (snake.direction == 'left') {
                nextX = headX - 1;
                nextY = headY;
            } else if (snake.direction == 'down') {
                nextX = headX;
                nextY = headY + 1;
            } else {
                nextX = headX;
                nextY = headY - 1;
            }

            this.cells.unshift({ x: nextX, y: nextY });

            // logic to prevent the snake from going out
            var lastX = Math.round(W / cell_size);
            var lastY = Math.round(H / cell_size);

            if (this.cells[0].x > lastX || this.cells[0].y > lastY || this.cells[0].x < 0 || this.cells[0].y < 0) {
                game_over = true;
            }
            for(let i = 1; i < this.cells.length; i++) {
                if (this.cells[0].y > this.cells[i].y+cell_size && this.cells[0].y < this.cells[i].y-cell_size) {
                    game_over = true;
                }
            }
        }
    };

    snake.createSnake();
    // Add an event listener on the document object
    function keyPressed(e) {
        if (e.key == 'ArrowRight') {
            if (snake.direction != "left") {
                snake.direction = 'right';
            }
        } else if (e.key == 'ArrowLeft') {
            if (snake.direction != 'right') {
                snake.direction = 'left';
            }
        } else if (e.key == 'ArrowDown') {
            if (snake.direction != 'up') {
                snake.direction = 'down';
            }
        } else {
            if (snake.direction != 'down') {
                snake.direction = 'up';
            }
        }
    }

    document.addEventListener('keydown', keyPressed);
    document.onclick = function (e) {
        let Xcor = e.pageX;
        let Ycor = e.pageY;
        let snakeX = snake.cells[0].x * cell_size;
        let snakeY = snake.cells[0].y * cell_size;
        if (snake.direction === "left" || snake.direction === "right") {
            if (Ycor > snakeY) {
                snake.direction = "down";
            } else if (Ycor < snakeY) {
                snake.direction = "up";
            }
        }
        else if(snake.direction === "up" || snake.direction === "down") {
            if (Xcor < snakeX) {
                snake.direction = "left";
            } else if (Xcor > snakeX) {
                snake.direction = "right";
            }
        }
    }
};

function draw() {
    // erase old frame
    pen.clearRect(0, 0, W, H);
    snake.drawSnake();

    // To display food object/image
    pen.fillStyle = food.color;
    pen.drawImage(food_img, food.x * cell_size, food.y * cell_size, cell_size, cell_size);

    // To display score
    pen.drawImage(thropy, 18, 20, cell_size, cell_size);
    pen.fillStyle = "red";
    pen.font = "18px Roboto";
    pen.fontWeight = "bold";
    pen.fillText(score, 65, 40);
}

function update() {
    snake.updateSnake();
}

function createFood() {
    // creating a random food ad locations x, y
    var foodX = Math.round(Math.random() * (W - cell_size) / cell_size);
    var foodY = Math.round(Math.random() * (H - cell_size) / cell_size);

    var food = {
        x: foodX,
        y: foodY,
        color: "green"
    };

    return food;
}

function gameloop() {
    if (game_over == true) {
        clearInterval(f);
        alert('Game Over');
        return;
    }
    draw();
    update();
}

init();
var f = setInterval(gameloop, 150);
