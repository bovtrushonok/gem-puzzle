const K = 7;
const MOVES = 0;
const MINUTES = 0;
const SEC = -1;
const STANDARD_FIELD_SIZE = 16;
const FIELD_SIZE_SELECT_BLOCK = `<label for="fieldSize" style="width:100%">Choose a field size:</label> 
                                 <input list="sizes" id="fieldSize" name="fieldSize" style="width:50%"/>
                                 <datalist id="sizes">
                                 <option value="3x3">
                                 <option value="4x4">
                                 <option value="5x5">
                                 <option value="6x6">
                                 <option value="7x7">
                                 <option value="8x8">
                                 </datalist>`;
const TIMER_INNER_HTML = `<span>time:<span>`;
const MOVES_COUNTER_INNER_HTML = `<span>moves:<span>`;
const BUTTON_ICON_CREATE = `<span class="material-icons">settings_backup_restore</span>`;
const FIELD_SIZE_OPTIONS = {
   "3x3": 9,
   "4x4": 16,
   "5x5": 25,
   "6x6": 36,
   "7x7": 49,
   "8x8": 64,
};

const TILE_SIZE_CLASSES = {
   9: "large-size",
   16: "standart-size",
   25: "medium-size",
   36: "small-size",
   49: "extra-small-size",
   64: "extra-extra-small-size",
}


export {K, MINUTES, SEC, MOVES, STANDARD_FIELD_SIZE, FIELD_SIZE_SELECT_BLOCK, TIMER_INNER_HTML, MOVES_COUNTER_INNER_HTML, BUTTON_ICON_CREATE, FIELD_SIZE_OPTIONS, TILE_SIZE_CLASSES};
