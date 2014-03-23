var GameOfLife;
(function (GameOfLife) {
    var GameEngine = (function () {
        function GameEngine() {
        }
        GameEngine.prototype.GetSurvivingCells = function (aliveMatrix) {
            var neighbours = new GameOfLife.CellMatrix();
            var survivors = new Array(0);
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
        };

        GameEngine.prototype.AddNeighbours = function (center, neighbours) {
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
        };

        GameEngine.prototype.KillCells = function (cell, aliveMatrix, neighbours, survivors) {
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
        };
        return GameEngine;
    })();
    GameOfLife.GameEngine = GameEngine;
})(GameOfLife || (GameOfLife = {}));
//# sourceMappingURL=GameEngine.js.map
