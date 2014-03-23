module GameOfLife {

    export class Cell {
        Row: number;
        Col: number;

        constructor(row: number, col: number) {
            this.Row = row;
            this.Col = col;
        }

        public static Clone(cell: Cell): Cell {
            return new Cell(cell.Row, cell.Col);
        }

        public Equals(comparedCell: Cell): boolean {
            if (comparedCell == null) {
                return false;
            }

            return this.Row === comparedCell.Row && this.Col === comparedCell.Col;
        }

        public get CellKey(): number {
            return this.Col + this.Row * 20;
        }

    }
} 