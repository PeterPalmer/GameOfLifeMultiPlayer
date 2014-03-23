module GameOfLife {

    export class GameEngine {

        public GetSurvivingCells(aliveMatrix: CellMatrix): Array<Cell> {
            var neighbours = new CellMatrix();
            var survivors = new Array<Cell>(0);
            var i;

            for (i = 0; i < aliveMatrix.cells.length; i++) {
                this.AddNeighbours(aliveMatrix.cells[i], neighbours);
            }

            for (var cellIndex in neighbours.cells) {
                if (!neighbours.cells.hasOwnProperty(cellIndex)) {
                    continue;
                }

                this.KillCells(neighbours.cells[cellIndex], aliveMatrix, neighbours, survivors);
            }

            return survivors;
        }

        private AddNeighbours(center: Cell, neighbours: CellMatrix) {

            if (center == null) {
                return;
            }

            for (var x = center.Col - 1; x < center.Col + 2; x++) {
                for (var y = center.Row - 1; y < center.Row + 2; y++) {

                    if (x === center.Col && y === center.Row) {
                        continue;
                    }

                    neighbours.Set(x, y);
                }
            }

        }

        private KillCells(cell: Cell, aliveMatrix: CellMatrix, neighbours: CellMatrix, survivors: Array<Cell>): void {
            if (cell == null) {
                return;
            }

            var isDead = aliveMatrix.Get(cell.Col, cell.Row) == null;

            var neighbourCount = 0;
            for (var x = cell.Col - 1; x < cell.Col + 2; x++) {
                for (var y = cell.Row - 1; y < cell.Row + 2; y++) {

                    if (x === cell.Col && y === cell.Row) {
                        continue;
                    }

                    if (aliveMatrix.Get(x, y) != null) {
                        neighbourCount++;
                    }
                }
            }

            if (neighbourCount === 3 || (neighbourCount === 2 && !isDead)) {
                survivors.push(cell);
            }
        }

    }

}