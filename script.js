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
        puzzlesArray: null, //current puzzles sequence
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
        
        this.createTilesSequence(9);//invoke on button to chooze size of field
        this.createPuzzle(9); //invoke on button to chooze size of field 
        this.elements.puzzles = Array.from(this.elements.puzzlesContainer.querySelectorAll('.gameboard__puzzle__tile'));
        this.createPuzzlesArray(9); //invoke on button to choose size of field
    },

    createTilesSequence(puzzleSize) {
        for (let i = 0; i < puzzleSize; i++) {
            let randomNumber = this.randomInteger(1, 9);  
            if (this.properties.tilesSequence.includes(randomNumber)) --i;
            else this.properties.tilesSequence.push(randomNumber);   
        };        
        console.log(this.properties.tilesSequence);   
    },

    randomInteger(min, max) { // случайное число от min до (max+1)
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    },

    createPuzzlesArray(puzzleSize) { //form 2d array of current field situation
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
        this.defineClickableTiles();
    },
    
    changeSequence(e) { //to change orders of tiles 
        let currentTileColumn;
        let currentTileRow;
        if (e.target.classList.contains('empty')) return; 
        if (e.target.classList.contains('clickable')) {
            let currentOrder =  e.target.style.order;
            let emptyOrder = this.properties.emptyTile.style.order
            e.target.style.order = emptyOrder;
            this.properties.emptyTile.style.order = currentOrder;
            for (let j = 0; j < this.properties.size; j++) {
                if (this.properties.puzzlesArray[j].indexOf(e.target) !== -1) {
                    currentTileRow = j;
                    currentTileColumn = this.properties.puzzlesArray[j].indexOf(e.target);
                    
                }
                for (let k = 0; k < this.properties.size; k++) {
                    this.properties.puzzlesArray[j][k].classList.remove("clickable");
                };
            };
            //   console.log(currentTileRow, currentTileColumn, this.properties.emptyTileRow, this.properties.emptyTileColumn);
         [this.properties.puzzlesArray[currentTileRow][currentTileColumn], this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn]] = [this.properties.puzzlesArray[this.properties.emptyTileRow][this.properties.emptyTileColumn], this.properties.puzzlesArray[currentTileRow][currentTileColumn]];
           // console.log(this.properties.puzzlesArray);
        }

        this.defineClickableTiles()
    },      

    defineClickableTiles() {
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
      this.properties.emptyTile = emptyTile;
      this.properties.emptyTileRow = row;
      this.properties.emptyTileColumn = column;
   
    },

    createPuzzle(puzzleSize) {
        for (let i = 0; i < puzzleSize; i++) {
            const puzzleTile = document.createElement("div");
            puzzleTile.classList.add("gameboard__puzzle__tile");
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