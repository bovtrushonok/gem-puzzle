const GemPuzzle = {
    elements: {
        main: null, //board
        menu: null,
        puzzlesContainer: null, //puzzles area
        puzzles: [], // HTML elements puzzles
     },

    properties: {
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
        this.elements.main.append(this.elements.menu);
        this.elements.main.append(this.elements.puzzlesContainer);
        document.body.append(this.elements.main);
        
        this.createTilesSequence(16);//invoke on button to chooze size of field
        this.createPuzzle(16); //invoke on button to chooze size of field 
        this.elements.puzzles = Array.from(this.elements.puzzlesContainer.querySelectorAll('.gameboard__puzzle__tile'));
        this.createPuzzlesArray(16); //invoke on button to choose size of field
       // this.timerOn();
    },

    createTilesSequence(puzzleSize) { //create array of random numbers for puzzles
        for (let i = 0; i < puzzleSize; i++) {
            let randomNumber = this.randomInteger(1, puzzleSize);  
            if (this.properties.tilesSequence.includes(randomNumber)) --i;
            else this.properties.tilesSequence.push(randomNumber);   
        };          
    },

    randomInteger(min, max) { // случайное число от min до (max+1)
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
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
    
    changeSequence(e) { //to switch empty tile and available for click tile
        let currentTileColumn;
        let currentTileRow;
        if (e.target.classList.contains('empty')) return; 
        if (e.target.classList.contains('clickable')) {
            let currentOrder =  e.target.style.order; //change flex order between tiles
            let emptyOrder = this.properties.emptyTile.style.order
            e.target.style.order = emptyOrder;
            this.properties.emptyTile.style.order = currentOrder;
            for (let j = 0; j < this.properties.size; j++) { //switch tiles in puzzlesArray
                if (this.properties.puzzlesArray[j].indexOf(e.target) !== -1) {
                    currentTileRow = j;
                    currentTileColumn = this.properties.puzzlesArray[j].indexOf(e.target);
                    
                }
                for (let k = 0; k < this.properties.size; k++) { //clear all clickable classes to re-define the clickable tiles further
                    this.properties.puzzlesArray[j][k].classList.remove("clickable");
                };
            };
        [this.properties.puzzlesArray[currentTileRow][currentTileColumn], this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn]] = [this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn], this.properties.puzzlesArray[currentTileRow][currentTileColumn]];
        }

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
            puzzleTile.classList.add("gameboard__puzzle__tile");
            switch(puzzleSize) {
                case 16:
                    puzzleTile.classList.add("standart");
                break
                case 9:
                    puzzleTile.classList.add("standart");
                break
                case 25:
                    puzzleTile.classList.add("standart");
                break
                case 36:
                    puzzleTile.classList.add("standart");
                break
                case 49:
                    puzzleTile.classList.add("standart");
                break
                case 64:
                    puzzleTile.classList.add("standart");
                break
            };

            puzzleTile.textContent = this.properties.tilesSequence[i];
            puzzleTile.style.order = i;
    
            if (puzzleTile.textContent == 9) puzzleTile.classList.add('empty');
            puzzleTile.addEventListener('click', (e) => {
                this.changeSequence(e);
            });
            this.elements.puzzlesContainer.append(puzzleTile);
        };
        this.properties.size = Math.sqrt(puzzleSize);
 
    },
}

window.addEventListener('load', GemPuzzle.init());