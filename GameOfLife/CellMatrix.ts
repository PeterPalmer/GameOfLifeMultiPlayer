module GameOfLife {
    export class CellMatrix {
        public cells: Cell[];

        constructor() {
            this.cells = new Array<Cell>();
        }

        public Remove(x: number, y: number): void {
            for (var cellIndex in this.cells) {
                if (!this.cells.hasOwnProperty(cellIndex)) {
                    continue;
                }

                if (this.cells[cellIndex].Col === x && this.cells[cellIndex].Row === y) {
                    this.cells.splice(cellIndex, 1);
                    return;
                }
            }
        }

        public Set(x: number, y: number): void {
            var cell = new Cell(y, x);
            this.FixCoordinates(cell);
            this.cells[cell.CellKey] = cell;
        }

        public Get(x: number, y: number): Cell {
            var cell = new Cell(y, x);
            this.FixCoordinates(cell);
            return this.cells[cell.CellKey];
        }

        private FixCoordinates(cell: Cell) {
            if (cell.Col === -1) { cell.Col = 19; }
            if (cell.Col === 20) { cell.Col = 0; }
            if (cell.Row === -1) { cell.Row = 19; }
            if (cell.Row === 20) { cell.Row = 0; }
        }
    }
}