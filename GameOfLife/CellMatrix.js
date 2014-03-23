var GameOfLife;
(function (GameOfLife) {
    var CellMatrix = (function () {
        function CellMatrix() {
            this.cells = new Array();
        }
        CellMatrix.prototype.Remove = function (x, y) {
            for (var cellIndex in this.cells) {
                if (!this.cells.hasOwnProperty(cellIndex)) {
                    continue;
                }

                if (this.cells[cellIndex].Col === x && this.cells[cellIndex].Row === y) {
                    this.cells.splice(cellIndex, 1);
                    return;
                }
            }
        };

        CellMatrix.prototype.Set = function (x, y) {
            var cell = new GameOfLife.Cell(y, x);
            this.FixCoordinates(cell);
            this.cells[cell.CellKey] = cell;
        };

        CellMatrix.prototype.Get = function (x, y) {
            var cell = new GameOfLife.Cell(y, x);
            this.FixCoordinates(cell);
            return this.cells[cell.CellKey];
        };

        CellMatrix.prototype.FixCoordinates = function (cell) {
            if (cell.Col === -1) {
                cell.Col = 19;
            }
            if (cell.Col === 20) {
                cell.Col = 0;
            }
            if (cell.Row === -1) {
                cell.Row = 19;
            }
            if (cell.Row === 20) {
                cell.Row = 0;
            }
        };
        return CellMatrix;
    })();
    GameOfLife.CellMatrix = CellMatrix;
})(GameOfLife || (GameOfLife = {}));
//# sourceMappingURL=CellMatrix.js.map
