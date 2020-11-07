const GemPuzzle = {
    elements: {
        main: null, //board
        menu: null,
        puzzlesContainer: null, //puzzles area
        puzzles: [], // puzzles
    },

    properties: {
        tilesSequence: [],
        puzzlesArray: null,
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
    },

    randomInteger(min, max) { // случайное число от min до (max+1)
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    },

    createPuzzlesArray(puzzleSize) { //form 2d array of current field situation
        this.properties.puzzlesArray = new Array(Math.sqrt(puzzleSize));
        for (let j = 0; j < this.properties.puzzlesArray.length; j++) {
            this.properties.puzzlesArray[j] = new Array(Math.sqrt(puzzleSize));
        };
        console.log(this.properties.puzzlesArray);
        let i = 0;
        for (let j = 0; j < Math.sqrt(puzzleSize); j++) {
            for (let k = 0; k < Math.sqrt(puzzleSize); k++) {
               this.properties.puzzlesArray[j][k] = this.elements.puzzles[i];
               i++;
               console.log(this.properties.puzzlesArray);
               this.properties.puzzlesArray[j][k].addEventListener('click', () => {
                    if (this.properties.puzzlesArray[j][k+1].classList.contains('empty')) {       
                        this.properties.puzzlesArray[j][k+1].style.order = this.properties.puzzlesArray[j][k+1].style.order * 1 - 1;  
                        this.properties.puzzlesArray[j][k].style.order = this.properties.puzzlesArray[j][k].style.order * 1 + 1;
           
                        //[this.elements.puzzles[j][k], this.elements.puzzles[j][k+1]] = [this.elements.puzzles[j][k+1], this.elements.puzzles[j][k]];
                        console.log(this.properties.puzzlesArray);
                    }       
                });
            };
        };
   
       /* for(let i = 0; i < puzzleSize; i++) {
            this.elements.puzzles[i].addEventListener('click', () => {
               
                if (this.elements.puzzles[i+1].classList.contains('empty')) {      

                    this.elements.puzzles[i+1].style.order = this.elements.puzzles[i+1].style.order * 1 - 1;
                    this.elements.puzzles[i].style.order = this.elements.puzzles[i].style.order * 1 + 1;         
                    [this.elements.puzzles[i], this.elements.puzzles[i+1]] = [this.elements.puzzles[i+1], this.elements.puzzles[i]]; 
                }
            });
        };*/
    },

    createPuzzle(puzzleSize) {
        for (let i = 0; i < puzzleSize; i++) {
            const puzzleTile = document.createElement("div");
            puzzleTile.classList.add("gameboard__puzzle__tile");
            puzzleTile.textContent = this.properties.tilesSequence[i];
            puzzleTile.style.order = i;
    
            if (i == puzzleSize - 1) {
                puzzleTile.classList.add('empty');
            };
            this.elements.puzzlesContainer.append(puzzleTile);
        };
    },
}

window.addEventListener('load', GemPuzzle.init());