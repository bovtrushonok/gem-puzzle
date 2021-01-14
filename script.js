<<<<<<< Updated upstream
import * as constant from './constants.js';

const GEM_PUZZLE = {
    elements: {
        main: null, //board
        menu: null,
        timer: null,
        updateBtn: null,
        movesCounter: null,
        fieldSizeSelect: null, //container with input to choose size of the field
        puzzlesContainer: null, //puzzles area
        puzzles: [], // HTML elements puzzles
     },

    properties: {
        time: {
            minutes: constant.MINUTES,
            sec: constant.SEC,
            id: null,
        },
        moves: constant.MOVES,
        size: null, // row and column length in puzzle field
        fieldSize: constant.STANDARD_FIELD_SIZE,
        emptyTile: null,
        emptyTileRow: null,
        emptyTileColumn: null,
        tilesSequence: [], // initial puzzles content sequence
        puzzlesArray: null, //current puzzles sequence in 2d array
    },

    init() {
        /*create and append HTML elements*/
        this.createGameBoard();
        this.createPuzzlesContainer();
        this.createMenu();
        this.createTimer();
        this.createMovesCounter();    
        this.createUpdateButton();
        this.createFieldSelectionBlock();
        this.appendElements();
        /*init functions to create random sequence, puzzles on field and start timer*/
        this.createTilesSequence(this.properties.fieldSize);
        this.createPuzzle(this.properties.fieldSize); 
        this.createPuzzlesArray(this.properties.fieldSize); 
        this.timerOn();
        this.createFieldSizeSelectionMenu();
    },

    createGameBoard() {
        this.elements.main = document.createElement('div');
        this.elements.main.classList.add('gameboard');
    },

    createPuzzlesContainer() {
        this.elements.puzzlesContainer = document.createElement('div');
        this.elements.puzzlesContainer.classList.add('puzzle');  
    },

    createMenu() {
        this.elements.menu = document.createElement('div');
        this.elements.menu.classList.add('menu');
    },

    createTimer() {
        this.elements.timer = document.createElement('div');
        this.elements.timer.innerHTML = constant.TIMER_INNER_HTML;
        this.elements.timer.classList.add('menu__timer');
    },

    createMovesCounter() {
        this.elements.movesCounter = document.createElement('div');
        this.elements.movesCounter.innerHTML = constant.MOVES_COUNTER_INNER_HTML;
        this.elements.movesCounter.classList.add('menu__movesCounter');
    },

    createUpdateButton() {
        this.elements.updateBtn = document.createElement('div');
        this.elements.updateBtn.innerHTML = constant.BUTTON_ICON_CREATE;
        this.elements.updateBtn.classList.add('update-bcg');
        this.elements.updateBtn.addEventListener('click', () => {
            this.properties.moves = constant.MOVES;
            this.elements.movesCounter.innerHTML = `moves: ${this.properties.moves}`;
            this.createTilesSequence(this.properties.fieldSize);
            this.updatePuzzle(this.properties.fieldSize);
            this.createPuzzlesArray(this.properties.fieldSize);
            this.clearTimer();
            this.timerOn();
        });
    },

    createFieldSelectionBlock() {
        this.elements.fieldSizeSelect = document.createElement('div');
        this.elements.fieldSizeSelect.innerHTML = constant.FIELD_SIZE_SELECT_BLOCK;
        this.elements.fieldSizeSelect.classList.add('menu__fieldSizeSelect');
    },

    createFieldSizeSelectionMenu() {
        const fieldSizeSelectionMenu = document.querySelector('#fieldSize');
        fieldSizeSelectionMenu.addEventListener('change', (e) => {
            this.properties.fieldSize = constant.FIELD_SIZE_OPTIONS[e.target.value];
            this.createTilesSequence(this.properties.fieldSize);
            this.elements.puzzlesContainer.innerHTML = '';
            this.createPuzzle(this.properties.fieldSize); 
            this.createPuzzlesArray(this.properties.fieldSize); 
            this.clearTimer();
            this.timerOn();
        });
    },

    appendElements() {
        this.elements.menu.append(this.elements.timer);
        this.elements.menu.append(this.elements.movesCounter);
        this.elements.menu.append(this.elements.updateBtn);
        this.elements.main.append(this.elements.fieldSizeSelect);
        this.elements.main.append(this.elements.menu);
        this.elements.main.append(this.elements.puzzlesContainer);
        document.body.append(this.elements.main);
    },

    timerOn() {
        const SELF = this; //save reference to GemPuzzle object
        let minutes = this.properties.time.minutes;
        let sec = this.properties.time.sec;
        function count(self) {
            sec++;
            self.properties.time.sec = sec;

            if (sec === 60) {
                sec = 0;
                minutes++;
                self.properties.time.minutes = minutes;
            };

            if (minutes < 10) {
                (sec < 10) ? self.elements.timer.innerHTML = `time: 0${minutes}:0${sec}`: self.elements.timer.textContent = `time: 0${minutes}:${sec}`;
            } else {
                (sec < 10) ? self.elements.timer.innerHTML = `time: ${minutes}:0${sec}`: self.elements.timer.textContent = `time: ${minutes}:${sec}`;
            };
        };
        const TIMER_ID = setInterval (() => count(SELF), 1000); 
        this.properties.time.id = TIMER_ID;
    },

    clearTimer() {
        clearInterval(this.properties.time.id);
        this.properties.time.minutes = constant.MINUTES;
        this.properties.time.sec = constant.SEC;
    },
    
    /*create array of random numbers for puzzles*/
    createTilesSequence(puzzleSize) { 
        this.properties.tilesSequence = [];

        for (let i = 0; i < puzzleSize; i++) {
            let randomNumber = this.randomInteger(1, puzzleSize);  
            (this.properties.tilesSequence.includes(randomNumber)) ? --i : this.properties.tilesSequence.push(randomNumber);
        };          
    },

    /*generate random number from min to (max+1)*/
    randomInteger(min, max) { 
        return Math.floor(min + Math.random() * (max + 1 - min));
    },

    /*create 2d array of current puzzles situation*/
    createPuzzlesArray(puzzleSize) { 
        this.properties.puzzlesArray = new Array(this.properties.size);
        this.properties.puzzlesArray.fill(new Array(this.properties.size));

        for (let j = 0; j < this.properties.puzzlesArray.length; j++) {
            this.properties.puzzlesArray[j] = new Array(this.properties.size);
        };

        let i = 0;

        for (let j = 0; j < this.properties.size; j++) {
            for (let k = 0; k < this.properties.size; k++) {
               this.properties.puzzlesArray[j][k] = this.elements.puzzles[i];
               i++;
            };
        };

        this.defineClickableTiles(); // add clickable class to tiles around empty one
    },
    
    /*switch empty tile and clicked tile*/
    changeSequence(tileTarg) { 
        let currentTileColumn;
        let currentTileRow;
        
        if (!tileTarg) {
            return
        };

        this.properties.moves++;
        this.playSound();
        this.elements.movesCounter.innerHTML = `moves: ${this.properties.moves}`;
        /*change flex order between tiles */
        let currentOrder =  tileTarg.style.order; 
        let emptyOrder = this.properties.emptyTile.style.order;
        tileTarg.style.order = emptyOrder;
        this.properties.emptyTile.style.order = currentOrder;
        
        /* detect clicked tile coordinates in 2d puzzlesArray */
        this.properties.puzzlesArray.map(item => {
            if (item.indexOf(tileTarg) === -1) {
                return;
            } 
            
            currentTileRow = this.properties.puzzlesArray.indexOf(item);
            currentTileColumn = this.properties.puzzlesArray[currentTileRow].indexOf(tileTarg);
        });
        /* remove all outdated clickable classes*/
        this.properties.puzzlesArray.map(item => {
            item.map(item => {
               item.classList.remove("clickable");
            });
        });
        /* switch tiles elements in 2d-puzzlesArray */
        [this.properties.puzzlesArray[currentTileRow][currentTileColumn], this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn]] = [this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn], this.properties.puzzlesArray[currentTileRow][currentTileColumn]];
        /*as tiles were switched, we need to re-define clickable tiles*/
        this.defineClickableTiles();
    },      

    /*after each click we find emty tile and add clickable class to all neighbour tiles*/
    defineClickableTiles() { 
        let emptyTile;
        let row;
        let column;
        
        for (let j = 0; j < this.properties.size; j++) {
            for (let k = 0; k < this.properties.size; k++) {
                if (!(this.properties.puzzlesArray[j][k].classList.contains('empty'))) {
                   continue;
                };

                emptyTile = this.properties.puzzlesArray[j][k];
                row = j;
                column = k;
                /*add clickable class to all neighbour tiles */
                if (k < this.properties.size - 1) {
                    this.properties.puzzlesArray[j][k + 1].classList.add('clickable');
                };

                if (k > 0) {
                    this.properties.puzzlesArray[j][k - 1].classList.add('clickable');
                };

                if (j > 0) {
                    this.properties.puzzlesArray[j - 1][k].classList.add('clickable');
                };

                if (j < this.properties.size - 1) {
                    this.properties.puzzlesArray[j + 1][k].classList.add('clickable');
                };
            };
        };
       /*save empty tile HTML and coordinates to switch tiles on click */
       this.properties.emptyTile = emptyTile; 
       this.properties.emptyTileRow = row;
       this.properties.emptyTileColumn = column;
    },

    /*make HTML field of puzzles*/
    createPuzzle(puzzleSize) {
        for (let i = 0; i < puzzleSize; i++) {
            const PUZZLE_TILE = document.createElement("div");
            const PUZZLE_TILE_CONTENT = document.createElement("span");
            PUZZLE_TILE.classList.add("puzzle__tile");
            /* define tile size depending on field size*/
            PUZZLE_TILE.classList.add(`${constant.TILE_SIZE_CLASSES[puzzleSize]}`);
            PUZZLE_TILE_CONTENT.textContent = this.properties.tilesSequence[i];
            PUZZLE_TILE.style.order = i;
    
            if (PUZZLE_TILE_CONTENT.textContent === String(puzzleSize)) {
                PUZZLE_TILE.classList.add('empty');
            };

            PUZZLE_TILE.addEventListener('click', (e) => {
                let tileTarg;

                if (e.target.classList.contains('clickable')) { //check if the tile or span element was clicked
                    tileTarg = e.target;
                } else if (e.target.parentNode.classList.contains('clickable')) {
                    tileTarg = e.target.parentNode;
                };

                this.changeSequence(tileTarg); //call tiles change
            });

            PUZZLE_TILE.append(PUZZLE_TILE_CONTENT);
            this.elements.puzzlesContainer.append(PUZZLE_TILE);
        };
        this.properties.size = Math.sqrt(puzzleSize); //length of row and column of puzzle field
        this.elements.puzzles = Array.from(this.elements.puzzlesContainer.querySelectorAll('.puzzle__tile')); //get all the puzzles as HTML elements
    },

    /*start new game*/
    updatePuzzle(puzzleSize) { 
        for (let i = 0; i < this.elements.puzzles.length; i++) {
            this.elements.puzzles[i].classList.remove('empty');
            this.elements.puzzles[i].innerHTML = `<span>${this.properties.tilesSequence[i]}</span>`;
            this.elements.puzzles[i].style.order = i;     
           
            if (this.properties.tilesSequence[i] === puzzleSize) {
                this.elements.puzzles[i].classList.add("empty");  
            };
        };
    },

    playSound() {
        const AUDIO = document.createElement('audio');
        AUDIO.src = "assets/sounds/tink.wav";
        AUDIO.currentTime = 0;
        AUDIO.play();
    },
}

