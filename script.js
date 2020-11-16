const GemPuzzle = {
    elements: {
        main: null, //board
        menu: null,
        timer: null,
        updateBtn: null,
        movesCounter: null,
        puzzlesContainer: null, //puzzles area
        puzzles: [], // HTML elements puzzles
     },

    properties: {
        time: {
            minutes: 0,
            sec: -1,
            id: null,
        },
        moves: 0,
        size: null, 
        emptyTile: null,
        emptyTileRow: null,
        emptyTileColumn: null,
        tilesSequence: [], // initial puzzles content sequence
        puzzlesArray: null, //current puzzles sequence in 2d array
    },

    init() {
        this.elements.main = document.createElement('div');
        this.elements.main.classList.add('gameboard');
        this.elements.puzzlesContainer = document.createElement('div');
        this.elements.puzzlesContainer.classList.add('gameboard__puzzle');  
        this.elements.menu = document.createElement('div');
        this.elements.menu.classList.add('gameboard__menu');  
        this.elements.timer = document.createElement('div');
        this.elements.timer.innerHTML = `<span>time:<span>`;
        this.elements.timer.classList.add('gameboard__menu__timer');
        this.elements.movesCounter = document.createElement('div');
        this.elements.movesCounter.innerHTML = `<span>moves:<span>`;
        this.elements.movesCounter.classList.add('gameboard__menu__movesCounter');
        this.elements.updateBtn = document.createElement('div');
        this.elements.updateBtn.innerHTML = `<span class="material-icons">settings_backup_restore</span>`; //`<span class="material-icons">settings_backup_restore</span>`;
        this.elements.updateBtn.classList.add('update-bcg');
        this.elements.updateBtn.addEventListener('click', () => {
            this.properties.moves = 0;
            this.createTilesSequence(16);
            this.updatePuzzle(16);
            this.createPuzzlesArray(16);
            this.clearTimer();
            this.timerOn();
        });
        this.elements.menu.append(this.elements.timer);
        this.elements.menu.append(this.elements.movesCounter);
        this.elements.menu.append(this.elements.updateBtn);
        this.elements.main.append(this.elements.menu);
        this.elements.main.append(this.elements.puzzlesContainer);
        document.body.append(this.elements.main);
        
        this.createTilesSequence(16);//invoke on button to chooze size of field
        this.createPuzzle(16); //invoke on button to chooze size of field 
        this.createPuzzlesArray(16); //invoke on button to choose size of field
        this.timerOn();
    },

    timerOn() {
        const self = this;
        let minutes = 0;
        let sec = -1;
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
        let timerId = setInterval (() => count(self), 1000); 
        this.properties.time.id = timerId;
    },

    clearTimer() {
        clearInterval(this.properties.time.id);
    },
    

    createTilesSequence(puzzleSize) { //create array of random numbers for puzzles
        this.properties.tilesSequence = [];
        for (let i = 0; i < puzzleSize; i++) {
            let randomNumber = this.randomInteger(1, puzzleSize);  
            if (this.properties.tilesSequence.includes(randomNumber)) --i;
            else this.properties.tilesSequence.push(randomNumber);   
        };          
    },

    randomInteger(min, max) { // случайное число от min до (max+1)
        return Math.floor(min + Math.random() * (max + 1 - min));
    },

    createPuzzlesArray(puzzleSize) { //create 2d array of current puzzles situation
        this.properties.puzzlesArray = new Array(this.properties.size);
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
    
    changeSequence(tileTarg) { //to switch empty tile and available for click tile
        let currentTileColumn;
        let currentTileRow;
            
        if (tileTarg) {
            this.properties.moves++;
            this.playSound();
            this.elements.movesCounter.innerHTML = `moves: ${this.properties.moves}`;
            let currentOrder =  tileTarg.style.order; //change flex order between tiles
            let emptyOrder = this.properties.emptyTile.style.order;
            //tileTarg.style.transition = 'order 0.5s';
            tileTarg.style.order = emptyOrder;
            this.properties.emptyTile.style.order = currentOrder;
            for (let j = 0; j < this.properties.size; j++) { //switch tiles in puzzlesArray
                if (this.properties.puzzlesArray[j].indexOf(tileTarg) !== -1) {
                    currentTileRow = j;
                    currentTileColumn = this.properties.puzzlesArray[j].indexOf(tileTarg);
                }
                for (let k = 0; k < this.properties.size; k++) { //clear all clickable classes to re-define the clickable tiles further
                    this.properties.puzzlesArray[j][k].classList.remove("clickable");
                };
            };
        [this.properties.puzzlesArray[currentTileRow][currentTileColumn], this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn]] = [this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn], this.properties.puzzlesArray[currentTileRow][currentTileColumn]];
        };

        this.defineClickableTiles() //as tiles were switched, we need to re-define clickable tiles
    },      

    defineClickableTiles() { //after each click we find emty tile and add clickable class to all needed tiles
        let emptyTile;
        let row;
        let column;
        for (let j = 0; j < this.properties.size; j++) {
            for (let k = 0; k < this.properties.size; k++) {
               if (this.properties.puzzlesArray[j][k].classList.contains('empty')) {
                emptyTile = this.properties.puzzlesArray[j][k];
                 row = j;
                 column = k;
                if (k < this.properties.size - 1) this.properties.puzzlesArray[j][k + 1].classList.add('clickable');
                if (k > 0) this.properties.puzzlesArray[j][k - 1].classList.add('clickable');
                if (j > 0) this.properties.puzzlesArray[j - 1][k].classList.add('clickable');
                if (j < this.properties.size - 1) this.properties.puzzlesArray[j + 1][k].classList.add('clickable');
               };
            };
        };
      this.properties.emptyTile = emptyTile; //save empty tile HTML and coordinates to switch tiles on click
      this.properties.emptyTileRow = row;
      this.properties.emptyTileColumn = column;
    },

    createPuzzle(puzzleSize) {
        for (let i = 0; i < puzzleSize; i++) {
            const puzzleTile = document.createElement("div");
            const puzzleTileContent = document.createElement("span");
            puzzleTile.classList.add("gameboard__puzzle__tile");
            switch(puzzleSize) {
                case 16:
                    puzzleTile.classList.add("standart-size");
                break
                case 9:
                    puzzleTile.classList.add("small-size");
                break
                case 25:
                    puzzleTile.classList.add("medium-size");
                break
                case 36:
                    puzzleTile.classList.add("large-size");
                break
                case 49:
                    puzzleTile.classList.add("extra-large-size");
                break
                case 64:
                    puzzleTile.classList.add("extra-extra-large-size");
                break
            };

            puzzleTileContent.textContent = this.properties.tilesSequence[i];
            puzzleTile.style.order = i;
    
            if (puzzleTileContent.textContent == puzzleSize) puzzleTile.classList.add('empty');
            puzzleTile.addEventListener('click', (e) => {
                let tileTarg;
                if (e.target.classList.contains('clickable')) {
                    tileTarg = e.target;
                } else if(e.target.parentNode.classList.contains('clickable')) {
                    tileTarg = e.target.parentNode;
                }
                this.changeSequence(tileTarg);
            });
            puzzleTile.append(puzzleTileContent);
            this.elements.puzzlesContainer.append(puzzleTile);
        };
        this.properties.size = Math.sqrt(puzzleSize);
        this.elements.puzzles = Array.from(this.elements.puzzlesContainer.querySelectorAll('.gameboard__puzzle__tile'));
    },

    updatePuzzle(puzzleSize) {
        for (let i = 0; i < this.elements.puzzles.length; i++) {
            this.elements.puzzles[i].classList.remove('empty');
            this.elements.puzzles[i].innerHTML = `<span>${this.properties.tilesSequence[i]}</span>`;
            this.elements.puzzles[i].style.order = i;     
            if (this.properties.tilesSequence[i] === puzzleSize)  this.elements.puzzles[i].classList.add("empty");  
        };
    },

    playSound() {
        const audio = document.createElement('audio');
        audio.src = "assets/sounds/tink.wav";
        audio.currentTime = 0;
        audio.play();
    },
}

window.addEventListener('load', GemPuzzle.init());