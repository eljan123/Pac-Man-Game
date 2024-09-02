document.addEventListener('DOMContentLoaded', () => {
    const width = 28; // 28 x 31 grid
    const grid = document.querySelector('#gameBoard');
    const scoreDisplay = document.querySelector('#score');
    let score = 0;

    // Layout of grid and what is in the squares
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,
        1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,
        1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,
        1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,
        1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,
        1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ]

    const squares = []

    // Create your board
    function createBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div');
            grid.appendChild(square);
            squares.push(square);

            // Add layout to the board
            if(layout[i] === 0) {
                squares[i].classList.add('dot');
            } else if (layout[i] === 1) {
                squares[i].classList.add('wall');
            }
        }
    }
    createBoard();

    // Starting position of Pac-Man
    let pacmanCurrentIndex = 490;
    squares[pacmanCurrentIndex].classList.add('pacman');

    // Move Pac-Man
    function movePacman(e) {
        squares[pacmanCurrentIndex].classList.remove('pacman');

        switch(e.key) {
            case 'ArrowUp':
                if (
                    pacmanCurrentIndex - width >= 0 &&
                    !squares[pacmanCurrentIndex - width].classList.contains('wall')
                )
                pacmanCurrentIndex -= width;
                break;
            case 'ArrowDown':
                if (
                    pacmanCurrentIndex + width < width * width &&
                    !squares[pacmanCurrentIndex + width].classList.contains('wall')
                )
                pacmanCurrentIndex += width;
                break;
            case 'ArrowLeft':
                if (
                    pacmanCurrentIndex % width !== 0 &&
                    !squares[pacmanCurrentIndex - 1].classList.contains('wall')
                )
                pacmanCurrentIndex -= 1;
                break;
            case 'ArrowRight':
                if (
                    pacmanCurrentIndex % width < width - 1 &&
                    !squares[pacmanCurrentIndex + 1].classList.contains('wall')
                )
                pacmanCurrentIndex += 1;
                break;
        }

        squares[pacmanCurrentIndex].classList.add('pacman');

        pacDotEaten();
    }

    document.addEventListener('keyup', movePacman);

    // What happens when Pac-Man eats a dot
    function pacDotEaten() {
        if(squares[pacmanCurrentIndex].classList.contains('dot')) {
            score++;
            scoreDisplay.innerHTML = 'Score: ' + score;
            squares[pacmanCurrentIndex].classList.remove('dot');
        }
    }

    // Ghosts
    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.timerId = NaN;
        }
    }

    const ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500)
    ];

    // Draw ghosts onto the grid
    ghosts.forEach(ghost => {
        squares[ghost.currentIndex].classList.add(ghost.className);
        squares[ghost.currentIndex].classList.add('ghost');
    });

    // Move the ghosts randomly
    ghosts.forEach(ghost => moveGhost(ghost));

    function moveGhost(ghost) {
        const directions = [-1, +1, -width, +width];
        let direction = directions[Math.floor(Math.random() * directions.length)];

        ghost.timerId = setInterval(function() {
            if (
                !squares[ghost.currentIndex + direction].classList.contains('wall') &&
                !squares[ghost.currentIndex + direction].classList.contains('ghost')
            ) {
                squares[ghost.currentIndex].classList.remove(ghost.className);
                squares[ghost.currentIndex].classList.remove('ghost');
                ghost.currentIndex += direction;
                squares[ghost.currentIndex].classList.add(ghost.className);
                squares[ghost.currentIndex].classList.add('ghost');
            } else direction = directions[Math.floor(Math.random() * directions.length)];

            // Check if Pac-Man is caught
            if (squares[ghost.currentIndex].classList.contains('pacman')) {
                clearInterval(ghost.timerId);
                document.removeEventListener('keyup', movePacman);
                scoreDisplay.innerHTML = 'Game Over';
            }
        }, ghost.speed);
    }
});
