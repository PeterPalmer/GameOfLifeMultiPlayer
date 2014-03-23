var GameOfLife;
(function (GameOfLife) {
    var Cell = (function () {
        function Cell(row, col) {
            this.Row = row;
            this.Col = col;
        }
        Cell.Clone = function (cell) {
            return new Cell(cell.Row, cell.Col);
        };

        Cell.prototype.Equals = function (comparedCell) {
            if (comparedCell == null) {
                return false;
            }

            return this.Row === comparedCell.Row && this.Col === comparedCell.Col;
        };

        Object.defineProperty(Cell.prototype, "CellKey", {
            get: function () {
                return this.Col + this.Row * 20;
            },
            enumerable: true,
            configurable: true
        });
        return Cell;
    })();
    GameOfLife.Cell = Cell;
})(GameOfLife || (GameOfLife = {}));
//# sourceMappingURL=Cell.js.map
