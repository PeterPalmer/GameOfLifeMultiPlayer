var GameOfLife;
(function (GameOfLife) {
    var Grid = (function () {
        function Grid(canvas, size) {
            this.size = size;
            this.cellSize = this.size / 20;

            if (canvas == null) {
                return;
            }

            this.InitializeCanvas(canvas);
        }
        Grid.prototype.InitializeCanvas = function (canvas) {
            this.ctx = canvas.getContext("2d");
            this.ctx.fillStyle = "rgb(255, 255, 255)";
            this.ctx.strokeStyle = "rgb(150, 180, 255)";

            this.DrawGrid(null);
        };

        Grid.prototype.DrawGrid = function (aliveCells) {
            this.ctx.fillStyle = "rgb(255, 255, 255)";
            this.ctx.clearRect(0, 0, this.size, this.size);

            this.ctx.beginPath();
            for (var x = 0; x < this.size; x += this.cellSize) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.size);
                this.ctx.moveTo(0, x);
                this.ctx.lineTo(this.size, x);
            }
            this.ctx.stroke();

            if (this.hooverCell != null) {
                this.ctx.fillStyle = "rgb(240, 240, 250)";
                this.ctx.rect(this.hooverCell.Col * this.cellSize + 1, this.hooverCell.Row * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);
                this.ctx.closePath();
                this.ctx.fill();
            }

            if (aliveCells == null || aliveCells.length === 0) {
                return;
            }

            this.ctx.beginPath();
            this.ctx.fillStyle = "rgb(40, 40, 50)";

            for (var cellIndex in aliveCells) {
                if (!aliveCells.hasOwnProperty(cellIndex)) {
                    continue;
                }

                var cell = aliveCells[cellIndex];
                this.ctx.rect(cell.Col * this.cellSize + 1, cell.Row * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);
            }

            this.ctx.closePath();
            this.ctx.fill();
        };

        Grid.prototype.CellFromPixels = function (mouseX, mouseY) {
            if (this.ctx == null) {
                return;
            }

            var canvasX = mouseX - this.ctx.canvas.offsetLeft;
            var canvasY = mouseY - this.ctx.canvas.offsetTop;

            var gridColumn = Math.floor(canvasX / this.cellSize);
            var gridRow = Math.floor(canvasY / this.cellSize);

            return new GameOfLife.Cell(gridRow, gridColumn);
        };

        Grid.prototype.SetHooverCell = function (cell) {
            if (this.hooverCell != null && this.hooverCell.Equals(cell)) {
                return false;
            }

            this.hooverCell = cell;
            return true;
        };
        return Grid;
    })();
    GameOfLife.Grid = Grid;
})(GameOfLife || (GameOfLife = {}));
//# sourceMappingURL=Grid.js.map