=======
import * as constant from './constants.js';

const GEM_PUZZLE = {
    elements: {
        main: null, //board
        menu: null,
        timer: null,
        updateBtn: null,
        movesCounter: null,
        fieldSizeSelect: null, //container with input to choose size of the field
        puzzlesContainer: null, //puzzles area
        puzzles: [], // HTML elements puzzles
     },

    properties: {
        time: {
            minutes: constant.MINUTES,
            sec: constant.SEC,
            id: null,
        },
        moves: constant.MOVES,
        size: null, // row and column length in puzzle field
        fieldSize: constant.STANDARD_FIELD_SIZE,
        emptyTile: null,
        emptyTileRow: null,
        emptyTileColumn: null,
        tilesSequence: [], // initial puzzles content sequence
        puzzlesArray: null, //current puzzles sequence in 2d array
    },

    init() {
        /*create and append HTML elements*/
        this.createGameBoard();
        this.createPuzzlesContainer();
        this.createMenu();
        this.createTimer();
        this.createMovesCounter();    
        this.createUpdateButton();
        this.createFieldSelectionBlock();
        this.appendElements();
        /*init functions to create random sequence, puzzles on field and start timer*/
        this.createTilesSequence(this.properties.fieldSize);
        this.createPuzzle(this.properties.fieldSize); 
        this.createPuzzlesArray(this.properties.fieldSize); 
        this.timerOn();
        this.createFieldSizeSelectionMenu();
    },

    createGameBoard() {
        this.elements.main = document.createElement('div');
        this.elements.main.classList.add('gameboard');
    },

    createPuzzlesContainer() {
        this.elements.puzzlesContainer = document.createElement('div');
        this.elements.puzzlesContainer.classList.add('puzzle');  
    },

    createMenu() {
        this.elements.menu = document.createElement('div');
        this.elements.menu.classList.add('menu');
    },

    createTimer() {
        this.elements.timer = document.createElement('div');
        this.elements.timer.innerHTML = constant.TIMER_INNER_HTML;
        this.elements.timer.classList.add('menu__timer');
    },

    createMovesCounter() {
        this.elements.movesCounter = document.createElement('div');
        this.elements.movesCounter.innerHTML = constant.MOVES_COUNTER_INNER_HTML;
        this.elements.movesCounter.classList.add('menu__movesCounter');
    },

    createUpdateButton() {
        this.elements.updateBtn = document.createElement('div');
        this.elements.updateBtn.innerHTML = constant.BUTTON_ICON_CREATE;
        this.elements.updateBtn.classList.add('update-bcg');
        this.elements.updateBtn.addEventListener('click', () => {
            this.properties.moves = constant.MOVES;
            this.elements.movesCounter.innerHTML = `moves: ${this.properties.moves}`;
            this.createTilesSequence(this.properties.fieldSize);
            this.updatePuzzle(this.properties.fieldSize);
            this.createPuzzlesArray(this.properties.fieldSize);
            this.clearTimer();
            this.timerOn();
        });
    },

    createFieldSelectionBlock() {
        this.elements.fieldSizeSelect = document.createElement('div');
        this.elements.fieldSizeSelect.innerHTML = constant.FIELD_SIZE_SELECT_BLOCK;
        this.elements.fieldSizeSelect.classList.add('menu__fieldSizeSelect');
    },

    createFieldSizeSelectionMenu() {
        const fieldSizeSelectionMenu = document.querySelector('#fieldSize');
        fieldSizeSelectionMenu.addEventListener('change', (e) => {
            this.properties.fieldSize = constant.FIELD_SIZE_OPTIONS[e.target.value];
            this.createTilesSequence(this.properties.fieldSize);
            this.elements.puzzlesContainer.innerHTML = '';
            this.createPuzzle(this.properties.fieldSize); 
            this.createPuzzlesArray(this.properties.fieldSize); 
            this.clearTimer();
            this.timerOn();
        });
    },

    appendElements() {
        this.elements.menu.append(this.elements.timer);
        this.elements.menu.append(this.elements.movesCounter);
        this.elements.menu.append(this.elements.updateBtn);
        this.elements.main.append(this.elements.fieldSizeSelect);
        this.elements.main.append(this.elements.menu);
        this.elements.main.append(this.elements.puzzlesContainer);
        document.body.append(this.elements.main);
    },

    timerOn() {
        const SELF = this; //save reference to GemPuzzle object
        let minutes = this.properties.time.minutes;
        let sec = this.properties.time.sec;
        function count(self) {
            sec++;
            self.properties.time.sec = sec;

            if (sec === 60) {
                sec = 0;
                minutes++;
                self.properties.time.minutes = minutes;
            };

            if (minutes < 10) {
                (sec < 10) ? self.elements.timer.innerHTML = `time: 0${minutes}:0${sec}`: self.elements.timer.textContent = `time: 0${minutes}:${sec}`;
            } else {
                (sec < 10) ? self.elements.timer.innerHTML = `time: ${minutes}:0${sec}`: self.elements.timer.textContent = `time: ${minutes}:${sec}`;
            };
        };
        const TIMER_ID = setInterval (() => count(SELF), 1000); 
        this.properties.time.id = TIMER_ID;
    },

    clearTimer() {
        clearInterval(this.properties.time.id);
        this.properties.time.minutes = constant.MINUTES;
        this.properties.time.sec = constant.SEC;
    },
    
    /*create array of random numbers for puzzles*/
    createTilesSequence(puzzleSize) { 
        this.properties.tilesSequence = [];

        for (let i = 0; i < puzzleSize; i++) {
            let randomNumber = this.randomInteger(1, puzzleSize);  
            (this.properties.tilesSequence.includes(randomNumber)) ? --i : this.properties.tilesSequence.push(randomNumber);
        };          
    },

    /*generate random number from min to (max+1)*/
    randomInteger(min, max) { 
        return Math.floor(min + Math.random() * (max + 1 - min));
    },

    /*create 2d array of current puzzles situation*/
    createPuzzlesArray(puzzleSize) { 
        this.properties.puzzlesArray = new Array(this.properties.size);
        this.properties.puzzlesArray.fill(new Array(this.properties.size));

        for (let j = 0; j < this.properties.puzzlesArray.length; j++) {
            this.properties.puzzlesArray[j] = new Array(this.properties.size);
        };

        let i = 0;

        for (let j = 0; j < this.properties.size; j++) {
            for (let k = 0; k < this.properties.size; k++) {
               this.properties.puzzlesArray[j][k] = this.elements.puzzles[i];
               i++;
            };
        };

        this.defineClickableTiles(); // add clickable class to tiles around empty one
    },
    
    /*switch empty tile and clicked tile*/
    changeSequence(tileTarg) { 
        let currentTileColumn;
        let currentTileRow;
        
        if (!tileTarg) {
            return
        };

        this.properties.moves++;
        this.playSound();
        this.elements.movesCounter.innerHTML = `moves: ${this.properties.moves}`;
        /*change flex order between tiles */
        let currentOrder =  tileTarg.style.order; 
        let emptyOrder = this.properties.emptyTile.style.order;
        tileTarg.style.order = emptyOrder;
        this.properties.emptyTile.style.order = currentOrder;
        
        /* detect clicked tile coordinates in 2d puzzlesArray */
        this.properties.puzzlesArray.map(item => {
            if (item.indexOf(tileTarg) === -1) {
                return;
            } 
            
            currentTileRow = this.properties.puzzlesArray.indexOf(item);
            currentTileColumn = this.properties.puzzlesArray[currentTileRow].indexOf(tileTarg);
        });
        /* remove all outdated clickable classes*/
        this.properties.puzzlesArray.map(item => {
            item.map(item => {
               item.classList.remove("clickable");
            });
        });
        /* switch tiles elements in 2d-puzzlesArray */
        [this.properties.puzzlesArray[currentTileRow][currentTileColumn], this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn]] = [this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn], this.properties.puzzlesArray[currentTileRow][currentTileColumn]];
        /*as tiles were switched, we need to re-define clickable tiles*/
        this.defineClickableTiles();
    },      

    /*after each click we find emty tile and add clickable class to all neighbour tiles*/
    defineClickableTiles() { 
        let emptyTile;
        let row;
        let column;
        
        for (let j = 0; j < this.properties.size; j++) {
            for (let k = 0; k < this.properties.size; k++) {
                if (!(this.properties.puzzlesArray[j][k].classList.contains('empty'))) {
                   continue;
                };

                emptyTile = this.properties.puzzlesArray[j][k];
                row = j;
                column = k;
                /*add clickable class to all neighbour tiles */
                if (k < this.properties.size - 1) {
                    this.properties.puzzlesArray[j][k + 1].classList.add('clickable');
                };

                if (k > 0) {
                    this.properties.puzzlesArray[j][k - 1].classList.add('clickable');
                };

                if (j > 0) {
                    this.properties.puzzlesArray[j - 1][k].classList.add('clickable');
                };

                if (j < this.properties.size - 1) {
                    this.properties.puzzlesArray[j + 1][k].classList.add('clickable');
                };
            };
        };
       /*save empty tile HTML and coordinates to switch tiles on click */
       this.properties.emptyTile = emptyTile; 
       this.properties.emptyTileRow = row;
       this.properties.emptyTileColumn = column;
    },

    /*make HTML field of puzzles*/
    createPuzzle(puzzleSize) {
        for (let i = 0; i < puzzleSize; i++) {
            const PUZZLE_TILE = document.createElement("div");
            const PUZZLE_TILE_CONTENT = document.createElement("span");
            PUZZLE_TILE.classList.add("puzzle__tile");
            /* define tile size depending on field size*/
            PUZZLE_TILE.classList.add(`${constant.TILE_SIZE_CLASSES[puzzleSize]}`);
            PUZZLE_TILE_CONTENT.textContent = this.properties.tilesSequence[i];
            PUZZLE_TILE.style.order = i;
    
            if (PUZZLE_TILE_CONTENT.textContent === String(puzzleSize)) {
                PUZZLE_TILE.classList.add('empty');
            };

            PUZZLE_TILE.addEventListener('click', (e) => {
                let tileTarg;

                if (e.target.classList.contains('clickable')) { //check if the tile or span element was clicked
                    tileTarg = e.target;
                } else if (e.target.parentNode.classList.contains('clickable')) {
                    tileTarg = e.target.parentNode;
                };

                this.changeSequence(tileTarg); //call tiles change
            });

            PUZZLE_TILE.append(PUZZLE_TILE_CONTENT);
            this.elements.puzzlesContainer.append(PUZZLE_TILE);
        };
        this.properties.size = Math.sqrt(puzzleSize); //length of row and column of puzzle field
        this.elements.puzzles = Array.from(this.elements.puzzlesContainer.querySelectorAll('.puzzle__tile')); //get all the puzzles as HTML elements
    },

    /*start new game*/
    updatePuzzle(puzzleSize) { 
        for (let i = 0; i < this.elements.puzzles.length; i++) {
            this.elements.puzzles[i].classList.remove('empty');
            this.elements.puzzles[i].innerHTML = `<span>${this.properties.tilesSequence[i]}</span>`;
            this.elements.puzzles[i].style.order = i;     
           
            if (this.properties.tilesSequence[i] === puzzleSize) {
                this.elements.puzzles[i].classList.add("empty");  
            };
        };
    },

    playSound() {
        const AUDIO = document.createElement('audio');
        AUDIO.src = "assets/sounds/tink.wav";
        AUDIO.currentTime = 0;
        AUDIO.play();
    },
}

>>>>>>> Stashed changes
window.addEventListener('load', GEM_PUZZLE.init());